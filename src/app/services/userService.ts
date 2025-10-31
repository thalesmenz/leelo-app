import api from '../config/axios';

export const userService = {
  async getById(userId: string) {
    const response = await api.get(`users/${userId}`);
    return response.data;
  },

  async getServices(userId: string) {
    const response = await api.get(`user-services/user/${userId}`);
    return response.data;
  },
}; 