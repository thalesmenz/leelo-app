'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { showToast } from '../utils/toast';

interface User {
  id: string;
  email: string;
  name: string;
  is_subuser?: boolean;
  parent_id?: string | null;
  status?: 'active' | 'inactive';
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  // Função para salvar tokens no localStorage
  const saveTokens = useCallback((authTokens: AuthTokens) => {
    setTokens(authTokens);
    localStorage.setItem('access_token', authTokens.access_token);
    localStorage.setItem('refresh_token', authTokens.refresh_token);
    localStorage.setItem('token_expires', (Date.now() + authTokens.expires_in * 1000).toString());
  }, []);

  // Função para limpar tokens
  const clearTokens = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Limpa outros dados que podem estar relacionados ao usuário
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('user_') || key.startsWith('auth_') || key.startsWith('app_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);

  // Função para verificar se o token expirou
  const isTokenExpired = useCallback(() => {
    const expiresAt = localStorage.getItem('token_expires');
    if (!expiresAt) return true;
    
    return Date.now() > parseInt(expiresAt);
  }, []);

  // Função para renovar token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await authService.refreshToken(refreshToken);
      
      if (response.success) {
        const newTokens: AuthTokens = {
          access_token: response.data.access_token,
          refresh_token: refreshToken, // Mantém o mesmo refresh token
          expires_in: response.data.expires_in
        };
        
        saveTokens(newTokens);
        return newTokens.access_token;
      } else {
        throw new Error('Falha ao renovar token');
      }
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    }
  }, [saveTokens, clearTokens]);

  // Função para carregar usuário do token
  const loadUserFromToken = useCallback(async (token: string) => {
    try {
      const response = await authService.getCurrentUser(token);
      
      if (response.success) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        return userData;
      } else {
        throw new Error('Falha ao carregar usuário');
      }
    } catch (error) {
      throw error;
    }
  }, []);

  // Função de login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Limpa completamente os dados do usuário anterior antes de fazer novo login
      clearTokens();
      setUser(null);
      
      const response = await authService.signin({ email, password });
      
      if (response.success) {
        const { user: userData, session } = response.data;
        
        // Salva tokens
        saveTokens(session);
        
        // Salva usuário e userId
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        
        showToast.success('Login realizado com sucesso!');
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Erro no login');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erro no login';
      showToast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [saveTokens, clearTokens]);

  // Função de logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await authService.signout(refreshToken);
      }
    } catch (error) {
      // Não falha se não conseguir fazer logout na API
    } finally {
      clearTokens();
      setUser(null);
      showToast.success('Logout realizado com sucesso!');
    }
  }, [clearTokens]);

  // Função para logout de todos os dispositivos
  const logoutAllDevices = useCallback(async () => {
    try {
      await authService.signoutAll();
      clearTokens();
      setUser(null);
      showToast.success('Logout de todos os dispositivos realizado!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer logout de todos os dispositivos';
      showToast.error(message);
    }
  }, [clearTokens]);

  // Função para limpar dados de autenticação em caso de erro
  const clearAuthOnError = useCallback(() => {
    clearTokens();
    setUser(null);
    showToast.error('Sessão expirada. Por favor, faça login novamente.');
  }, [clearTokens]);

  // Função para obter token válido (renova se necessário)
  const getValidToken = useCallback(async () => {
    try {
      let token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Se o token expirou, tenta renovar
      if (isTokenExpired()) {
        token = await refreshAccessToken();
      }

      return token;
    } catch (error) {
      clearAuthOnError();
      throw error;
    }
  }, [isTokenExpired, refreshAccessToken, clearAuthOnError]);

  // Inicialização do hook
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('user');
        
        if (!accessToken || !refreshToken || !userData) {
          setLoading(false);
          return;
        }

        // Verifica se o token expirou
        if (isTokenExpired()) {
          // Tenta renovar o token
          try {
            await refreshAccessToken();
            const newToken = localStorage.getItem('access_token');
            if (newToken) {
              await loadUserFromToken(newToken);
            }
          } catch (error) {
            // Se falhar, limpa tudo
            clearTokens();
            setUser(null);
          }
        } else {
          // Token ainda válido, carrega usuário
          const user = JSON.parse(userData);
          setUser(user);
          
          // Verifica se o usuário no token corresponde ao usuário salvo
          try {
            const currentUser = await loadUserFromToken(accessToken);
            if (currentUser.id !== user.id) {
              // Usuário mudou, limpa dados antigos
              clearTokens();
              setUser(null);
              setLoading(false);
              return;
            }
            
            // Atualiza o userId se necessário
            if (localStorage.getItem('userId') !== currentUser.id) {
              localStorage.setItem('userId', currentUser.id);
            }
          } catch (error) {
            // Se falhar ao verificar usuário, limpa tudo
            clearTokens();
            setUser(null);
            setLoading(false);
            return;
          }
          
          // Atualiza tokens no estado
          setTokens({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 0 // Será calculado quando necessário
          });
        }
      } catch (error) {
        // Em caso de erro, limpa tudo
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenExpired, refreshAccessToken, loadUserFromToken, clearTokens]);

  return {
    user,
    loading,
    tokens,
    login,
    logout,
    logoutAllDevices,
    getValidToken,
    isAuthenticated: !!user && !!tokens,
    refreshToken: refreshAccessToken,
    clearAuthOnError,
    userId: user?.id || null
  };
}


