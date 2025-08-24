import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(2, 'Descrição obrigatória'),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  type: z.enum(['entrada', 'saida'], { required_error: 'Tipo obrigatório' }),
  origin: z.enum(['agendamento', 'conta_a_receber', 'conta_a_pagar', 'manual'], { required_error: 'Origem obrigatória' }),
  date: z.string().min(1, 'Data obrigatória'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>; 