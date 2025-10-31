import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/app/components/Modal';
import { PhoneInput } from '@/app/components/PhoneInput';
import { DateInput } from '@/app/components/DateInput';
import { PencilSimple, FloppyDisk } from 'phosphor-react';
import { useEffect } from 'react';
import { createPatientSchema, type CreatePatientFormData } from '@/app/schemas/patient';
import { patientService } from '@/app/services/patientService';
import { showToast } from '@/app/utils/toast';

interface Patient {
  id: string;
  user_id: string;
  cpf: string;
  name: string;
  phone: string | number;
  email: string;
  birth_date: string;
  status: 'Ativo' | 'Inativo';
  created_at: string;
}

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  patient: Patient;
}

export default function EditPatientModal({ isOpen, onClose, onSuccess, patient }: EditPatientModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      cpf: '',
      name: '',
      phone: '',
      status: 'Ativo',
      email: '',
      birth_date: '',
    },
  });

  useEffect(() => {
    if (patient) {
      reset({
        cpf: patient.cpf,
        name: patient.name,
        phone: patient.phone,
        status: patient.status,
        email: patient.email,
        birth_date: patient.birth_date,
      });
    }
  }, [patient, reset]);

  async function onSubmit(data: CreatePatientFormData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      await patientService.updateById(patient.id, {
        ...data,
        user_id: userId,
      });

      showToast.success('Paciente atualizado com sucesso!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar paciente');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Paciente" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <PencilSimple size={20} /> Editar Paciente
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
          <input
            {...register('cpf')}
            type="text"
            disabled
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300 bg-gray-50"
            placeholder="000.000.000-00"
          />
          {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Nome completo do paciente"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <PhoneInput
          label="Telefone"
          name="phone"
          error={errors.phone}
          value={watch('phone')}
          setValue={val => setValue('phone', val)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            {...register('email')}
            type="email"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="email@exemplo.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <DateInput
          label="Data de Nascimento"
          register={register('birth_date')}
          error={errors.birth_date}
          value={watch('birth_date')}
          setValue={val => setValue('birth_date', val)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            {...register('status')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.status ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FloppyDisk size={18} />
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 