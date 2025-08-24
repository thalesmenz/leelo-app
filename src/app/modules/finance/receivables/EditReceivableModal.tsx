import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/app/components/Modal';
import { PencilSimple, FloppyDisk } from 'phosphor-react';
import { useEffect } from 'react';
import { receivableSchema, type ReceivableFormData } from '@/app/schemas/receivable';
import { accountsReceivableService } from '@/app/services/accountsReceivableService';
import { showToast } from '@/app/utils/toast';

interface Receivable {
  id: string;
  name: string;
  description: string;
  category?: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pendente' | 'recebido';
  created_at: string;
}

interface EditReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  receivable: Receivable;
}

export default function EditReceivableModal({ isOpen, onClose, onSuccess, receivable }: EditReceivableModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReceivableFormData>({
    resolver: zodResolver(receivableSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      due_date: '',
    },
  });

  useEffect(() => {
    if (receivable) {
      reset({
        name: receivable.name,
        description: receivable.description,
        amount: receivable.amount,
        due_date: receivable.due_date,
      });
    }
  }, [receivable, reset]);

  async function onSubmit(data: ReceivableFormData) {
    try {
      await accountsReceivableService.updateById(receivable.id, {
        ...data,
        amount: parseFloat(data.amount.toString())
      });

      showToast.success('Conta a receber atualizada com sucesso!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar conta a receber');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Conta a Receber" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <PencilSimple size={20} /> Editar Conta a Receber
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Consulta do Paciente"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <input
            {...register('description')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Consulta de fisioterapia"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            min="0.01"
            step="0.01"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.amount ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="0,00"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
          <input
            {...register('due_date')}
            type="date"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.due_date ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>}
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