import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const patientService = {
  async create(patient: any) {
    const response = await axios.post(`${API_URL}patients`, patient);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await axios.get(`${API_URL}patients/${user_id}`);
    return response.data;
  },

  async updateByUserId(user_id: string, patient: any) {
    const response = await axios.put(`${API_URL}patients/${user_id}`, patient);
    return response.data;
  },

  async deleteByUserId(user_id: string) {
    const response = await axios.delete(`${API_URL}patients/${user_id}`);
    return response.data;
  },

  async getAll() {
    const response = await axios.get(`${API_URL}patients`);
    return response.data;
  },

  async deleteById(patientId: string) {
    const response = await axios.delete(`${API_URL}patients/id/${patientId}`);
    return response.data;
  },

  async updateById(patientId: string, patient: any) {
    const response = await axios.put(`${API_URL}patients/id/${patientId}`, patient);
    return response.data;
  },

  async getById(patientId: string) {
    const response = await axios.get(`${API_URL}patients/id/${patientId}`);
    return response.data;
  },

  async searchByName(user_id: string, name: string) {
    const response = await axios.get(`${API_URL}patients/${user_id}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  async getStatistics(user_id: string) {
    const response = await axios.get(`${API_URL}patients/${user_id}/statistics`);
    return response.data;
  },
}; 