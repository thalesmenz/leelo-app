'use client';

import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { showToast } from '../../utils/toast';
import { medicalRecordService } from '../../services/medicalRecordService';

interface MedicalRecord {
  id: string;
  patient_id: string;
  professional_id: string;
  notes: string;
  created_at: string;
  patient_name: string;
  patient_cpf: string;
  professional_name: string;
}

interface MedicalRecordConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: MedicalRecord | null;
}

export default function MedicalRecordConfirmDeleteModal({
  isOpen,
  onClose,
  onSuccess,
  record
}: MedicalRecordConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !record) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await medicalRecordService.delete(record.id);
      
      if (response.success) {
        showToast.success('Prontuário excluído com sucesso!');
        onSuccess();
        onClose();
      } else {
        showToast.error(response.message || 'Erro ao excluir prontuário');
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Erro ao excluir prontuário');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Prontuário" size="md">
      {/* Warning Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-red-600 text-sm font-bold">!</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800 mb-1">Atenção!</h3>
            <p className="text-sm text-red-700">
              Esta ação não pode ser desfeita. O prontuário será permanentemente excluído.
            </p>
          </div>
        </div>
      </div>

      {/* Record Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Informações do Prontuário
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">Paciente:</span>
            <p className="text-gray-900 font-medium">{record.patient_name}</p>
          </div>
          <div>
            <span className="text-gray-500">CPF:</span>
            <p className="text-gray-900 font-mono">{record.patient_cpf}</p>
          </div>
          <div>
            <span className="text-gray-500">Data de Criação:</span>
            <p className="text-gray-900">
              {new Date(record.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-400 hover:from-pink-400 hover:to-red-500 text-white rounded-lg font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Excluindo...' : 'Excluir Prontuário'}
        </button>
      </div>
    </Modal>
  );
}
