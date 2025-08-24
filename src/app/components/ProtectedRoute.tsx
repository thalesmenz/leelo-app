'use client';

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Lock } from 'phosphor-react';
import { showToast } from '../utils/toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'main_user' | 'any';
  redirectTo?: string;
  showAccessDenied?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'main_user', 
  redirectTo = '/dashboard',
  showAccessDenied = true
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Verifica se o usuário tem permissão para acessar esta rota
  const hasAccess = () => {
    if (requiredRole === 'main_user') {
      return !user?.is_subuser;
    }
    return true;
  };

  // Redireciona se não tiver acesso
  if (!authLoading && isAuthenticated && !hasAccess()) {
    if (showAccessDenied) {
      showToast.error('Acesso negado. Você não tem permissão para acessar esta página.');
    }
    router.push(redirectTo);
    return null;
  }

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado pelo layout)
  if (!isAuthenticated) {
    return null;
  }

  // Se não tiver acesso, mostra tela de acesso negado
  if (!hasAccess()) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 mb-6 flex justify-center">
              <Lock size={64} weight="light" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Acesso Negado
            </h3>
            <p className="text-gray-500 mb-6">
              {requiredRole === 'main_user' 
                ? 'Apenas usuários principais podem acessar esta página.'
                : 'Você não tem permissão para acessar esta página.'
              }
            </p>
            <button 
              onClick={() => router.push(redirectTo)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se tiver acesso, renderiza o conteúdo
  return <>{children}</>;
}
