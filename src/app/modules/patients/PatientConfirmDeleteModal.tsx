import React, { useState } from 'react';
import { patientService } from '@/app/services/patientService';
import { showToast } from '@/app/utils/toast';
import { Modal } from '@/app/components/Modal';

interface PatientConfirmDeleteModalProps {
  open: boolean;
  patient: any | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PatientConfirmDeleteModal({
  open,
  patient,
  onClose,
  onSuccess,
}: PatientConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !patient) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await patientService.deleteById(patient.id);
      showToast.success('Paciente deletado com sucesso!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      showToast.error('Erro ao deletar paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Confirmar exclusão" size="sm">
      <p className="text-gray-600 mb-6">
        Tem certeza que deseja deletar o paciente <b>"{patient.name}"</b>? Esta ação não poderá ser desfeita.
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