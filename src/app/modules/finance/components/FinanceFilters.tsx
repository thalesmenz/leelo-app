'use client';

import { useState, useEffect } from 'react';
import { Users, Funnel, Buildings, CalendarBlank } from 'phosphor-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { useAuth } from '../../../hooks/useAuth';
import { subuserService } from '../../../services/subuserService';
import { showToast } from '../../../utils/toast';

interface Subuser {
  id: string;
  name: string;
  email: string;
}

const months = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

export default function FinanceFilters() {
  const { 
    isConsolidatedView, 
    toggleConsolidatedView, 
    selectedUserFilter, 
    setSelectedUserFilter,
    selectedSubuserId,
    setSelectedSubuserId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    setConsolidatedData,
    setIsLoadingConsolidated,
    isFeatureEnabled
  } = useFinance();
  
  const { userId, user } = useAuth();
  const [subusers, setSubusers] = useState<Subuser[]>([]);
  const [loadingSubusers, setLoadingSubusers] = useState(false);

  // Gerar anos dos últimos 5 anos até o próximo ano
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

  // Se a funcionalidade não estiver ativa, não renderiza nada
  if (!isFeatureEnabled) {
    return null;
  }

  // Carrega subusuários quando ativa a visão consolidada
  useEffect(() => {
    if (isConsolidatedView && userId) {
      loadSubusers();
    }
  }, [isConsolidatedView, userId]);

  // Carrega dados consolidados quando muda o filtro
  useEffect(() => {
    if (isConsolidatedView && userId && selectedUserFilter === 'all') {
      loadConsolidatedData();
    }
  }, [isConsolidatedView, userId, selectedUserFilter]);

  const loadSubusers = async () => {
    try {
      setLoadingSubusers(true);
      const response = await subuserService.getByUserId(userId!);
      if (response.success) {
        setSubusers(response.data || []);
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar fisioterapeutas');
    } finally {
      setLoadingSubusers(false);
    }
  };

  const loadConsolidatedData = async () => {
    try {
      setIsLoadingConsolidated(true);
      const response = await subuserService.getConsolidatedData(userId!);
      if (response.success) {
        setConsolidatedData(response.data);
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar dados consolidados');
    } finally {
      setIsLoadingConsolidated(false);
    }
  };

  const handleUserFilterChange = (filter: 'all' | 'main' | 'subuser') => {
    setSelectedUserFilter(filter);
    setSelectedSubuserId(null);
    
    if (filter === 'all' && isConsolidatedView) {
      loadConsolidatedData();
    }
  };

  const handleSubuserChange = (subuserId: string | null) => {
    setSelectedSubuserId(subuserId);
    if (subuserId) {
      setSelectedUserFilter('subuser');
    }
  };

  if (!isConsolidatedView) {
    if (user?.is_subuser) {
      return null;
    }

    return (
      <div className="mb-6 sm:mb-8 relative overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl shrink-0">
                <Buildings size={20} className="sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Visão Individual</h3>
                <p className="text-xs sm:text-sm text-gray-600">Visualizando apenas seus dados pessoais</p>
              </div>
            </div>
            <button
              onClick={toggleConsolidatedView}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-800 hover:to-slate-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
            >
              <Users size={18} />
              Ativar Visão Consolidada
            </button>
          </div>

          {/* Filtros de Período */}
          <div className="mt-4 sm:mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-200/30">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 shrink-0">
                <CalendarBlank size={16} className="text-gray-600" />
                <span className="text-gray-700 font-semibold text-sm">Período:</span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white shadow-sm transition-all duration-200"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 bg-white shadow-sm transition-all duration-200"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8 relative overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-slate-100 rounded-xl shrink-0">
                <Users size={20} className="sm:w-6 sm:h-6 text-slate-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">Visão Consolidada</h3>
                <p className="text-xs sm:text-sm text-slate-600">Visualizando dados de todos os fisioterapeutas</p>
              </div>
            </div>
            <button
              onClick={toggleConsolidatedView}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
            >
              <Buildings size={18} />
              Voltar à Individual
            </button>
          </div>

          {/* Filtros de Período */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/30">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 shrink-0">
                <CalendarBlank size={16} className="text-slate-600" />
                <span className="text-slate-700 font-semibold text-sm">Período:</span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white shadow-sm transition-all duration-200"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white shadow-sm transition-all duration-200"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/30">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 shrink-0">
                <Funnel size={16} className="text-slate-600" />
                <span className="text-slate-700 font-semibold text-sm">Filtrar por:</span>
              </div>
              
              {/* Filtro de usuário */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleUserFilterChange('all')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedUserFilter === 'all'
                      ? 'bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => handleUserFilterChange('main')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedUserFilter === 'main'
                      ? 'bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Este Usuário
                </button>
                <button
                  onClick={() => handleUserFilterChange('subuser')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedUserFilter === 'subuser'
                      ? 'bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Fisioterapeuta
                </button>
              </div>

              {/* Seletor de subusuário */}
              {selectedUserFilter === 'subuser' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <span className="text-slate-700 font-medium text-xs sm:text-sm shrink-0">Selecionar fisioterapeuta:</span>
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <select
                      value={selectedSubuserId || ''}
                      onChange={(e) => handleSubuserChange(e.target.value || null)}
                      className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white shadow-sm transition-all duration-200 appearance-none pr-8"
                      disabled={loadingSubusers}
                    >
                      <option value="">Selecione um fisioterapeuta</option>
                      {subusers.map((subuser) => (
                        <option key={subuser.id} value={subuser.id}>
                          {subuser.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {loadingSubusers && (
                    <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informações do filtro ativo */}
          <div className="bg-slate-100/50 rounded-xl p-3 border border-slate-200/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full shrink-0"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 break-words">
                {selectedUserFilter === 'all' && 'Mostrando dados de todos os usuários (consolidado)'}
                {selectedUserFilter === 'main' && 'Mostrando apenas seus dados pessoais'}
                {selectedUserFilter === 'subuser' && selectedSubuserId && 
                  `Mostrando dados do fisioterapeuta: ${subusers.find(s => s.id === selectedSubuserId)?.name}`
                }
                {selectedUserFilter === 'subuser' && !selectedSubuserId && 
                  'Selecione um fisioterapeuta para visualizar seus dados'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}