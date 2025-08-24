import { z } from 'zod';

export const patientPlanSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  plan_type: z.enum(['recorrente', 'sessoes'], {
    required_error: 'Tipo de plano obrigatório',
  }),
  sessions_monthly: z.coerce.number().optional(),
  sessions_max: z.coerce.number().optional(),
  price: z.coerce.number().min(0, 'Informe o valor'),
  notes: z.string().optional(),
  status: z.enum(['ativo', 'inativo']),
}).refine((data) => {
  if (data.plan_type === 'recorrente') {
    return data.sessions_monthly && data.sessions_monthly > 0;
  }
  if (data.plan_type === 'sessoes') {
    return data.sessions_max && data.sessions_max > 0;
  }
  return true;
}, {
  message: 'Para planos recorrentes informe sessões mensais, para planos por sessões informe o máximo de sessões',
  path: ['sessions_monthly'],
});

export type PatientPlanFormData = z.infer<typeof patientPlanSchema>; 