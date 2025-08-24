import axios from 'axios';
 
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async signup({ email, password, name }: { email: string; password: string; name: string }) {
    const response = await axios.post(`${API_URL}auth/signup`, { email, password, name });
    return response.data;
  },

  async signin({ email, password }: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}auth/signin`, { email, password });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await axios.post(`${API_URL}auth/refresh`, { refresh_token: refreshToken });
    return response.data;
  },

  async getCurrentUser(token: string) {
    const response = await axios.get(`${API_URL}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async signout(refreshToken: string) {
    const response = await axios.post(`${API_URL}auth/signout`, { refresh_token: refreshToken });
    return response.data;
  },

  async signoutAll() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await axios.post(`${API_URL}auth/signout-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async validateToken(token: string) {
    const response = await axios.get(`${API_URL}auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
}; 