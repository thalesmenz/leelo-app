import api from '../config/axios';

export const patientService = {
  async create(patient: any) {
    const response = await api.post('patients', patient);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await api.get(`patients/${user_id}`);
    return response.data;
  },

  async updateByUserId(user_id: string, patient: any) {
    const response = await api.put(`patients/${user_id}`, patient);
    return response.data;
  },

  async deleteByUserId(user_id: string) {
    const response = await api.delete(`patients/${user_id}`);
    return response.data;
  },

  async getAll() {
    const response = await api.get('patients');
    return response.data;
  },

  async deleteById(patientId: string) {
    const response = await api.delete(`patients/id/${patientId}`);
    return response.data;
  },

  async updateById(patientId: string, patient: any) {
    const response = await api.put(`patients/id/${patientId}`, patient);
    return response.data;
  },

  async getById(patientId: string) {
    const response = await api.get(`patients/id/${patientId}`);
    return response.data;
  },

  async searchByName(user_id: string, name: string) {
    const response = await api.get(`patients/${user_id}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  async getStatistics(user_id: string) {
    const response = await api.get(`patients/${user_id}/statistics`);
    return response.data;
  },
}; 