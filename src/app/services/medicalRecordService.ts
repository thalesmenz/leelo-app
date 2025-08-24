import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

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
    const response = await axios.post(`${API_URL}medical-records`, data);
    return response.data;
  },

  async getAll() {
    const response = await axios.get(`${API_URL}medical-records`);
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}medical-records/${id}`);
    return response.data;
  },

  async getByProfessionalId(professionalId: string) {
    const response = await axios.get(`${API_URL}medical-records/professional/${professionalId}`);
    return response.data;
  },

  async getByPatientId(patientId: string) {
    const response = await axios.get(`${API_URL}medical-records/patient/${patientId}`);
    return response.data;
  },

  async update(id: string, data: UpdateMedicalRecordDTO) {
    const response = await axios.put(`${API_URL}medical-records/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}medical-records/${id}`);
    return response.data;
  },

  async search(professionalId: string, searchTerm: string) {
    const response = await axios.get(`${API_URL}medical-records/search`, {
      params: { professionalId, searchTerm }
    });
    return response.data;
  },

  async getStatistics(professionalId: string) {
    const response = await axios.get(`${API_URL}medical-records/statistics/${professionalId}`);
    return response.data;
  },
};
