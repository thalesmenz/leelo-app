import api from '../config/axios';

export const subuserService = {
  async create(subuser: any) {
    try {
      const response = await api.post('subusers', subuser);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar fisioterapeuta');
    }
  },

  async getByUserId(user_id: string) {
    try {
      const response = await api.get(`subusers/parent/${user_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeutas');
    }
  },

  async updateById(subuser_id: string, subuser: any) {
    try {
      const response = await api.put(`subusers/id/${subuser_id}`, subuser);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar fisioterapeuta');
    }
  },

  async deleteById(subuser_id: string) {
    try {
      const response = await api.delete(`subusers/id/${subuser_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeuta');
    }
  },

  async getById(subuser_id: string) {
    try {
      const response = await api.get(`subusers/id/${subuser_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeuta');
    }
  },

  async getAll() {
    try {
      const response = await api.get('subusers');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeutas');
    }
  },

  // Novos métodos para dados financeiros

  async getSubuserTransactions(subuser_id: string) {
    try {
      const response = await api.get(`subusers/${subuser_id}/transactions`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações do fisioterapeuta');
    }
  },

  async getSubuserAccountsPayable(subuser_id: string) {
    try {
      const response = await api.get(`subusers/${subuser_id}/accounts-payable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a pagar do fisioterapeuta');
    }
  },

  async getSubuserAccountsReceivable(subuser_id: string) {
    try {
      const response = await api.get(`subusers/${subuser_id}/accounts-receivable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a receber do fisioterapeuta');
    }
  },

  async getConsolidatedData(parent_id: string) {
    try {
      const response = await api.get(`subusers/parent/${parent_id}/consolidated`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados consolidados');
    }
  },
}; 