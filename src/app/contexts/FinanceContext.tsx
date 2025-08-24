'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isFeatureEnabled } from '../config/features';

interface FinanceContextType {
  // Controle da visão consolidada
  isConsolidatedView: boolean;
  toggleConsolidatedView: () => void;
  
  // Filtros
  selectedUserFilter: 'all' | 'main' | 'subuser';
  selectedSubuserId: string | null;
  
  // Setters
  setSelectedUserFilter: (filter: 'all' | 'main' | 'subuser') => void;
  setSelectedSubuserId: (id: string | null) => void;
  
  // Dados consolidados
  consolidatedData: any | null;
  setConsolidatedData: (data: any) => void;
  
  // Loading
  isLoadingConsolidated: boolean;
  setIsLoadingConsolidated: (loading: boolean) => void;
  
  // Verificar se a funcionalidade está ativa
  isFeatureEnabled: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConsolidatedView, setIsConsolidatedView] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'main' | 'subuser'>('all');
  const [selectedSubuserId, setSelectedSubuserId] = useState<string | null>(null);
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

  const value: FinanceContextType = {
    isConsolidatedView: featureEnabled ? isConsolidatedView : false,
    toggleConsolidatedView,
    selectedUserFilter,
    selectedSubuserId,
    setSelectedUserFilter,
    setSelectedSubuserId,
    consolidatedData,
    setConsolidatedData,
    isLoadingConsolidated,
    setIsLoadingConsolidated,
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
