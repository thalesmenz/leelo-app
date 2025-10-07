'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, CurrencyInput } from '@/app/components';
import { Plus, FloppyDisk } from 'phosphor-react';
import { payableSchema, type PayableFormData } from '@/app/schemas/payable';
import { accountsPayableService } from '@/app/services/accountsPayableService';
import { showToast } from '@/app/utils/toast';

interface CreatePayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePayableModal({ isOpen, onClose, onSuccess }: CreatePayableModalProps) {
  const [amountValue, setAmountValue] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PayableFormData>({
    resolver: zodResolver(payableSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      due_date: new Date().toISOString().split('T')[0],
    },
  });

  // Função para converter valor do CurrencyInput para número
  const parseCurrency = (value: string) => {
    if (!value) return 0;
    const number = parseInt(value) / 100;
    return number || 0;
  };

  const handleAmountChange = (value: string) => {
    setAmountValue(value);
    setValue('amount', parseCurrency(value));
  };

  async function onSubmit(data: PayableFormData) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não identificado');
        return;
      }

      await accountsPayableService.create({
        ...data,
        user_id: userId,
        amount: parseCurrency(amountValue),
        status: 'pendente'
      });

      showToast.success('Conta a pagar criada com sucesso!');
      onClose();
      reset();
      setAmountValue('');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar conta a pagar');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Conta a Pagar" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <Plus size={20} /> Nova Conta a Pagar
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Aluguel"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <input
            {...register('description')}
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Ex: Aluguel do consultório"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <CurrencyInput
            name="amount"
            label="Valor"
            required
            value={amountValue}
            onChange={handleAmountChange}
            error={!!errors.amount}
            placeholder="R$ 0,00"
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
            {isSubmitting ? 'Salvando...' : 'Salvar Conta'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 