'use client'

import { useState, useEffect, use } from 'react';
import { Calendar, CaretLeft, CaretRight, Clock, User, CheckCircle, ArrowLeft } from 'phosphor-react';
import { PhoneInput } from '../../components/PhoneInput';
import { showToast } from '../../utils/toast';
import { appointmentService } from '../../services/appointmentService';
import { userService } from '../../services/userService';
import { userServiceService } from '../../services/userServiceService';

const diasSemana = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  
  // Adicionar dias do mês, mas apenas os futuros
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetar para início do dia
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    // Só incluir se o dia for hoje ou futuro
    if (dayDate >= today) {
      days.push(dayDate);
    } else {
      days.push(null); // Dia passado fica vazio
    }
  }
  return days;
}

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: 'Data', description: 'Escolha uma data' },
  { id: 2, title: 'Horário', description: 'Selecione um horário' },
  { id: 3, title: 'Serviço', description: 'Escolha o serviço' },
  { id: 4, title: 'Dados', description: 'Informações pessoais' },
  { id: 5, title: 'Confirmação', description: 'Confirme o agendamento' },
];

export default function PublicAgendaPage({ params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = use(params);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    // Se estamos no mês atual, usar hoje. Se não, usar o primeiro dia do mês atual
    return today;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = getDaysInMonth(currentDate);

  // Buscar informações do usuário
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await userService.getById(user_id);
        setUserInfo(response.data);
      } catch (error) {
        // Handle error silently
      }
    }
    fetchUserInfo();
  }, [user_id]);

  // Buscar serviços do usuário
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await userServiceService.getByUserId(user_id);
        setServices(response.data.filter((s: any) => s.active));
      } catch (error) {
        // Handle error silently
      }
    }
    fetchServices();
  }, [user_id]);

  // Buscar horários disponíveis quando uma data é selecionada
  useEffect(() => {
    if (selectedDate && currentStep >= 2) {
      fetchAvailableSlots();
    }
  }, [selectedDate, currentStep]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      // Corrigir problema de fuso horário - formatar data no fuso horário local
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const response = await appointmentService.getAvailableSlots(user_id, dateString);
      setAvailableSlots(response.data || []);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(4);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !selectedService) return;

    setIsSubmitting(true);
    try {
      const appointmentData = {
        user_id: user_id,
        service_id: selectedService.id,
        patient_cpf: patientData.cpf.replace(/\D/g, ''),
        patient_name: patientData.name,
        patient_phone: patientData.phone,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        status: 'pending'
      };

      await appointmentService.create(appointmentData);
      setCurrentStep(5);
    } catch (error) {
      showToast.error('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center mb-6">
            <Calendar size={32} className="text-blue-600 mb-2" />
            <h2 className="text-2xl font-bold mb-1 text-center">Escolha uma Data</h2>
            <span className="text-gray-500 text-center">Selecione o dia da sua consulta</span>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center mb-6">
            <Clock size={32} className="text-blue-600 mb-2" />
            <h2 className="text-2xl font-bold mb-1 text-center">Escolha um Horário</h2>
            <span className="text-gray-500 text-center">
              {selectedDate?.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </span>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center mb-6">
            <User size={32} className="text-blue-600 mb-2" />
            <h2 className="text-2xl font-bold mb-1 text-center">Escolha o Serviço</h2>
            <span className="text-gray-500 text-center">Selecione o tipo de atendimento</span>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center mb-6">
            <User size={32} className="text-blue-600 mb-2" />
            <h2 className="text-2xl font-bold mb-1 text-center">Seus Dados</h2>
            <span className="text-gray-500 text-center">Preencha suas informações</span>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center mb-6">
            <CheckCircle size={32} className="text-green-600 mb-2" />
            <h2 className="text-2xl font-bold mb-1 text-center">Agendamento Confirmado!</h2>
            <span className="text-gray-500 text-center">Seu horário foi reservado com sucesso</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStepBody = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className={`p-2 rounded-full transition-all duration-200 ${
                  currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                }`}
                disabled={currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()}
              >
                <CaretLeft size={24} />
              </button>
              <span className="text-xl font-bold text-gray-800 px-6 py-2 bg-gray-50 rounded-full">
                {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                <CaretRight size={24} />
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="grid grid-cols-7 gap-2 text-sm text-gray-500 mb-4">
                {diasSemana.map(d => (
                  <div key={d} className="text-center py-2 font-bold text-gray-600">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => {
                  const isPastDay = day && day < new Date(new Date().setHours(0, 0, 0, 0));
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  return (
                    <button
                      key={i}
                      disabled={!day || isPastDay || false}
                      onClick={() => day && !isPastDay && handleDateSelect(day)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-200
                        ${!day ? 'opacity-0 cursor-default' : ''}
                        ${isPastDay ? 'text-gray-300 cursor-not-allowed bg-gray-50' : ''}
                        ${isToday ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : ''}
                        ${day && selectedDate && day.toDateString() === selectedDate.toDateString() 
                          ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg' 
                          : !isPastDay && !isToday ? 'hover:bg-blue-50 text-gray-700 hover:text-blue-600' : ''}
                      `}
                    >
                      {day ? day.getDate() : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="w-full">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-gray-500 text-lg">Carregando horários...</div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock size={48} className="mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Nenhum horário disponível</p>
                  <p className="text-gray-500">Não há horários livres para esta data</p>
                </div>
                <button
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Escolher outra data
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                      {formatTime(slot.start_time)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedService ? `${selectedService.duration}min` : '60min'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                        {service.name}
                      </div>
                      <div className="text-gray-600 mb-3">{service.description}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {service.duration}min
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                          R$ {service.price}
                        </span>
                      </div>
                    </div>
                    <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
                      <CaretRight size={24} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PhoneInput
                label="Telefone"
                name="phone"
                value={patientData.phone}
                setValue={(value) =>
                  setPatientData((prev) => ({
                    ...prev,
                    phone: value,
                  }))
                }
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                <input
                  type="text"
                  value={patientData.cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14)}
                  onChange={(e) => {
                    const unmaskedValue = e.target.value.replace(/\D/g, '');
                    if (unmaskedValue.length <= 11) {
                      setPatientData({...patientData, cpf: unmaskedValue});
                    }
                  }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !patientData.name ||
                  !patientData.email ||
                  patientData.phone.length < 10 ||
                  !patientData.cpf
                }
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="w-full text-center">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
              <div className="text-green-800">
                <p className="text-2xl font-bold mb-3">Agendamento realizado com sucesso!</p>
                <div className="bg-white rounded-xl p-4 mb-4 inline-block">
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {selectedDate?.toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })} às {selectedSlot && formatTime(selectedSlot.start_time)}
                  </p>
                  <p className="text-gray-600">
                    {selectedService?.name} • {selectedService?.duration}min
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>✅ Você receberá uma confirmação por email.</p>
              <p>📞 Em caso de dúvidas, entre em contato conosco.</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header com informações do profissional */}
      {userInfo && (
        <div className="w-full bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{userInfo.name}</h1>
            <p className="text-lg text-gray-600 mb-1">Fisioterapeuta</p>
            <p className="text-gray-500">Agende sua consulta online de forma rápida e segura</p>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Barra de etapas */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg mb-3 transition-all duration-300
                ${step.id <= currentStep 
                  ? 'bg-gradient-to-br from-blue-500 to-green-500 shadow-lg shadow-blue-200' 
                  : 'bg-gray-200 text-gray-400'}`}>
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className={`text-sm font-semibold text-center ${step.id <= currentStep ? 'text-blue-700' : 'text-gray-400'}`}>
                {step.title}
              </span>
              <span className={`text-xs text-center mt-1 ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.description}
              </span>
            </div>
          ))}
        </div>

        {/* Card centralizado */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
          {renderStepContent()}
          {renderStepBody()}
          
          {/* Botões de navegação */}
          {currentStep > 1 && currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 