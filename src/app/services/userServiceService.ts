import api from '../config/axios';

export const userServiceService = {
  async create(service: any) {
    const response = await api.post('user-services', {
      ...service,
      duration: Number(service.duration),
      price: Number(service.price),
      active: true,
    });
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await api.get(`user-services/user/${user_id}`);
    return response.data;
  },

  async updateById(id: string, service: any) {
    const response = await api.put(`user-services/${id}`, {
      ...service,
      duration: Number(service.duration),
      price: Number(service.price),
    });
    return response.data;
  },

  async deleteById(id: string) {
    const response = await api.delete(`user-services/${id}`);
    return response.data;
  },

  async toggleStatus(id: string) {
    const response = await api.patch(`user-services/${id}/toggle-status`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`user-services/${id}`);
    return response.data;
  },
}; 