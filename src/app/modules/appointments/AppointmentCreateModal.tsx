import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../components/Modal';
import { Calendar, User, MapPin } from 'phosphor-react';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { showToast } from '../../utils/toast';
import { AppointmentConflictModal } from './AppointmentConflictModal';

interface AppointmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: { id: string; name: string; duration: number }[];
  onSuccess?: () => void;
}

const TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
];

export default function AppointmentCreateModal({ isOpen, onClose, services, onSuccess }: AppointmentCreateModalProps) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      patient_id: '',
      patient_name: '',
      patient_phone: '',
      patient_cpf: '',
      date: '',
      time: '',
      service_id: '',
      duration: '',
      notes: '',
    }
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);

  // Buscar pacientes do usuário logado ao abrir o modal
  useEffect(() => {
    async function fetchPatients() {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const res = await patientService.getByUserId(userId);
        setPatients(Array.isArray(res.data) ? res.data : [res.data]);
      } catch {
        setPatients([]);
      }
    }
    if (isOpen) fetchPatients();
  }, [isOpen]);

  // Preencher dados automaticamente ao selecionar paciente
  const selectedPatientId = watch('patient_id');
  useEffect(() => {
    if (selectedPatientId) {
      const selected = patients.find(p => p.id === selectedPatientId);
      setValue('patient_name', selected ? selected.name : '');
      setValue('patient_phone', selected ? selected.phone : '');
      setValue('patient_cpf', selected ? selected.cpf : '');
    } else {
      setValue('patient_name', '');
      setValue('patient_phone', '');
      setValue('patient_cpf', '');
    }
  }, [selectedPatientId, patients, setValue]);

  // Preencher duração automaticamente ao escolher serviço
  const selectedServiceId = watch('service_id');
  useEffect(() => {
    const selected = services.find(s => s.id === selectedServiceId);
    setValue('duration', selected ? String(selected.duration) : '');
  }, [selectedServiceId, services, setValue]);

  // Resetar formulário ao abrir/fechar
  useEffect(() => {
    if (!isOpen) {
      reset();
      setShowConflictModal(false);
      setPendingAppointmentData(null);
    }
  }, [isOpen, reset]);

  async function onSubmit(data: any) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não identificado');
      
      // Corrigir problema de fuso horário - criar data no fuso horário local
      const [year, month, day] = data.date.split('-').map(Number);
      const [hour, minute] = data.time.split(':').map(Number);
      
      // Criar data no fuso horário local
      const start = new Date(year, month - 1, day, hour, minute, 0, 0);
      const durationMinutes = Number(data.duration) || 60;
      const end = new Date(start.getTime() + durationMinutes * 60000);
      
      const appointmentData = {
        user_id: userId,
        service_id: data.service_id,
        patient_cpf: String(data.patient_cpf || '').replace(/\D/g, ''),
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        notes: data.notes,
      };

      // Usar o novo endpoint que não bloqueia por conflitos
      const result = await appointmentService.createWithoutConflictCheck(appointmentData);
      
      if (result.hasConflicts) {
        // Se há conflito, mostrar modal de confirmação
        setPendingAppointmentData({
          ...appointmentData,
          patientName: data.patient_name,
          appointmentTime: data.time,
          appointmentDate: data.date
        });
        setShowConflictModal(true);
      } else {
        // Se não há conflito, criar normalmente
        showToast.success('Agendamento criado com sucesso!');
        onSuccess?.();
        onClose();
        reset();
      }
    } catch (err: any) {
      showToast.error(err.message || 'Erro ao criar agendamento');
    }
  }

  const handleConfirmConflict = async () => {
    if (!pendingAppointmentData) return;
    
    try {
      // O agendamento já foi criado pelo endpoint anterior
      showToast.success('Agendamento criado com sucesso! (com conflito de horário)');
      setShowConflictModal(false);
      setPendingAppointmentData(null);
      onSuccess?.();
      onClose();
      reset();
    } catch (err: any) {
      showToast.error(err.message || 'Erro ao criar agendamento');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Dados do Paciente */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User size={20} /> Dados do Paciente
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Paciente *</label>
              <select
                {...register('patient_id', { required: 'Selecione um paciente' })}
                className="w-full border rounded-lg px-4 py-3 text-base"
              >
                <option value="">Selecione o paciente</option>
                {patients.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.patient_id && <p className="text-red-600 text-xs mt-1">{errors.patient_id.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone *</label>
              <input
                {...register('patient_phone', { required: 'Telefone obrigatório' })}
                type="text"
                className="w-full border rounded-lg px-4 py-3 text-base"
                placeholder="(11) 99999-9999"
                readOnly
              />
              {errors.patient_phone && <p className="text-red-600 text-xs mt-1">{errors.patient_phone.message as string}</p>}
            </div>
          </div>
        </div>
        {/* Detalhes do Agendamento */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Calendar size={20} /> Detalhes do Agendamento
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Data *</label>
              <input
                {...register('date', { required: 'Data obrigatória' })}
                type="date"
                className="w-full border rounded-lg px-4 py-3 text-base"
              />
              {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horário *</label>
              <select
                {...register('time', { required: 'Horário obrigatório' })}
                className="w-full border rounded-lg px-4 py-3 text-base"
              >
                <option value="">Selecione o horário</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Serviço *</label>
              <select
                {...register('service_id', { required: 'Serviço obrigatório' })}
                className="w-full border rounded-lg px-4 py-3 text-base"
              >
                <option value="">Selecione o serviço</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.service_id && <p className="text-red-600 text-xs mt-1">{errors.service_id.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duração *</label>
              <input
                {...register('duration', { required: 'Duração obrigatória' })}
                type="text"
                className="w-full border rounded-lg px-4 py-3 text-base bg-gray-100"
                readOnly
              />
              {errors.duration && <p className="text-red-600 text-xs mt-1">{errors.duration.message as string}</p>}
            </div>
          </div>
        </div>
        {/* Observações */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <MapPin size={20} /> Observações
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Observações</label>
              <textarea
                {...register('notes')}
                className="w-full border rounded-lg px-4 py-3 text-base"
                placeholder="Observações adicionais (opcional)"
                rows={2}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-semibold"
            onClick={() => { onClose(); reset(); }}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 text-base"
          >
            {isSubmitting ? 'Salvando...' : 'Criar Agendamento'}
          </button>
        </div>
      </form>
      <AppointmentConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onConfirm={handleConfirmConflict}
        patientName={pendingAppointmentData?.patientName}
        appointmentTime={pendingAppointmentData?.appointmentTime}
        appointmentDate={pendingAppointmentData?.appointmentDate}
      />
    </Modal>
  );
} 