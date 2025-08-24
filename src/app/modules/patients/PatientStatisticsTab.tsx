'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { showToast } from '@/app/utils/toast';
import { Users, CalendarBlank, TrendUp, UserPlus } from 'phosphor-react';
import SummaryCard from '../../components/SummaryCard';

const pieColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#10b981', '#6366f1'];

export default function PatientStatisticsTab() {
  const [chartTab, setChartTab] = useState('Pacientes');
  const [patientStats, setPatientStats] = useState<any>(null);
  const [appointmentStats, setAppointmentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const [patientResponse, appointmentResponse] = await Promise.all([
          patientService.getStatistics(userId),
          appointmentService.getByUserId(userId)
        ]);
        setPatientStats(patientResponse.data);
        
        // Processar estatísticas de agendamentos
        const appointments = appointmentResponse.data || [];
        const appointmentStats = {
          total: appointments.length,
          completed: appointments.filter((a: any) => a.status === 'completed').length,
          pending: appointments.filter((a: any) => a.status === 'pending').length,
          canceled: appointments.filter((a: any) => a.status === 'canceled').length,
          confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
        };
        setAppointmentStats(appointmentStats);
      }
    } catch (error) {
      showToast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const patientData = patientStats ? [
    { name: 'Ativos', valor: patientStats.activePatients, color: '#22c55e' },
    { name: 'Inativos', valor: patientStats.totalPatients - patientStats.activePatients, color: '#f59e0b' },
  ] : [];

  const appointmentData = appointmentStats ? [
    { name: 'Concluídas', valor: appointmentStats.completed, color: '#22c55e' },
    { name: 'Pendentes', valor: appointmentStats.pending, color: '#f59e0b' },
  ] : [];

  // Dados de evolução mensal (simulados - você pode implementar dados reais)
  const evolutionData = [
    { mes: 'Jan', pacientes: 15, consultas: 45 },
    { mes: 'Fev', pacientes: 18, consultas: 52 },
    { mes: 'Mar', pacientes: 22, consultas: 68 },
    { mes: 'Abr', pacientes: 25, consultas: 75 },
    { mes: 'Mai', pacientes: 28, consultas: 82 },
    { mes: 'Jun', pacientes: 32, consultas: 95 },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando estatísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <h2 className="text-xl font-bold mb-6">Estatísticas de Pacientes</h2>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total de Pacientes"
          value={String(patientStats?.totalPatients || 0)}
          variation="Total de pacientes cadastrados"
          icon={<Users size={20} className="text-blue-500" />}
          variationColor="text-blue-600"
        />
        
        <SummaryCard
          title="Pacientes Ativos"
          value={String(patientStats?.activePatients || 0)}
          variation="Com status ativo"
          icon={<UserPlus size={20} className="text-green-500" />}
          variationColor="text-green-600"
        />
        
        <SummaryCard
          title="Novos Este Mês"
          value={String(patientStats?.newPatientsThisMonth || 0)}
          variation="Cadastrados este mês"
          icon={<TrendUp size={20} className="text-purple-500" />}
          variationColor="text-purple-600"
        />
        
        <SummaryCard
          title="Total Consultas"
          value={String(appointmentStats?.total || 0)}
          variation="Total de agendamentos"
          icon={<CalendarBlank size={20} className="text-orange-500" />}
          variationColor="text-orange-600"
        />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'Pacientes' 
              ? 'bg-blue-100 border-blue-600 text-blue-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-blue-700'
          }`}
          onClick={() => setChartTab('Pacientes')}
        >
          Pacientes
        </button>
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'Consultas' 
              ? 'bg-green-100 border-green-600 text-green-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-green-700'
          }`}
          onClick={() => setChartTab('Consultas')}
        >
          Consultas
        </button>
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'Evolução' 
              ? 'bg-purple-100 border-purple-600 text-purple-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-purple-700'
          }`}
          onClick={() => setChartTab('Evolução')}
        >
          Evolução
        </button>
      </div>

      {chartTab === 'Pacientes' && (
        <div className="space-y-6">
          {/* Gráfico de Pizza */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientData}
                  dataKey="valor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {patientData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} pacientes`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold pt-4 mb-4 text-center">Comparativo por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v} pacientes`} />
                <Bar dataKey="valor">
                  {patientData.map((entry, idx) => (
                    <Cell key={`cell-bar-pacientes-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartTab === 'Consultas' && (
        <div className="space-y-6">
          {/* Gráfico de Pizza */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentData}
                  dataKey="valor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {appointmentData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} consultas`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold pt-4 mb-4 text-center">Comparativo por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v} consultas`} />
                <Bar dataKey="valor">
                  {appointmentData.map((entry, idx) => (
                    <Cell key={`cell-bar-consultas-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartTab === 'Evolução' && (
        <div className="space-y-6">
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolução Mensal</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pacientes" stroke="#3b82f6" strokeWidth={2} name="Pacientes" />
                <Line type="monotone" dataKey="consultas" stroke="#22c55e" strokeWidth={2} name="Consultas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 