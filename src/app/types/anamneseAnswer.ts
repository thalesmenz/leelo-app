export interface AnamneseAnswer {
  id: string;
  question_id: string;
  patient_id: string;
  appointment_id?: string;
  answer: string;
  answered_at: string;
  question?: AnamneseQuestion;
  patient?: Patient;
  appointment?: Appointment;
}

export interface CreateAnamneseAnswerDTO {
  question_id: string;
  patient_id: string;
  appointment_id?: string;
  answer: string;
}

export interface UpdateAnamneseAnswerDTO {
  answer?: string;
  appointment_id?: string;
}

export interface AnamneseAnswerWithQuestion {
  id: string;
  question_id: string;
  patient_id: string;
  appointment_id?: string;
  answer: string;
  answered_at: string;
  question: AnamneseQuestion;
}

export interface AnamneseAnswerFilters {
  patient_id?: string;
  appointment_id?: string;
  question_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface AnamneseAnswerStatistics {
  total_answers: number;
  completed_anamneses: number;
  pending_anamneses: number;
  average_completion_time: number;
}

// Tipos auxiliares
export interface AnamneseQuestion {
  id: string;
  user_id: string;
  question: string;
  type: 'text' | 'number' | 'boolean' | 'multiple_choice';
  options?: string[];
  is_required: boolean;
  order: number;
  created_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  patient_id: string;
  service_id?: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompleteAnamnese {
  id: string;
  patient_name: string;
  patient_cpf: string;
  created_at: string;
  status: 'pendente' | 'completa' | 'em_andamento';
  last_updated: string;
  answers_count: number;
  answers: AnamneseAnswer[];
}

