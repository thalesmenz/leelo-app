import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  patient_id: z.string().min(1, 'Paciente é obrigatório'),
  notes: z.string().min(1, 'Notas são obrigatórias').min(10, 'Notas devem ter pelo menos 10 caracteres'),
});

export type CreateMedicalRecordFormData = z.infer<typeof createMedicalRecordSchema>;

export const updateMedicalRecordSchema = z.object({
  patient_id: z.string().min(1, 'Paciente é obrigatório'),
  notes: z.string().min(1, 'Notas são obrigatórias').min(10, 'Notas devem ter pelo menos 10 caracteres'),
});

export type UpdateMedicalRecordFormData = z.infer<typeof updateMedicalRecordSchema>;
