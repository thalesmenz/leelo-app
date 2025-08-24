import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userServiceService = {
  async create(service: any) {
    const response = await axios.post(`${API_URL}user-services`, {
      ...service,
      duration: Number(service.duration),
      price: Number(service.price),
      active: true,
    });
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await axios.get(`${API_URL}user-services/user/${user_id}`);
    return response.data;
  },

  async updateById(id: string, service: any) {
    const response = await axios.put(`${API_URL}user-services/${id}`, {
      ...service,
      duration: Number(service.duration),
      price: Number(service.price),
    });
    return response.data;
  },

  async deleteById(id: string) {
    const response = await axios.delete(`${API_URL}user-services/${id}`);
    return response.data;
  },

  async toggleStatus(id: string) {
    const response = await axios.patch(`${API_URL}user-services/${id}/toggle-status`);
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}user-services/${id}`);
    return response.data;
  },
}; 