import api from '../config/axios';

export const accountsReceivableService = {
  async create(data: any) {
    try {
      const response = await api.post('accounts-receivable', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta a receber:', error);
      throw error;
    }
  },

  async getAll(userId: string, params?: any) {
    try {
      const response = await api.get('accounts-receivable', { 
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
      const response = await api.get(`accounts-receivable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conta a receber por ID:', error);
      throw error;
    }
  },

  async updateById(id: string, data: any) {
    try {
      const response = await api.put(`accounts-receivable/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conta a receber:', error);
      throw error;
    }
  },

  async deleteById(id: string) {
    try {
      const response = await api.delete(`accounts-receivable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conta a receber:', error);
      throw error;
    }
  },

  async markAsReceived(id: string, receive_date?: string) {
    try {
      const response = await api.patch(`accounts-receivable/${id}/receive`, { receive_date });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar como recebido:', error);
      throw error;
    }
  },

  async getStatistics(userId: string) {
    try {
      const response = await api.get(`accounts-receivable/user/${userId}/statistics`);
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
      const response = await api.get('accounts-receivable', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas a receber por usuário:', error);
      throw error;
    }
  },

  async searchByName(userId: string, name: string) {
    try {
      const response = await api.get(`accounts-receivable/user/${userId}/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      throw error;
    }
  },
}; 