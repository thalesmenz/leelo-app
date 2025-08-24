import { Modal } from '../../components/Modal';
import { WarningCircle } from 'phosphor-react';

interface AppointmentConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName?: string;
  appointmentTime?: string;
  appointmentDate?: string;
}

export function AppointmentConflictModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  patientName, 
  appointmentTime, 
  appointmentDate 
}: AppointmentConflictModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conflito de Horário" size="sm">
      <div className="flex flex-col items-center gap-4 py-4">
        <WarningCircle size={48} className="text-yellow-500" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Existe um conflito de horário para este agendamento
          </p>
          <div className="text-gray-600 space-y-1">
            {patientName && <p>Paciente: <span className="font-bold">{patientName}</span></p>}
            {appointmentDate && appointmentTime && (
              <p>Horário: <span className="font-bold">{appointmentDate} às {appointmentTime}</span></p>
            )}
            <p className="text-sm mt-3">
              Tem certeza que deseja criar este agendamento mesmo com conflito?
            </p>
          </div>
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
            className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 font-medium"
            onClick={onConfirm}
            type="button"
          >
            Criar Mesmo Assim
          </button>
        </div>
      </div>
    </Modal>
  );
} 