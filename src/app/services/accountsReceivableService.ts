import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

export const accountsReceivableService = {
  async create(data: any) {
    try {
      const response = await axios.post(`${API_URL}accounts-receivable`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta a receber:', error);
      throw error;
    }
  },

  async getAll(userId: string, params?: any) {
    try {
      const response = await axios.get(`${API_URL}accounts-receivable`, { 
        params: { user_id: userId, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas a receber:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-receivable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conta a receber por ID:', error);
      throw error;
    }
  },

  async updateById(id: string, data: any) {
    try {
      const response = await axios.put(`${API_URL}accounts-receivable/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conta a receber:', error);
      throw error;
    }
  },

  async deleteById(id: string) {
    try {
      const response = await axios.delete(`${API_URL}accounts-receivable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conta a receber:', error);
      throw error;
    }
  },

  async markAsReceived(id: string, receive_date?: string) {
    try {
      const response = await axios.patch(`${API_URL}accounts-receivable/${id}/receive`, { receive_date });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar como recebido:', error);
      throw error;
    }
  },

  async getStatistics(userId: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-receivable/user/${userId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Método específico para buscar por usuário com filtros
  async getByUserId(userId: string, filters?: any) {
    try {
      const params = { user_id: userId, ...filters };
      const response = await axios.get(`${API_URL}accounts-receivable`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas a receber por usuário:', error);
      throw error;
    }
  },

  async searchByName(userId: string, name: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-receivable/user/${userId}/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      throw error;
    }
  },
}; 