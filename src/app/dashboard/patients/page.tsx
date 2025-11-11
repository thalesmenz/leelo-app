'use client';

import { useEffect, useState } from 'react';
import { Users, ArrowUpRight, ArrowDownRight, CalendarBlank, Plus } from 'phosphor-react';
import SummaryCard from '../../components/SummaryCard';
import { patientService } from '../../services/patientService';
import {
  PatientsTab, 
  PatientPlansTab,
  PatientHistoryTab, 
  PatientStatisticsTab 
} from '../../modules/patients';

const tabs = [
  'Pacientes',
  // 'Planos', // Desabilitado para o MVP
  'Histórico',
  'Estatísticas',
];

export default function PatientsPage() {
  const [tab, setTab] = useState('Pacientes');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) return;
    setLoadingStats(true);
    patientService.getStatistics(userId)
      .then(res => setStats(res.data))
      .finally(() => setLoadingStats(false));
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'Pacientes':
        return <PatientsTab />;
      // case 'Planos':
      //   return <PatientPlansTab />;
      case 'Histórico':
        return <PatientHistoryTab />;
      case 'Estatísticas':
        return <PatientStatisticsTab key={refreshKey} />;
      default:
        return <PatientsTab />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
              <span className="text-blue-600">
                <Users size={24} className="sm:w-7 sm:h-7" weight="fill" />
              </span>
              Pacientes
            </h1>
            <p className="text-sm sm:text-base text-gray-500">Gerencie informações dos seus pacientes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {loadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded shadow p-5 h-28 animate-pulse" />
            ))
          ) : (
            <>
              <SummaryCard
                title="Total de Pacientes"
                value={String(stats.totalPatients)}
                variation="Total de pacientes cadastrados"
                icon={<Users size={20} className="text-blue-500" />}
                variationColor="text-blue-600"
              />
              <SummaryCard
                title="Pacientes Ativos"
                value={String(stats.activePatients)}
                variation="Com status ativo"
                icon={<ArrowUpRight size={20} className="text-green-500" />}
                variationColor="text-green-600"
              />
              <SummaryCard
                title="Novos Pacientes"
                value={String(stats.newPatientsThisMonth)}
                variation="Este mês"
                icon={<ArrowDownRight size={20} className="text-purple-500" />}
                variationColor="text-purple-600"
              />
              <SummaryCard
                title="Taxa de Atividade"
                value={`${stats.totalPatients > 0 ? Math.round((stats.activePatients / stats.totalPatients) * 100) : 0}%`}
                variation="Pacientes ativos vs total"
                icon={<CalendarBlank size={20} className="text-orange-500" />}
                variationColor="text-orange-600"
              />
            </>
          )}
        </div>
        
        <div className="flex w-full mb-4 sm:mb-6 lg:mb-8 gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button 
              key={t}
              className={`flex-1 sm:flex-none min-w-[100px] py-2 px-3 sm:px-4 rounded font-semibold text-sm sm:text-base transition-colors border whitespace-nowrap
                ${tab === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 hover:text-blue-700'}
              `}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
}
