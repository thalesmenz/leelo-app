import api from '../config/axios';

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
    const response = await api.post('anamnese-questions', question);
    return response.data;
  },

  async getAll(params?: any) {
    const response = await api.get('anamnese-questions', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`anamnese-questions/${id}`);
    return response.data;
  },

  async getByUserId(user_id: string) {
    const response = await api.get(`anamnese-questions/user/${user_id}`);
    return response.data;
  },

  async updateById(id: string, question: UpdateAnamneseQuestionDTO) {
    const response = await api.put(`anamnese-questions/${id}`, question);
    return response.data;
  },

  async deleteById(id: string) {
    const response = await api.delete(`anamnese-questions/${id}`);
    return response.data;
  },

  async reorderQuestions(user_id: string, questionIds: string[]) {
    const response = await api.patch(`anamnese-questions/user/${user_id}/reorder`, { questionIds });
    return response.data;
  },

  async getByCategory(user_id: string, category: string) {
    const response = await api.get(`anamnese-questions/user/${user_id}/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  async search(user_id: string, searchTerm: string) {
    const response = await api.get(`anamnese-questions/user/${user_id}/search?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async getStatistics(user_id: string) {
    const response = await api.get(`anamnese-questions/user/${user_id}/statistics`);
    return response.data;
  },
};


