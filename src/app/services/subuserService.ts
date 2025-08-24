import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

export const subuserService = {
  async create(subuser: any) {
    try {
      const response = await axios.post(`${API_URL}subusers`, subuser);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar fisioterapeuta');
    }
  },

  async getByUserId(user_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/parent/${user_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeutas');
    }
  },

  async updateById(subuser_id: string, subuser: any) {
    try {
      const response = await axios.put(`${API_URL}subusers/id/${subuser_id}`, subuser);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar fisioterapeuta');
    }
  },

  async deleteById(subuser_id: string) {
    try {
      const response = await axios.delete(`${API_URL}subusers/id/${subuser_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeuta');
    }
  },

  async getById(subuser_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/id/${subuser_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeuta');
    }
  },

  async getAll() {
    try {
      const response = await axios.get(`${API_URL}subusers`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fisioterapeutas');
    }
  },

  // Novos métodos para dados financeiros

  async getSubuserTransactions(subuser_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/${subuser_id}/transactions`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações do fisioterapeuta');
    }
  },

  async getSubuserAccountsPayable(subuser_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/${subuser_id}/accounts-payable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a pagar do fisioterapeuta');
    }
  },

  async getSubuserAccountsReceivable(subuser_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/${subuser_id}/accounts-receivable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contas a receber do fisioterapeuta');
    }
  },

  async getConsolidatedData(parent_id: string) {
    try {
      const response = await axios.get(`${API_URL}subusers/parent/${parent_id}/consolidated`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados consolidados');
    }
  },
}; 