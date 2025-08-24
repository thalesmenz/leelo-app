import { z } from 'zod';

export const createPatientSchema = z.object({
  cpf: z.string().min(1, 'CPF é obrigatório').min(11, 'CPF deve ter 11 dígitos'),
  name: z.string().min(1, 'Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório').min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  status: z.string().min(1, 'Status é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>; 