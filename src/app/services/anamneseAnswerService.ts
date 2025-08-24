import axios from 'axios';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export const anamneseAnswerService = {
  async create(data: any) {
    const response = await axios.post(`${API_BASE_URL}/anamnese-answers`, data);
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/${id}`);
    return response.data;
  },

  async updateById(id: string, data: any) {
    const response = await axios.put(`${API_BASE_URL}/anamnese-answers/${id}`, data);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/anamnese-answers/${id}`);
    return response.data;
  },

  async deleteByPatientId(patientId: string) {
    const response = await axios.delete(`${API_BASE_URL}/anamnese-answers/patient/${patientId}`);
    return response.data;
  },

  async getByPatientId(patientId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/patient/${patientId}`);
    return response.data;
  },

  async getByAppointmentId(appointmentId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/appointment/${appointmentId}`);
    return response.data;
  },

  async getWithQuestions(patientId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/patient/${patientId}/with-questions`);
    return response.data;
  },

  async bulkCreate(data: any[]) {
    const response = await axios.post(`${API_BASE_URL}/anamnese-answers/bulk`, data);
    return response.data;
  },

  async getStatistics(userId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/statistics/${userId}`);
    return response.data;
  },

  async getByUserId(userId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/user/${userId}`);
    return response.data;
  },

  async getAnamneseComplete(patientId: string) {
    const response = await axios.get(`${API_BASE_URL}/anamnese-answers/patient/${patientId}/complete`);
    return response.data;
  },
};
