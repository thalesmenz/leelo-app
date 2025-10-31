'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SummaryCard from '../components/SummaryCard';
import { appointmentService } from '../services/appointmentService';
import { transactionService } from '../services/transactionService';
import { patientService } from '../services/patientService';
import { ArrowUpRight, ArrowDownRight, CalendarBlank, UserPlus, Plus, Users, Calendar, FileText, ArrowRight, Sparkle, CheckCircle } from 'phosphor-react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #eee', padding: 10 }}>
        <div><b>{label}</b></div>
        <div style={{ color: '#3b82f6' }}>
          Receita: {payload.find((p: any) => p.dataKey === 'revenue')?.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <div style={{ color: '#ef4444' }}>
          Despesas: {payload.find((p: any) => p.dataKey === 'expenses')?.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const { user, userId } = useAuth();
  const router = useRouter();
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [patientStats, setPatientStats] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleViewFullAgenda = () => {
    router.push('/dashboard/agenda');
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (!userId) return;
      try {
        setLoading(true);
        const [appointmentsRes, financialRes, patientRes, historicalRes] = await Promise.all([
          appointmentService.getByUserId(userId),
          transactionService.getStatistics(userId),
          patientService.getStatistics(userId),
          transactionService.getHistoricalData(userId, 6)
        ]);
        const today = new Date();
        const appointments = (appointmentsRes.data || []).filter((appt: any) => {
          const apptDate = new Date(appt.start_time);
          return (
            apptDate.getFullYear() === today.getFullYear() &&
            apptDate.getMonth() === today.getMonth() &&
            apptDate.getDate() === today.getDate()
          );
        }).map((appt: any) => ({
          time: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          duration: appt.service?.duration ? `${appt.service.duration}min` : '',
          name: appt.patient_name,
          type: appt.service?.name || '',
          location: 'Clínica',
          status: appt.status,
        }));
        setTodaySchedule(appointments);
        setFinancialStats(financialRes.data);
        setPatientStats(patientRes.data);
        setFinancialData(historicalRes.data || []);

        // Verificar se é usuário novo (sem dados)
        const hasData = appointmentsRes.data?.length > 0 || 
                       financialRes.data?.receitaMes > 0 || 
                       patientRes.data?.newPatientsThisMonth > 0;
        setIsNewUser(!hasData);
      } catch (error) {
        setTodaySchedule([]);
        setFinancialStats(null);
        setPatientStats(null);
        setFinancialData([]);
        setIsNewUser(true); // Se der erro, assume que é usuário novo
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [userId]);

  const welcomeSteps = [
    {
      id: 1,
      title: 'Criar Serviço',
      description: 'Defina os serviços que você oferece',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/services',
      completed: false
    },
    {
      id: 2,
      title: 'Adicionar Paciente',
      description: 'Cadastre seus primeiros pacientes',
      icon: Users,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/patients',
      completed: false
    },
    {
      id: 3,
      title: 'Primeiro Agendamento',
      description: 'Agende sua primeira consulta',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/agenda',
      completed: false
    }
  ];

  const quickActions = [
    {
      title: 'Novo Paciente',
      description: 'Cadastrar novo paciente',
      icon: Users,
      href: '/dashboard/patients',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Novo Serviço',
      description: 'Criar novo serviço',
      icon: Plus,
      href: '/dashboard/services',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Novo Agendamento',
      description: 'Agendar consulta',
      icon: Calendar,
      href: '/dashboard/agenda',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Prontuário',
      description: 'Criar prontuário',
      icon: FileText,
      href: '/dashboard/records',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      
      {/* Seção de Boas-vindas para Novos Usuários */}
      {isNewUser && !loading && (
        <section className="px-8 py-6">
          <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Sparkle size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bem-vindo, {user?.name || 'Usuário'}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Vamos começar a configurar sua clínica?
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-500" />
                Primeiros Passos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {welcomeSteps.map((step) => (
                  <Link
                    key={step.id}
                    href={step.href}
                    className="group block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <step.icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                      Começar <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cards Resumo */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 py-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded shadow p-5 h-28 animate-pulse" />
          ))
        ) : (
          <>
            <SummaryCard 
              title="Receita do Mês" 
              value={financialStats ? `R$ ${financialStats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'} 
              variation="Este mês"
              icon={<ArrowUpRight size={20} className="text-green-500" />}
              variationColor="text-green-600"
            />
            <SummaryCard 
              title="Próximos Atendimentos" 
              value={todaySchedule.length.toString()} 
              variation="Hoje"
              icon={<CalendarBlank size={20} className="text-blue-500" />}
              variationColor="text-blue-600"
            />
            <SummaryCard 
              title="Novos Pacientes" 
              value={patientStats ? patientStats.newPatientsThisMonth.toString() : '0'} 
              variation="Este mês"
              icon={<UserPlus size={20} className="text-purple-500" />}
              variationColor="text-purple-600"
            />
            <SummaryCard 
              title="Lucro Líquido" 
              value={financialStats ? `R$ ${financialStats.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'} 
              variation="Este mês"
              icon={<ArrowDownRight size={20} className="text-green-500" />}
              variationColor="text-green-600"
              valueColor={financialStats ? (financialStats.lucroMes >= 0 ? "text-gray-900" : "text-red-600") : "text-gray-900"}
            />
          </>
        )}
      </section>

      {/* Ações Rápidas */}
      <section className="px-8 pb-6">
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group block p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda de Hoje */}
      <main className="flex-1 px-8 pb-8">
        <section className="lg:col-span-2 bg-white rounded shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Agenda de Hoje</h3>
            <button 
              onClick={handleViewFullAgenda}
              className="border border-gray-300 rounded px-3 py-1 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Ver Agenda Completa
            </button>
          </div>
          <ul className="space-y-3">
            {loading ? (
              <li className="text-gray-500 text-center py-4">Carregando agendamentos...</li>
            ) : todaySchedule.length === 0 ? (
              <li className="text-gray-500 text-center py-4">Nenhum agendamento para hoje.</li>
            ) : (
              todaySchedule.map((item, idx) => (
                <li key={idx} className={`flex items-center justify-between rounded p-3 ${
                  item.status === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-700 w-16">{item.time}</div>
                    <div className="text-xs text-gray-400">{item.duration}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.type}</div>
                      <div className="text-xs text-gray-400">{item.location}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                    item.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'confirmed' ? 'Confirmado' : 
                     item.status === 'completed' ? 'Concluído' : 
                     'Pendente'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>

      {/* Gráfico de Desempenho Financeiro */}
      <section className="bg-white rounded shadow p-6 mt-8 mx-8">
        <h3 className="text-xl font-bold mb-4">Desempenho Financeiro</h3>
        <div className="w-full">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-gray-500">Carregando dados do gráfico...</div>
            </div>
          ) : financialData.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-gray-500">Nenhum dado financeiro disponível</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Despesas" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
} 