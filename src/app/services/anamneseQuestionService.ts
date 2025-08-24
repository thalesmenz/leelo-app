import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AnamneseQuestion {
  id: string;
  user_id: string;
  question: string;
  category?: string;
  type: 'text' | 'number' | 'boolean' | 'multiple_choice';
  options?: any;
  is_required: boolean;
  order?: number;
  created_at: string;
}

export interface CreateAnamneseQuestionDTO {
  user_id: string;
  question: string;
  category?: string;
  type: 'text' | 'number' | 'boolean' | 'multiple_choice';
  options?: any;
  is_required?: boolean;
  order?: number;
}

export interface UpdateAnamneseQuestionDTO {
  question?: string;
  category?: string;
  type?: 'text' | 'number' | 'boolean' | 'multiple_choice';
  options?: any;
  is_required?: boolean;
  order?: number;
}

export interface AnamneseQuestionStatistics {
  totalQuestions: number;
  requiredQuestions: number;
  optionalQuestions: number;
  typeCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
}

export const anamneseQuestionService = {
  async create(question: CreateAnamneseQuestionDTO) {
    const response = await axios.post(`${API_URL}anamnese-questions`, question);
    return response.data;
  },

  async getAll(params?: any) {
    const response = await axios.get(`${API_URL}anamnese-questions`, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}anamnese-questions/${id}`);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await axios.get(`${API_URL}anamnese-questions/user/${user_id}`);
    return response.data;
  },

  async updateById(id: string, question: UpdateAnamneseQuestionDTO) {
    const response = await axios.put(`${API_URL}anamnese-questions/${id}`, question);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await axios.delete(`${API_URL}anamnese-questions/${id}`);
    return response.data;
  },

  async reorderQuestions(user_id: string, questionIds: string[]) {
    const response = await axios.patch(`${API_URL}anamnese-questions/user/${user_id}/reorder`, { questionIds });
    return response.data;
  },

  async getByCategory(user_id: string, category: string) {
    const response = await axios.get(`${API_URL}anamnese-questions/user/${user_id}/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  async search(user_id: string, searchTerm: string) {
    const response = await axios.get(`${API_URL}anamnese-questions/user/${user_id}/search?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async getStatistics(user_id: string) {
    const response = await axios.get(`${API_URL}anamnese-questions/user/${user_id}/statistics`);
    return response.data;
  },
};


