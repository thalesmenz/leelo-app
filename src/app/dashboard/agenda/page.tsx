'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, CaretLeft, CaretRight, Clock, MapPin, User, Gear } from 'phosphor-react';
import WorkScheduleConfigModal from '../../modules/work-schedule/WorkScheduleConfigModal';
import { appointmentService } from '../../services/appointmentService';
import AppointmentCreateModal from '../../modules/appointments/AppointmentCreateModal';
import { userServiceService } from '../../services/userServiceService';
import { AppointmentConfirmDeleteModal } from '../../modules/appointments/AppointmentConfirmDeleteModal';
import { showToast } from '../../utils/toast';
import { ShareAgendaCard } from '../../components';
import { useAuth } from '../../hooks/useAuth';


interface Event {
  id: string;
  paciente: string;
  tipo: string;
  local: string;
  telefone: string;
  status: 'pending' | 'completed';
  horario: string;
  duracao: string;
  data: string;
}

export default function AgendaPage() {
  const { user, userId } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showWorkScheduleModal, setShowWorkScheduleModal] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [agendaTab, setAgendaTab] = useState<'pendentes' | 'concluidos'>('pendentes');

  // Buscar agendamentos reais do backend
  useEffect(() => {
    async function fetchAppointments() {
      if (!userId) return;
      try {
        const res = await appointmentService.getByUserId(userId);
        // Mapear os dados do backend para o formato Event
        const mapped = (res.data || []).map((appt: any) => ({
          id: appt.id,
          paciente: appt.patient_name,
          tipo: appt.service?.name || '',
          local: 'Clínica', // ajuste se houver campo real
          telefone: appt.patient_phone || '',
          status: appt.status === 'confirmed' ? 'confirmed' : appt.status === 'completed' ? 'completed' : 'pending',
          horario: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          duracao: appt.service?.duration ? `${appt.service.duration}min` : '',
          data: appt.start_time,
        }));
        setEvents(mapped);
      } catch {
        setEvents([]);
      }
    }
    fetchAppointments();
  }, [currentDate, userId]);

  // Buscar serviços ativos do usuário logado
  useEffect(() => {
    async function fetchServices() {
      if (!userId) return;
      try {
        const res = await userServiceService.getByUserId(userId);
        setServices((res.data || []).filter((s: any) => s.active));
      } catch {
        setServices([]);
      }
    }
    fetchServices();
  }, [userId]);


  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Ajustar para começar com segunda-feira (1) em vez de domingo (0)
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const hasEventForDay = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.data);
      // Comparar apenas ano, mês e dia para evitar problemas de fuso horário
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return { pending: [], completed: [] };
    const filtered = events.filter(event => {
      const eventDate = new Date(event.data);
      // Comparar apenas ano, mês e dia para evitar problemas de fuso horário
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });
    const pending = filtered.filter(event => event.status === 'pending');
    const completed = filtered.filter(event => event.status === 'completed');
    return { pending, completed };
  }

  const days = getDaysInMonth(currentDate);

  const { pending, completed } = getEventsForSelectedDate();

  // Função unificada para atualizar status do agendamento
  async function handleUpdateAppointmentStatus(eventId: string, status: 'pending' | 'completed') {
    try {
      const response = await appointmentService.updateStatus(eventId, status);
      
      // Mostrar toast com a mensagem do backend
      if (response.success) {
        showToast.success(response.message);
        
        // Se houve erro na transação, mostrar toast de aviso
        if (response.transactionInfo?.error) {
          showToast.warning('Aviso: Houve um problema com a transação financeira. Verifique o módulo financeiro.');
        }
      }
      
      // Atualizar lista de eventos após mudança de status
      if (!userId) return;
      const res = await appointmentService.getByUserId(userId);
      const mapped = (res.data || []).map((appt: any) => ({
        id: appt.id,
        paciente: appt.patient_name,
        tipo: appt.service?.name || '',
        local: 'Clínica',
        telefone: appt.patient_phone || '',
        status: appt.status === 'confirmed' ? 'confirmed' : appt.status === 'completed' ? 'completed' : 'pending',
        horario: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        duracao: appt.service?.duration ? `${appt.service.duration}min` : '',
        data: appt.start_time,
      }));
      setEvents(mapped);
    } catch (error: any) {
      showToast.error(error.message || `Erro ao marcar como ${status === 'completed' ? 'concluído' : 'pendente'}`);
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header da Agenda */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            </div>
            <span className="text-gray-500 text-sm">Gerencie seus agendamentos e horários</span>
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-300 rounded px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-100" onClick={() => setShowWorkScheduleModal(true)}>
              <Gear size={18} /> Configurar Horários
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors" onClick={() => setShowAddEvent(true)}>
              <Plus size={18} /> Novo Agendamento
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Calendário à esquerda */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="text-lg font-semibold text-gray-800 text-center mb-2">Calendário</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <CaretLeft size={20} />
                </button>
                <span className="text-gray-700 font-medium">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <CaretRight size={20} />
                </button>
              </div>
              {/* Aqui pode ir um calendário real, por enquanto placeholder */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                  {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => <div key={d} className="text-center py-1">{d}</div>)}
                  </div>
                {/* Exemplo de dias */}
              <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => (
                    <button
                      key={i}
                      disabled={!day}
                      onClick={() => day && setSelectedDate(day)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center relative
                        ${day && selectedDate && day.toDateString() === selectedDate.toDateString() ? 'bg-blue-900 text-white font-bold' : 'hover:bg-gray-100'}
                        ${!day ? 'opacity-0 cursor-default' : ''}
                      `}
                    >
                      {day ? day.getDate() : ''}
                      {/* Bolinha verde se houver agendamento */}
                      {day && hasEventForDay(day) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                    </button>
                  ))}
                    </div>
              </div>
            </div>
          </div>
          {/* Cards de agendamento centralizados */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-xl font-bold text-gray-900 mb-2 text-center">
                {`Agendamentos - ${selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}`}
              </div>
              {/* Abas de seleção */}
              <div className="flex w-full mb-6 gap-2">
                <button
                  className={`flex-1 py-2 rounded font-semibold text-base transition-colors border
                    ${agendaTab === 'pendentes'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 hover:text-blue-700'}
                  `}
                  onClick={() => setAgendaTab('pendentes')}
                >Pendentes</button>
                <button
                  className={`flex-1 py-2 rounded font-semibold text-base transition-colors border
                    ${agendaTab === 'concluidos'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 hover:text-blue-700'}
                  `}
                  onClick={() => setAgendaTab('concluidos')}
                >Concluídos</button>
              </div>
              {/* Lista da aba selecionada */}
              {agendaTab === 'pendentes' ? (
                pending.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">Nenhum agendamento pendente.</div>
                ) : (
                  pending.map((event, idx) => (
                    <div key={event.id} className="rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm mb-3">
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-gray-900">{event.horario}</span>
                      <span className="text-xs text-gray-500">{event.duracao}</span>
                    </div>
                      </div>
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-base flex items-center gap-1">
                            <User size={16} /> {event.paciente}
                          </div>
                      <div className="text-sm text-gray-600">{event.tipo}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span><MapPin size={14} className="inline" /> {event.local}</span>
                        <span>|</span>
                        <span>{event.telefone}</span>
                      </div>
                    </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 min-w-[120px] md:justify-end">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            {event.status === 'completed' ? 'concluído' : 'pendente'}
                      </span>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            onClick={() => handleUpdateAppointmentStatus(event.id, 'completed')}
                          >Marcar como concluído</button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            onClick={() => {
                              setEventToDelete(event);
                              setDeleteModalOpen(true);
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                completed.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">Nenhum agendamento concluído.</div>
                ) : (
                  completed.map((event, idx) => (
                    <div key={event.id} className="rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm mb-3 bg-green-50">
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-gray-900">{event.horario}</span>
                          <span className="text-xs text-gray-500">{event.duracao}</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-base flex items-center gap-1">
                            <User size={16} /> {event.paciente}
                  </div>
                          <div className="text-sm text-gray-600">{event.tipo}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span><MapPin size={14} className="inline" /> {event.local}</span>
                            <span>|</span>
                            <span>{event.telefone}</span>
              </div>
            </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 min-w-[120px] md:justify-end">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">concluído</span>
                          <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                            onClick={() => handleUpdateAppointmentStatus(event.id, 'pending')}
                          >Marcar como pendente</button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            onClick={() => {
                              setEventToDelete(event);
                              setDeleteModalOpen(true);
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Card de Compartilhamento da Agenda Pública */}
        <div className="mt-8">
          <ShareAgendaCard 
            userId={userId || ''} 
            variant="compact"
          />
        </div>

        {/* Modal de Configuração de Horários */}
        <WorkScheduleConfigModal isOpen={showWorkScheduleModal} onClose={() => setShowWorkScheduleModal(false)} />
      {/* Modal para adicionar evento */}
        <AppointmentCreateModal
          isOpen={showAddEvent}
          onClose={() => setShowAddEvent(false)}
          services={services}
        />
        <AppointmentConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setEventToDelete(null); }}
          onConfirm={async () => {
            if (eventToDelete) {
              try {
                await appointmentService.deleteById(eventToDelete.id);
                setEvents(events.filter(e => e.id !== eventToDelete.id));
              } catch {
                alert('Erro ao excluir agendamento');
              }
              setDeleteModalOpen(false);
              setEventToDelete(null);
            }
          }}
          patientName={eventToDelete?.paciente}
                />
              </div>
    </div>
  );
} 