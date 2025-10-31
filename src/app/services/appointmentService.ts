import api from '../config/axios';

export const appointmentService = {
  async create(appointment: any) {
    const response = await api.post('appointments', appointment);
    return response.data;
  },

  async createWithoutConflictCheck(appointment: any) {
    const response = await api.post('appointments/without-conflict-check', appointment);
    return response.data;
  },

  async getAll(params?: any) {
    const response = await api.get('appointments', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`appointments/${id}`);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await api.delete(`appointments/${id}`);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await api.get(`appointments/user/${user_id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await api.patch(`appointments/${id}/status`, { status });
    return response.data;
  },

  async getAvailableSlots(userId: string, date: string, serviceId?: string) {
    const params = new URLSearchParams({ date });
    if (serviceId) {
      params.append('service_id', serviceId);
    }
    const response = await api.get(`appointments/user/${userId}/available-slots?${params}`);
    return response.data;
  },
}; 