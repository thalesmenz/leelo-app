import api from '../config/axios';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  professional_id: string;
  notes: string;
  created_at: string;
  patient_name: string;
  patient_cpf: string;
  professional_name: string;
}

export interface CreateMedicalRecordDTO {
  patient_id: string;
  professional_id: string;
  notes: string;
}

export interface UpdateMedicalRecordDTO {
  notes?: string;
  patient_id?: string;
}

export const medicalRecordService = {
  async create(data: CreateMedicalRecordDTO) {
    const response = await api.post('medical-records', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get('medical-records');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`medical-records/${id}`);
    return response.data;
  },

  async getByProfessionalId(professionalId: string) {
    const response = await api.get(`medical-records/professional/${professionalId}`);
    return response.data;
  },

  async getByPatientId(patientId: string) {
    const response = await api.get(`medical-records/patient/${patientId}`);
    return response.data;
  },

  async update(id: string, data: UpdateMedicalRecordDTO) {
    const response = await api.put(`medical-records/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`medical-records/${id}`);
    return response.data;
  },

  async search(professionalId: string, searchTerm: string) {
    const response = await api.get('medical-records/search', {
      params: { professionalId, searchTerm }
    });
    return response.data;
  },

  async getStatistics(professionalId: string) {
    const response = await api.get(`medical-records/statistics/${professionalId}`);
    return response.data;
  },
};
