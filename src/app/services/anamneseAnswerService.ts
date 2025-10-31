import api from '../config/axios';

export const anamneseAnswerService = {
  async create(data: any) {
    const response = await api.post('anamnese-answers', data);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`anamnese-answers/${id}`);
    return response.data;
  },

  async updateById(id: string, data: any) {
    const response = await api.put(`anamnese-answers/${id}`, data);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await api.delete(`anamnese-answers/${id}`);
    return response.data;
  },

  async deleteByPatientId(patientId: string) {
    const response = await api.delete(`anamnese-answers/patient/${patientId}`);
    return response.data;
  },

  async getByPatientId(patientId: string) {
    const response = await api.get(`anamnese-answers/patient/${patientId}`);
    return response.data;
  },

  async getByAppointmentId(appointmentId: string) {
    const response = await api.get(`anamnese-answers/appointment/${appointmentId}`);
    return response.data;
  },

  async getWithQuestions(patientId: string) {
    const response = await api.get(`anamnese-answers/patient/${patientId}/with-questions`);
    return response.data;
  },

  async bulkCreate(data: any[]) {
    const response = await api.post('anamnese-answers/bulk', data);
    return response.data;
  },

  async getStatistics(userId: string) {
    const response = await api.get(`anamnese-answers/statistics/${userId}`);
    return response.data;
  },

  async getByUserId(userId: string) {
    const response = await api.get(`anamnese-answers/user/${userId}`);
    return response.data;
  },

  async getAnamneseComplete(patientId: string) {
    const response = await api.get(`anamnese-answers/patient/${patientId}/complete`);
    return response.data;
  },
};
