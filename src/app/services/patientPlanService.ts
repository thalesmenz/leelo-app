import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const patientPlanService = {
  async create(userId: string, data: any) {
    const response = await axios.post(`${API_URL}patient-plans`, { ...data, user_id: userId });
    return response.data;
  },

  async getByUserId(userId: string) {
    const response = await axios.get(`${API_URL}patient-plans?userId=${userId}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}patient-plans/${id}`);
    return response.data;
  },

  async updateById(id: string, data: any) {
    const response = await axios.put(`${API_URL}patient-plans/${id}`, data);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await axios.delete(`${API_URL}patient-plans/${id}`);
    return response.data;
  },

  async searchByName(userId: string, name: string) {
    const response = await axios.get(`${API_URL}patient-plans/user/${userId}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
}; 