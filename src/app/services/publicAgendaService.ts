import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

export interface PublicAgendaConfig {
  user_id: string;
  is_public: boolean;
  allow_direct_booking: boolean;
  require_confirmation: boolean;
  max_advance_days: number;
  public_services: string[];
  custom_message?: string;
  contact_info: {
    show_phone: boolean;
    show_email: boolean;
    show_address: boolean;
  };
}

export interface PublicAgendaStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  average_rating: number;
  total_revenue: number;
}

export const publicAgendaService = {
  // Obter configuração da agenda pública
  async getConfig(userId: string) {
    const response = await axios.get(`${API_URL}public-agenda/config/${userId}`);
    return response.data;
  },

  // Salvar configuração da agenda pública
  async saveConfig(config: PublicAgendaConfig) {
    const response = await axios.post(`${API_URL}public-agenda/config`, config);
    return response.data;
  },

  // Obter estatísticas da agenda pública
  async getStats(userId: string) {
    const response = await axios.get(`${API_URL}public-agenda/stats/${userId}`);
    return response.data;
  },

  // Obter horários disponíveis para uma data específica
  async getAvailableSlots(userId: string, date: string, serviceId: string) {
    const response = await axios.get(`${API_URL}public-agenda/available-slots`, {
      params: { userId, date, serviceId }
    });
    return response.data;
  },

  // Criar agendamento público
  async createPublicBooking(bookingData: {
    user_id: string;
    service_id: string;
    date: string;
    time: string;
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    notes?: string;
  }) {
    const response = await axios.post(`${API_URL}public-agenda/book`, bookingData);
    return response.data;
  },

  // Verificar se um horário está disponível
  async checkSlotAvailability(userId: string, date: string, time: string, serviceId: string) {
    const response = await axios.get(`${API_URL}public-agenda/check-availability`, {
      params: { userId, date, time, serviceId }
    });
    return response.data;
  },

  // Obter informações públicas do usuário
  async getPublicUserInfo(userId: string) {
    const response = await axios.get(`${API_URL}public-agenda/user-info/${userId}`);
    return response.data;
  },

  // Obter serviços públicos disponíveis
  async getPublicServices(userId: string) {
    const response = await axios.get(`${API_URL}public-agenda/services/${userId}`);
    return response.data;
  },

  // Obter horários de trabalho públicos
  async getPublicWorkSchedule(userId: string) {
    const response = await axios.get(`${API_URL}public-agenda/work-schedule/${userId}`);
    return response.data;
  }
};






