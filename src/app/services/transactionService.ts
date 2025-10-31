import api from '../config/axios';

export const transactionService = {
  async getAll(params: any) {
    try {
      const { data } = await api.get('transactions', { params });
      return data;
    } catch (error: any) {
      console.error('Erro no transactionService.getAll:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações');
    }
  },
  async getById(id: string) {
    try {
      const { data } = await api.get(`transactions/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transação');
    }
  },
  async create(payload: any) {
    try {
      const { data } = await api.post('transactions', payload);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar transação');
    }
  },
  async update(id: string, payload: any) {
    try {
      const { data } = await api.put(`transactions/${id}`, payload);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar transação');
    }
  },
  async remove(id: string) {
    try {
      const { data } = await api.delete(`transactions/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao remover transação');
    }
  },
  async getStatistics(userId: string, month?: number, year?: number) {
    try {
      let url = `transactions/user/${userId}/statistics`;
      const params = new URLSearchParams();
      
      if (month) {
        params.append('month', month.toString());
      }
      if (year) {
        params.append('year', year.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas');
    }
  },

  async getHistoricalData(userId: string, months: number = 6) {
    try {
      const response = await api.get(`transactions/user/${userId}/historical?months=${months}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados históricos');
    }
  },

  async searchByDescription(userId: string, description: string) {
    try {
      const response = await api.get(`transactions/user/${userId}/search?description=${encodeURIComponent(description)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar transações');
    }
  },
}; 