import { Modal } from '../../components/Modal';
import { WarningCircle } from 'phosphor-react';

interface AppointmentConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName?: string;
}

export function AppointmentConfirmDeleteModal({ isOpen, onClose, onConfirm, patientName }: AppointmentConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Agendamento" size="sm">
      <div className="flex flex-col items-center gap-4 py-4">
        <WarningCircle size={48} className="text-red-500" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Tem certeza que deseja excluir este agendamento?</p>
          {patientName && <p className="text-gray-600">Paciente: <span className="font-bold">{patientName}</span></p>}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium"
            onClick={onConfirm}
            type="button"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  );
} 