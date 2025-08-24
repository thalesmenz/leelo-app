import React, { useState } from 'react';
import { Modal } from '@/app/components/Modal';
import { anamneseAnswerService } from '@/app/services/anamneseAnswerService';
import { showToast } from '@/app/utils/toast';

interface Anamnese {
  id: string;
  patient_name: string;
  patient_cpf: string;
  created_at: string;
  status: 'pendente' | 'completa' | 'em_andamento';
  last_updated: string;
  answers_count?: number;
}

interface AnamneseConfirmDeleteModalProps {
  isOpen: boolean;
  anamnese: Anamnese | null;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for parent component
}

export function AnamneseConfirmDeleteModal({
  isOpen,
  anamnese,
  onClose,
  onSuccess,
}: AnamneseConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!anamnese) return;

    try {
      setLoading(true);
      
      // Excluir todas as respostas da anamnese do paciente
      await anamneseAnswerService.deleteByPatientId(anamnese.id);
      
      showToast.success('Anamnese excluída com sucesso!');
      
      // Call parent callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao excluir anamnese');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!isOpen || !anamnese) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar exclusão da anamnese" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">
          Tem certeza que deseja deletar a anamnese do paciente <b>"{anamnese.patient_name}"</b>?
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">CPF:</span> {formatCPF(anamnese.patient_cpf)}
            </div>
            <div>
              <span className="text-gray-600">Data de criação:</span> {formatDate(anamnese.created_at)}
            </div>
            <div>
              <span className="text-gray-600">Total de respostas:</span> {anamnese.answers_count || 0}
            </div>
          </div>
        </div>

        <p className="text-red-600 text-sm">
          ⚠️ Esta ação não poderá ser desfeita e todas as respostas da anamnese serão excluídas permanentemente.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Modal>
  );
}
