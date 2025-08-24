import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

export const transactionService = {
  async getAll(params: any) {
    try {
      const { data } = await axios.get(`${API_URL}transactions`, { params });
      return data;
    } catch (error: any) {
      console.error('Erro no transactionService.getAll:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações');
    }
  },
  async getById(id: string) {
    try {
      const { data } = await axios.get(`${API_URL}transactions/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transação');
    }
  },
  async create(payload: any) {
    try {
      const { data } = await axios.post(`${API_URL}transactions`, payload);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar transação');
    }
  },
  async update(id: string, payload: any) {
    try {
      const { data } = await axios.put(`${API_URL}transactions/${id}`, payload);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar transação');
    }
  },
  async remove(id: string) {
    try {
      const { data } = await axios.delete(`${API_URL}transactions/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao remover transação');
    }
  },
  async getStatistics(userId: string) {
    try {
      const response = await axios.get(`${API_URL}transactions/user/${userId}/statistics`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas');
    }
  },

  async getHistoricalData(userId: string, months: number = 6) {
    try {
      const response = await axios.get(`${API_URL}transactions/user/${userId}/historical?months=${months}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados históricos');
    }
  },

  async searchByDescription(userId: string, description: string) {
    try {
      const response = await axios.get(`${API_URL}transactions/user/${userId}/search?description=${encodeURIComponent(description)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações');
    }
  },
}; 