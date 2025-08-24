import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  async getById(userId: string) {
    const response = await axios.get(`${API_URL}users/${userId}`);
    return response.data;
  },

  async getServices(userId: string) {
    const response = await axios.get(`${API_URL}user-services/user/${userId}`);
    return response.data;
  },
}; 