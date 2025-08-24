import { z } from 'zod';

export const createSubuserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  parent_id: z.string().min(1, 'ID do usuário pai é obrigatório'),
});

export const updateSubuserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
});

export type CreateSubuserFormData = z.infer<typeof createSubuserSchema>;
export type UpdateSubuserFormData = z.infer<typeof updateSubuserSchema>; 