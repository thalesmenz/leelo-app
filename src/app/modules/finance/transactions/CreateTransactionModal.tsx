import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/app/components/Modal';
import { Plus, FloppyDisk } from 'phosphor-react';
import { transactionSchema, type TransactionFormData } from '@/app/schemas/transaction';
import { transactionService } from '@/app/services/transactionService';
import { showToast } from '@/app/utils/toast';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateTransactionModal({ isOpen, onClose, onSuccess }: CreateTransactionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'entrada',
      origin: 'manual',
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(data: TransactionFormData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não identificado');
        return;
      }

      await transactionService.create({
        ...data,
        user_id: userId,
        amount: parseFloat(data.amount.toString())
      });

      showToast.success('Transação criada com sucesso!');
      onClose();
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar transação');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <Plus size={20} /> Nova Transação
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <input
            {...register('description')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Pagamento de consulta"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            {...register('type')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.type ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origem *</label>
          <select
            {...register('origin')}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.origin ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="manual">Manual</option>
            <option value="agendamento">Agendamento</option>
            <option value="conta_a_receber">Conta a Receber</option>
            <option value="conta_a_pagar">Conta a Pagar</option>
          </select>
          {errors.origin && <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
          <input
            {...register('date')}
            type="date"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.date ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
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
            {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 