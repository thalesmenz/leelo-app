'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollar, ArrowUpRight, ArrowDownRight, CalendarBlank, Plus, Funnel, FileText } from 'phosphor-react';
import SummaryCard from '../../components/SummaryCard';
import { transactionService } from '../../services/transactionService';
import { FinanceProvider, useFinance } from '../../contexts/FinanceContext';
import FinanceFilters from '../../modules/finance/components/FinanceFilters';
import {
  TransactionsTab, 
  PlansTab, 
  ReceivablesTab, 
  PayablesTab, 
  ChartsTab 
} from '../../modules/finance';

const tabs = [
  'Transações',
  // 'Planos', // Desabilitado para o MVP
  'Contas a Receber',
  'Contas a Pagar',
  'Gráficos',
];

function FinancePageContent() {
  const [tab, setTab] = useState('Transações');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const { 
    isConsolidatedView, 
    selectedUserFilter, 
    selectedSubuserId,
    consolidatedData 
  } = useFinance();

  // Função para calcular estatísticas baseada na visão atual
  const calculateStats = async () => {
    try {
      setLoadingStats(true);
      
      if (!consolidatedData && isConsolidatedView) {
        // Se não há dados consolidados, usar dados individuais
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        if (userId) {
          const response = await transactionService.getStatistics(userId);
          setStats(response.data);
        }
        return;
      }

      if (isConsolidatedView) {
        // Calcular estatísticas baseadas nos dados consolidados
        const transactions = consolidatedData?.transactions || [];
        const accountsReceivable = consolidatedData?.accounts_receivable || [];
        const accountsPayable = consolidatedData?.accounts_payable || [];

        // Filtrar por usuário se necessário
        let filteredTransactions = transactions;
        if (selectedUserFilter === 'main') {
          const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
          filteredTransactions = transactions.filter((t: any) => t.user_id === userId);
        } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
          filteredTransactions = transactions.filter((t: any) => t.user_id === selectedSubuserId);
        }

        // Calcular estatísticas do mês atual
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        const today = now.toISOString().split('T')[0];

        // Transações do mês atual
        const monthTransactions = filteredTransactions.filter((t: any) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        });

        // Transações do mês anterior
        const prevMonthTransactions = filteredTransactions.filter((t: any) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfPrevMonth && transactionDate <= endOfPrevMonth;
        });

        // Transações de hoje
        const todayTransactions = filteredTransactions.filter((t: any) => {
          const transactionDate = new Date(t.date);
          return transactionDate.toISOString().split('T')[0] === today;
        });

        // Cálculos mês atual
        const receitaMes = monthTransactions
          .filter((t: any) => t.type === 'entrada')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0);
        
        const despesasMes = monthTransactions
          .filter((t: any) => t.type === 'saida')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0);
        
        const lucroMes = receitaMes - despesasMes;

        // Cálculos mês anterior
        const receitaMesAnterior = prevMonthTransactions
          .filter((t: any) => t.type === 'entrada')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0);
        
        const despesasMesAnterior = prevMonthTransactions
          .filter((t: any) => t.type === 'saida')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0);
        
        const lucroMesAnterior = receitaMesAnterior - despesasMesAnterior;

        // Receita de hoje
        const receitaHoje = todayTransactions
          .filter((t: any) => t.type === 'entrada')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0);
        
        const atendimentosHoje = todayTransactions
          .filter((t: any) => t.type === 'entrada').length;

        // Percentuais
        const receitaPercent = receitaMesAnterior ? ((receitaMes - receitaMesAnterior) / receitaMesAnterior) * 100 : null;
        const despesasPercent = despesasMesAnterior ? ((despesasMes - despesasMesAnterior) / despesasMesAnterior) * 100 : null;
        const lucroPercent = lucroMesAnterior ? ((lucroMes - lucroMesAnterior) / Math.abs(lucroMesAnterior)) * 100 : null;

        setStats({
          receitaMes,
          despesasMes,
          lucroMes,
          receitaHoje,
          atendimentosHoje,
          receitaPercent,
          despesasPercent,
          lucroPercent
        });
      } else {
        // Visão individual - usar service normal
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        if (userId) {
          const response = await transactionService.getStatistics(userId);
          setStats(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      // Fallback para dados individuais
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (userId) {
        const response = await transactionService.getStatistics(userId);
        setStats(response.data);
      }
    } finally {
      setLoadingStats(false);
    }
  };

  // Recalcula estatísticas quando mudam os filtros
  useEffect(() => {
    calculateStats();
  }, [isConsolidatedView, selectedUserFilter, selectedSubuserId, consolidatedData]);

  // Carrega estatísticas iniciais
  useEffect(() => {
    if (!isConsolidatedView) {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (userId) {
        setLoadingStats(true);
        transactionService.getStatistics(userId)
          .then(res => setStats(res.data))
          .finally(() => setLoadingStats(false));
      }
    }
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'Transações':
        return <TransactionsTab />;
      // case 'Planos':
      //   return <PlansTab />;
      case 'Contas a Receber':
        return <ReceivablesTab />;
      case 'Contas a Pagar':
        return <PayablesTab onRefresh={handleRefresh} />;
      case 'Gráficos':
        return <ChartsTab key={refreshKey} />;
      default:
        return <TransactionsTab />;
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <span className="text-green-600">$</span> Financeiro
            </h1>
            <p className="text-gray-500">Controle suas receitas, despesas e relatórios</p>
          </div>
        </div>

        {/* Filtros de Visão Consolidada */}
        <FinanceFilters />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded shadow p-5 h-28 animate-pulse" />
            ))
          ) : (
            <>
              <SummaryCard
                title="Receita do Mês"
                value={`R$ ${stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                variation={stats.receitaPercent !== null ? `${stats.receitaPercent >= 0 ? '+' : ''}${stats.receitaPercent.toFixed(1)}% em relação ao mês anterior` : ''}
                icon={<ArrowUpRight size={20} className="text-green-500" />}
                variationColor="text-green-600"
              />
              <SummaryCard
                title="Despesas do Mês"
                value={`R$ ${stats.despesasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                variation={stats.despesasPercent !== null ? `${stats.despesasPercent >= 0 ? '+' : ''}${stats.despesasPercent.toFixed(1)}% em relação ao mês anterior` : ''}
                icon={<ArrowDownRight size={20} className="text-red-500" />}
                variationColor="text-red-600"
              />
              <SummaryCard
                title="Lucro Líquido"
                value={`R$ ${stats.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                variation={stats.lucroPercent !== null ? `${stats.lucroPercent >= 0 ? '+' : ''}${stats.lucroPercent.toFixed(1)}% em relação ao mês anterior` : ''}
                icon={<CurrencyDollar size={20} className="text-blue-500" />}
                variationColor="text-green-600"
              />
            <SummaryCard
                title="Receita de Hoje"
                value={`R$ ${stats.receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                variation={`${stats.atendimentosHoje} atendimentos hoje`}
                icon={<CalendarBlank size={20} className="text-purple-500" />}
                variationColor="text-gray-500"
              />
            </>
          )}
        </div>
        <div className="flex w-full mb-8 gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 rounded font-semibold text-base transition-colors border
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

export default function FinancePage() {
  return (
    <FinanceProvider>
      <FinancePageContent />
    </FinanceProvider>
  );
} 