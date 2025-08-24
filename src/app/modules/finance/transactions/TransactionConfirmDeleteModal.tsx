import React, { useState } from 'react';
import { transactionService } from '@/app/services/transactionService';
import { showToast } from '@/app/utils/toast';
import { Modal } from '@/app/components/Modal';

interface TransactionConfirmDeleteModalProps {
  open: boolean;
  transaction: any | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransactionConfirmDeleteModal({
  open,
  transaction,
  onClose,
  onSuccess,
}: TransactionConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !transaction) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await transactionService.remove(transaction.id);
      showToast.success('Transação deletada com sucesso!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      showToast.error('Erro ao deletar transação');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return type === 'entrada' ? `+ R$ ${formatted}` : `- R$ ${formatted}`;
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Confirmar exclusão" size="sm">
      <p className="text-gray-600 mb-6">
        Tem certeza que deseja deletar a transação <b>"{transaction.description || 'Sem descrição'}"</b> de{' '}
        <span className={`font-bold ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
          {formatAmount(transaction.amount, transaction.type)}
        </span>? 
        Esta ação não poderá ser desfeita.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Deletando...' : 'Deletar'}
        </button>
      </div>
    </Modal>
  );
} 