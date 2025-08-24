import { z } from 'zod';

export const createAnamneseQuestionSchema = z.object({
  question: z.string().min(1, 'A pergunta é obrigatória').min(3, 'A pergunta deve ter pelo menos 3 caracteres'),
  type: z.enum(['text', 'number', 'boolean', 'multiple_choice'], {
    required_error: 'O tipo é obrigatório',
  }),
  options: z.array(z.string().min(1, 'Opção não pode estar vazia')).optional(),
  is_required: z.boolean(),
  order: z.number().min(1, 'Ordem deve ser maior que 0').optional(),
}).refine((data) => {
  if (data.type === 'multiple_choice') {
    return data.options && data.options.length > 0;
  }
  return true;
}, {
  message: 'Questões de múltipla escolha devem ter pelo menos uma opção',
  path: ['options'],
});

export const updateAnamneseQuestionSchema = z.object({
  question: z.string().min(1, 'A pergunta é obrigatória').min(3, 'A pergunta deve ter pelo menos 3 caracteres').optional(),
  type: z.enum(['text', 'number', 'boolean', 'multiple_choice']).optional(),
  options: z.array(z.string().min(1, 'Opção não pode estar vazia')).optional(),
  is_required: z.boolean().optional(),
  order: z.number().min(1, 'Ordem deve ser maior que 0').optional(),
}).refine((data) => {
  if (data.type === 'multiple_choice') {
    return data.options && data.options.length > 0;
  }
  return true;
}, {
  message: 'Questões de múltipla escolha devem ter pelo menos uma opção',
  path: ['options'],
});

export type CreateAnamneseQuestionFormData = z.infer<typeof createAnamneseQuestionSchema>;
export type UpdateAnamneseQuestionFormData = z.infer<typeof updateAnamneseQuestionSchema>;
