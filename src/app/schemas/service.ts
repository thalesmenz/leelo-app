import { z } from 'zod';

export const createServiceSchema = z.object({
  user_id: z.string().min(1, 'ID do usuário é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  duration: z.number().int('Duração deve ser um número inteiro').min(1, 'Duração é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  active: z.boolean().optional().default(true),
});

export type CreateServiceFormData = z.infer<typeof createServiceSchema>; 