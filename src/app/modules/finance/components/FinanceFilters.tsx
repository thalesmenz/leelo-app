'use client';

import { useState, useEffect } from 'react';
import { Users, Funnel, Buildings } from 'phosphor-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { useAuth } from '../../../hooks/useAuth';
import { subuserService } from '../../../services/subuserService';
import { showToast } from '../../../utils/toast';

interface Subuser {
  id: string;
  name: string;
  email: string;
}

export default function FinanceFilters() {
  const { 
    isConsolidatedView, 
    toggleConsolidatedView, 
    selectedUserFilter, 
    setSelectedUserFilter,
    selectedSubuserId,
    setSelectedSubuserId,
    setConsolidatedData,
    setIsLoadingConsolidated,
    isFeatureEnabled
  } = useFinance();
  
  const { userId } = useAuth();
  const [subusers, setSubusers] = useState<Subuser[]>([]);
  const [loadingSubusers, setLoadingSubusers] = useState(false);

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
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Buildings size={20} className="text-blue-600" />
            <span className="text-blue-800 font-medium">Visão Individual</span>
            <span className="text-blue-600 text-sm">(apenas seus dados)</span>
          </div>
          <button
            onClick={toggleConsolidatedView}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Users size={16} />
            Ativar Visão Consolidada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            <span className="text-green-800 font-medium">Visão Consolidada</span>
            <span className="text-green-600 text-sm">(dados de todos os fisioterapeutas)</span>
          </div>
          <button
            onClick={toggleConsolidatedView}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Buildings size={16} />
            Voltar à Visão Individual
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-green-700 font-medium text-sm">Filtrar por:</span>
          
          {/* Filtro de usuário */}
          <div className="flex gap-2">
            <button
              onClick={() => handleUserFilterChange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedUserFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleUserFilterChange('main')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedUserFilter === 'main'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
              }`}
            >
              Este Usuário
            </button>
            <button
              onClick={() => handleUserFilterChange('subuser')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedUserFilter === 'subuser'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
              }`}
            >
              Fisioterapeuta
            </button>
          </div>

          {/* Seletor de subusuário */}
          {selectedUserFilter === 'subuser' && (
            <div className="flex items-center gap-2">
              <span className="text-green-700 text-sm">Selecionar:</span>
              <select
                value={selectedSubuserId || ''}
                onChange={(e) => handleSubuserChange(e.target.value || null)}
                className="px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
                disabled={loadingSubusers}
              >
                <option value="">Selecione um fisioterapeuta</option>
                {subusers.map((subuser) => (
                  <option key={subuser.id} value={subuser.id}>
                    {subuser.name}
                  </option>
                ))}
              </select>
              {loadingSubusers && (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}
        </div>

        {/* Informações do filtro ativo */}
        <div className="text-sm text-green-600">
          {selectedUserFilter === 'all' && 'Mostrando dados de todos os usuários (consolidado)'}
          {selectedUserFilter === 'main' && 'Mostrando apenas seus dados'}
          {selectedUserFilter === 'subuser' && selectedSubuserId && 
            `Mostrando dados do fisioterapeuta: ${subusers.find(s => s.id === selectedSubuserId)?.name}`
          }
          {selectedUserFilter === 'subuser' && !selectedSubuserId && 
            'Selecione um fisioterapeuta para ver seus dados'
          }
        </div>
      </div>
    </div>
  );
}
