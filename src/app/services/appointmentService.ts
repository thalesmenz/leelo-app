import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const appointmentService = {
  async create(appointment: any) {
    const response = await axios.post(`${API_URL}appointments`, appointment);
    return response.data;
  },

  async createWithoutConflictCheck(appointment: any) {
    const response = await axios.post(`${API_URL}appointments/without-conflict-check`, appointment);
    return response.data;
  },

  async getAll(params?: any) {
    const response = await axios.get(`${API_URL}appointments`, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}appointments/${id}`);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await axios.delete(`${API_URL}appointments/${id}`);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await axios.get(`${API_URL}appointments/user/${user_id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await axios.patch(`${API_URL}appointments/${id}/status`, { status });
    return response.data;
  },

  async getAvailableSlots(userId: string, date: string, serviceId?: string) {
    const params = new URLSearchParams({ date });
    if (serviceId) {
      params.append('service_id', serviceId);
    }
    const response = await axios.get(`${API_URL}appointments/user/${userId}/available-slots?${params}`);
    return response.data;
  },
}; 