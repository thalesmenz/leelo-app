import { z } from 'zod';

export const createAnamneseAnswerSchema = z.object({
  question_id: z.string().min(1, 'ID da questão é obrigatório'),
  patient_id: z.string().min(1, 'ID do paciente é obrigatório'),
  appointment_id: z.string().optional(),
  answer: z.string().min(1, 'Resposta é obrigatória'),
});

export const updateAnamneseAnswerSchema = z.object({
  answer: z.string().min(1, 'Resposta é obrigatória').optional(),
  appointment_id: z.string().optional(),
});

export type CreateAnamneseAnswerFormData = z.infer<typeof createAnamneseAnswerSchema>;
export type UpdateAnamneseAnswerFormData = z.infer<typeof updateAnamneseAnswerSchema>;










