import api from '../config/axios';

export const patientPlanService = {
  async create(userId: string, data: any) {
    const response = await api.post('patient-plans', { ...data, user_id: userId });
    return response.data;
  },

  async getByUserId(userId: string) {
    const response = await api.get(`patient-plans?userId=${userId}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`patient-plans/${id}`);
    return response.data;
  },

  async updateById(id: string, data: any) {
    const response = await api.put(`patient-plans/${id}`, data);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await api.delete(`patient-plans/${id}`);
    return response.data;
  },

  async searchByName(userId: string, name: string) {
    const response = await api.get(`patient-plans/user/${userId}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
}; 