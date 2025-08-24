import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

export interface AccountsPayable {
  id: string;
  user_id: string;
  name: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pendente' | 'pago';
  category?: string;
  created_at: string;
}

export interface CreateAccountsPayableDTO {
  user_id: string;
  name: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status?: 'pendente' | 'pago';
  category?: string;
}

export interface UpdateAccountsPayableDTO {
  name?: string;
  description?: string;
  amount?: number;
  due_date?: string;
  payment_date?: string;
  status?: 'pendente' | 'pago';
  category?: string;
}

export interface AccountsPayableFilters {
  user_id?: string;
  status?: 'pendente' | 'pago';
  category?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface AccountsPayableStatistics {
  total: number;
  paid: number;
  pending: number;
  count: number;
}

export const accountsPayableService = {
  async create(data: CreateAccountsPayableDTO) {
    try {
      const response = await axios.post(`${API_URL}accounts-payable`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta a pagar:', error);
      throw error;
    }
  },

  async getAll(userId: string, params?: any) {
    try {
      const response = await axios.get(`${API_URL}accounts-payable`, { 
        params: { user_id: userId, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas a pagar:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-payable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conta a pagar por ID:', error);
      throw error;
    }
  },

  async updateById(id: string, data: UpdateAccountsPayableDTO) {
    try {
      const response = await axios.put(`${API_URL}accounts-payable/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conta a pagar:', error);
      throw error;
    }
  },

  async deleteById(id: string) {
    try {
      const response = await axios.delete(`${API_URL}accounts-payable/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conta a pagar:', error);
      throw error;
    }
  },

  async markAsPaid(id: string, payment_date?: string) {
    try {
      const response = await axios.patch(`${API_URL}accounts-payable/${id}/pay`, { payment_date });
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      throw error;
    }
  },

  async getStatistics(userId: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-payable/user/${userId}/statistics`);
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
      const response = await axios.get(`${API_URL}accounts-payable`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas a pagar por usuário:', error);
      throw error;
    }
  },

  async searchByName(userId: string, name: string) {
    try {
      const response = await axios.get(`${API_URL}accounts-payable/user/${userId}/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      throw error;
    }
  },
}; 