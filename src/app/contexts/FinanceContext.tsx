'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isFeatureEnabled } from '../config/features';
import { subuserService } from '../services/subuserService';

interface FinanceContextType {
  // Controle da visão consolidada
  isConsolidatedView: boolean;
  toggleConsolidatedView: () => void;
  
  // Filtros
  selectedUserFilter: 'all' | 'main' | 'subuser';
  selectedSubuserId: string | null;
  
  // Filtros de período
  selectedMonth: number;
  selectedYear: number;
  
  // Setters
  setSelectedUserFilter: (filter: 'all' | 'main' | 'subuser') => void;
  setSelectedSubuserId: (id: string | null) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  
  // Dados consolidados
  consolidatedData: any | null;
  setConsolidatedData: (data: any) => void;
  
  // Loading
  isLoadingConsolidated: boolean;
  setIsLoadingConsolidated: (loading: boolean) => void;
  
  // Função para recarregar dados consolidados
  refreshConsolidatedData: () => Promise<void>;
  
  // Verificar se a funcionalidade está ativa
  isFeatureEnabled: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user, userId } = useAuth();
  const [isConsolidatedView, setIsConsolidatedView] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'main' | 'subuser'>('all');
  const [selectedSubuserId, setSelectedSubuserId] = useState<string | null>(null);
  
  // Inicializa com o mês e ano atuais
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  const [consolidatedData, setConsolidatedData] = useState<any | null>(null);
  const [isLoadingConsolidated, setIsLoadingConsolidated] = useState(false);

  // Verifica se a funcionalidade está ativa
  const featureEnabled = isFeatureEnabled('FINANCE_CONSOLIDATED_VIEW');

  const toggleConsolidatedView = () => {
    if (!featureEnabled) return;
    setIsConsolidatedView(!isConsolidatedView);
    // Reset filters when toggling
    if (!isConsolidatedView) {
      setSelectedUserFilter('all');
      setSelectedSubuserId(null);
    }
  };

  const refreshConsolidatedData = useCallback(async () => {
    if (!userId || !isConsolidatedView || selectedUserFilter !== 'all') return;
    
    try {
      setIsLoadingConsolidated(true);
      const response = await subuserService.getConsolidatedData(userId);
      if (response.success) {
        setConsolidatedData(response.data);
      }
    } catch (error) {
      console.error('Erro ao recarregar dados consolidados:', error);
    } finally {
      setIsLoadingConsolidated(false);
    }
  }, [userId, isConsolidatedView, selectedUserFilter]);

  const value: FinanceContextType = {
    isConsolidatedView: featureEnabled ? isConsolidatedView : false,
    toggleConsolidatedView,
    selectedUserFilter,
    selectedSubuserId,
    selectedMonth,
    selectedYear,
    setSelectedUserFilter,
    setSelectedSubuserId,
    setSelectedMonth,
    setSelectedYear,
    consolidatedData,
    setConsolidatedData,
    isLoadingConsolidated,
    setIsLoadingConsolidated,
    refreshConsolidatedData,
    isFeatureEnabled: featureEnabled,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
