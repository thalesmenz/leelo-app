import { z } from 'zod';

export const receivableSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().min(2, 'Descrição obrigatória'),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  due_date: z.string().min(1, 'Data de vencimento obrigatória'),
});

export type ReceivableFormData = z.infer<typeof receivableSchema>; 