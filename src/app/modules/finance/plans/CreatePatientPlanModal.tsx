import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/app/components/Modal';
import { Plus, FloppyDisk } from 'phosphor-react';
import { useState, useEffect } from 'react';
import { patientPlanSchema, type PatientPlanFormData } from '@/app/schemas/patientPlan';
import { patientPlanService } from '@/app/services/patientPlanService';
import { showToast } from '@/app/utils/toast';

interface CreatePatientPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePatientPlanModal({ isOpen, onClose, onSuccess }: CreatePatientPlanModalProps) {
  const [planType, setPlanType] = useState<'recorrente' | 'sessoes'>('recorrente');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientPlanFormData>({
    resolver: zodResolver(patientPlanSchema),
    defaultValues: {
      name: '',
      plan_type: 'recorrente',
      sessions_monthly: 1,
      sessions_max: 1,
      price: 0,
      status: 'ativo',
      notes: '',
    },
  });

  const watchedPlanType = watch('plan_type');

  useEffect(() => {
    setPlanType(watchedPlanType);
  }, [watchedPlanType]);

  async function onSubmit(data: PatientPlanFormData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não identificado');
        return;
      }

      const createData: any = {
        ...data,
        price: parseFloat(data.price.toString())
      };

      // Remove the field that's not relevant for the current plan type
      if (data.plan_type === 'recorrente') {
        createData.sessions_monthly = parseInt(data.sessions_monthly?.toString() || '1');
        delete createData.sessions_max;
      } else {
        createData.sessions_max = parseInt(data.sessions_max?.toString() || '1');
        delete createData.sessions_monthly;
      }

      await patientPlanService.create(userId, createData);

      showToast.success('Plano de paciente criado com sucesso!');
      onClose();
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar plano de paciente');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Plano de Paciente" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <Plus size={20} /> Novo Plano de Paciente
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano *</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Plano Fisio Mensal"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Plano *</label>
          <select
            {...register('plan_type')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.plan_type ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="recorrente">Recorrente (Mensal)</option>
            <option value="sessoes">Por Sessões</option>
          </select>
          {errors.plan_type && <p className="mt-1 text-sm text-red-600">{errors.plan_type.message}</p>}
        </div>

        {planType === 'recorrente' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sessões Mensais *</label>
            <input
              {...register('sessions_monthly', { valueAsNumber: true })}
              type="number"
              min="1"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.sessions_monthly ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Ex: 4"
            />
            {errors.sessions_monthly && <p className="mt-1 text-sm text-red-600">{errors.sessions_monthly.message}</p>}
          </div>
        )}

        {planType === 'sessoes' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Sessões *</label>
            <input
              {...register('sessions_max', { valueAsNumber: true })}
              type="number"
              min="1"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.sessions_max ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Ex: 10"
            />
            {errors.sessions_max && <p className="mt-1 text-sm text-red-600">{errors.sessions_max.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$) * 
            <span className="text-xs text-gray-500 ml-1">
              {planType === 'recorrente' ? '(valor mensal)' : '(valor total do pacote)'}
            </span>
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.price ? 'border-red-300' : 'border-gray-300'}`}
            placeholder={planType === 'recorrente' ? 'Valor mensal' : 'Valor total'}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea
            {...register('notes')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.notes ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Notas do plano"
            rows={2}
          />
          {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            {...register('status')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.status ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
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
            {isSubmitting ? 'Criando...' : 'Criar Plano'}
          </button>
        </div>
      </form>
    </Modal>
  );
}