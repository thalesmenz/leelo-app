import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e renovar token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 e não é uma tentativa de renovação
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Se não tem refresh token, redireciona para login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Tenta renovar o token
        const response = await axios.post(`${API_URL}auth/refresh`, {
          refresh_token: refreshToken
        });

        if (response.data.success) {
          const newToken = response.data.data.access_token;
          localStorage.setItem('access_token', newToken);
          
          // Atualiza o header da requisição original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry da requisição original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhou ao renovar, limpa tudo e redireciona
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

