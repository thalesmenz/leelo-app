import axios from 'axios';
 
const API_URL = 'http://localhost:3001/auth';

export const authService = {
  async signup({ email, password, name }: { email: string; password: string; name: string }) {
    const response = await axios.post(`${API_URL}/signup`, { email, password, name });
    return response.data;
  },

  async signin({ email, password }: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data;
  },

  async getCurrentUser(token: string) {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async signout() {
    // Se quiser, pode remover o token do localStorage/cookie aqui
    return { success: true };
  },
}; 