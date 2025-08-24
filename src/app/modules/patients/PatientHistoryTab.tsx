'use client';

import { useState, useEffect } from 'react';
import { CalendarBlank, Clock, User, FileText, MapPin, CheckCircle, XCircle, Clock as ClockIcon } from 'phosphor-react';
import { appointmentService } from '../../services/appointmentService';
import { showToast } from '@/app/utils/toast';

interface Appointment {
  id: string;
  patient_name: string;
  patient_cpf: string;
  patient_phone: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  service?: {
    name: string;
    duration: number;
    price: number;
  };
  created_at: string;
}

export default function PatientHistoryTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'completed' | 'pending' | 'canceled'>('todos');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await appointmentService.getByUserId(userId);
        setAppointments(response.data || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      setAppointments([]);
      showToast.error('Erro ao carregar histórico de consultas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const getFilteredAppointments = () => {
    if (statusFilter === 'todos') return appointments;
    return appointments.filter(appointment => appointment.status === statusFilter);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700`}>
            <CheckCircle size={12} />
            Concluída
          </span>
        );
      case 'confirmed':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700`}>
            <ClockIcon size={12} />
            Confirmada
          </span>
        );
      case 'canceled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700`}>
            <XCircle size={12} />
            Cancelada
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
            <ClockIcon size={12} />
            Pendente
          </span>
        );
    }
  };

  const getStatusCounts = () => {
    const counts = {
      todos: appointments.length,
      completed: appointments.filter(a => a.status === 'completed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      canceled: appointments.filter(a => a.status === 'canceled').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando histórico de consultas...</div>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();
  const statusCounts = getStatusCounts();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <FileText size={24} /> Histórico de Consultas
        </div>
      </div>

      {/* Filtros de Status */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'todos'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos ({statusCounts.todos})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'completed'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Concluídas ({statusCounts.completed})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'pending'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pendentes ({statusCounts.pending})
        </button>
        <button
          onClick={() => setStatusFilter('canceled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'canceled'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Canceladas ({statusCounts.canceled})
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma consulta encontrada.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-xl border px-6 py-4 shadow-sm hover:shadow-md transition-all bg-gray-50 border-gray-200"
            >
              {/* Ícone */}
              <div className="rounded-full p-2 mr-4 bg-blue-100 text-blue-600">
                <CalendarBlank size={22} />
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-base truncate">
                  {appointment.patient_name}
                </div>
                <div className="text-xs text-gray-500 flex gap-2 items-center truncate">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {appointment.service?.name || 'Serviço não especificado'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(appointment.start_time)} às {formatTime(appointment.start_time)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    Clínica
                  </span>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex flex-col items-end min-w-[120px] ml-4">
                {getStatusBadge(appointment.status)}
                {appointment.service?.price && (
                  <span className="text-sm text-gray-600 mt-1">
                    R$ {appointment.service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 