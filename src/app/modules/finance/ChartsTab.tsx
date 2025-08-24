'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { accountsReceivableService } from '../../services/accountsReceivableService';
import { accountsPayableService } from '../../services/accountsPayableService';
import { useFinance } from '@/app/contexts/FinanceContext';
import { useAuth } from '@/app/hooks/useAuth';
import { showToast } from '@/app/utils/toast';

const pieColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#10b981', '#6366f1'];

interface ReceivableStats {
  received: number;
  pending: number;
}

interface PayableStats {
  paid: number;
  pending: number;
}

export default function ChartsTab() {
  const { userId } = useAuth();
  const { 
    isConsolidatedView, 
    selectedUserFilter, 
    selectedSubuserId,
    consolidatedData 
  } = useFinance();
  
  const [chartTab, setChartTab] = useState('A Receber');
  const [receivableStats, setReceivableStats] = useState<ReceivableStats | null>(null);
  const [payableStats, setPayableStats] = useState<PayableStats | null>(null);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para calcular evolução mensal real
  const calculateMonthlyEvolution = () => {
    if (!consolidatedData) return [];

    const { transactions, accounts_receivable, accounts_payable } = consolidatedData;
    
    // Obter todos os meses únicos das transações
    const allMonths = new Set<string>();
    
    // Adicionar meses das transações
    transactions?.forEach((transaction: any) => {
      if (transaction.date) {
        const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        allMonths.add(month);
      }
    });

    // Adicionar meses das contas a receber
    accounts_receivable?.forEach((receivable: any) => {
      if (receivable.due_date) {
        const month = new Date(receivable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        allMonths.add(month);
      }
    });

    // Adicionar meses das contas a pagar
    accounts_payable?.forEach((payable: any) => {
      if (payable.due_date) {
        const month = new Date(payable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        allMonths.add(month);
      }
    });

    // Converter para array e ordenar cronologicamente
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const dateA = new Date(a + ' 01, 20' + a.split('/')[1]);
      const dateB = new Date(b + ' 01, 20' + b.split('/')[1]);
      return dateA.getTime() - dateB.getTime();
    });

    // Calcular valores para cada mês
    return sortedMonths.map(month => {
      let aReceber = 0;
      let aPagar = 0;

      // Filtrar dados por usuário se necessário
      let filteredTransactions = transactions || [];
      let filteredReceivable = accounts_receivable || [];
      let filteredPayable = accounts_payable || [];

      if (selectedUserFilter === 'main') {
        filteredTransactions = transactions?.filter((t: any) => t.user_id === userId) || [];
        filteredReceivable = accounts_receivable?.filter((r: any) => r.user_id === userId) || [];
        filteredPayable = accounts_payable?.filter((p: any) => p.user_id === userId) || [];
      } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
        filteredTransactions = transactions?.filter((t: any) => t.user_id === selectedSubuserId) || [];
        filteredReceivable = accounts_receivable?.filter ((r: any) => r.user_id === selectedSubuserId) || [];
        filteredPayable = accounts_payable?.filter((p: any) => p.user_id === selectedSubuserId) || [];
      }

      // Calcular contas a receber para o mês
      filteredReceivable?.forEach((receivable: any) => {
        if (receivable.due_date) {
          const receivableMonth = new Date(receivable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (receivableMonth === month) {
            aReceber += parseFloat(receivable.amount) || 0;
          }
        }
      });

      // Calcular contas a pagar para o mês
      filteredPayable?.forEach((payable: any) => {
        if (payable.due_date) {
          const payableMonth = new Date(payable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (payableMonth === month) {
            aPagar += parseFloat(payable.amount) || 0;
          }
        }
      });

      // Adicionar transações para o mês (se houver)
      filteredTransactions?.forEach((transaction: any) => {
        if (transaction.date) {
          const transactionMonth = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (transactionMonth === month) {
            if (transaction.type === 'receita') {
              aReceber += parseFloat(transaction.amount) || 0;
            } else if (transaction.type === 'despesa') {
              aPagar += parseFloat(transaction.amount) || 0;
            }
          }
        }
      });

      return {
        mes: month,
        aReceber: Math.round(aReceber * 100) / 100, // Arredondar para 2 casas decimais
        aPagar: Math.round(aPagar * 100) / 100
      };
    });
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      
      if (!userId) return;

      if (isConsolidatedView) {
        // Usar dados consolidados para gráficos se disponíveis
        if (consolidatedData?.accounts_receivable && consolidatedData.accounts_receivable.length > 0 &&
            consolidatedData?.accounts_payable && consolidatedData.accounts_payable.length > 0) {
          
          const accountsReceivable = consolidatedData.accounts_receivable;
          const accountsPayable = consolidatedData.accounts_payable;

          // Filtrar por usuário se necessário
          let filteredReceivable = accountsReceivable;
          let filteredPayable = accountsPayable;

          if (selectedUserFilter === 'main') {
            filteredReceivable = accountsReceivable.filter((r: any) => r.user_id === userId);
            filteredPayable = accountsPayable.filter((p: any) => p.user_id === userId);
          } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
            filteredReceivable = accountsReceivable.filter((r: any) => r.user_id === selectedSubuserId);
            filteredPayable = accountsPayable.filter((p: any) => p.user_id === selectedSubuserId);
          }

          // Calcular estatísticas de contas a receber
          const received = filteredReceivable.filter((r: any) => r.status === 'recebido').length;
          const pending = filteredReceivable.filter((r: any) => r.status === 'pendente').length;
          setReceivableStats({ received, pending });

          // Calcular estatísticas de contas a pagar
          const paid = filteredPayable.filter((p: any) => p.status === 'pago').length;
          const payablePending = filteredPayable.filter((p: any) => p.status === 'pendente').length;
          setPayableStats({ paid, pending: payablePending });

          // Calcular evolução mensal real
          const monthlyData = calculateMonthlyEvolution();
          setEvolutionData(monthlyData);
        } else {
          // Se não há dados consolidados, buscar dados individuais como fallback
          const [receivableResponse, payableResponse] = await Promise.all([
            accountsReceivableService.getAll(userId),
            accountsPayableService.getAll(userId)
          ]);

          // Calcular estatísticas das contas a receber
          const receivableData = receivableResponse?.data || receivableResponse || [];
          const received = receivableData.filter((r: any) => r.status === 'recebido').length;
          const pending = receivableData.filter((r: any) => r.status === 'pendente').length;
          setReceivableStats({ received, pending });

          // Calcular estatísticas das contas a pagar
          const payableData = payableResponse?.data || payableResponse || [];
          const paid = payableData.filter((p: any) => p.status === 'pago').length;
          const payablePending = payableData.filter((p: any) => p.status === 'pendente').length;
          setPayableStats({ paid, pending: payablePending });

          // Calcular evolução mensal para visão individual
          const monthlyData = calculateIndividualMonthlyEvolution(receivableData, payableData);
          setEvolutionData(monthlyData);
        }
      } else {
        // Visão individual - buscar dados completos do usuário
        try {
          const [receivableResponse, payableResponse] = await Promise.all([
            accountsReceivableService.getAll(userId),
            accountsPayableService.getAll(userId)
          ]);

          // Calcular estatísticas das contas a receber
          const receivableData = receivableResponse?.data || receivableResponse || [];
          const received = receivableData.filter((r: any) => r.status === 'recebido').length;
          const pending = receivableData.filter((r: any) => r.status === 'pendente').length;
          setReceivableStats({ received, pending });

          // Calcular estatísticas das contas a pagar
          const payableData = payableResponse?.data || payableResponse || [];
          const paid = payableData.filter((p: any) => p.status === 'pago').length;
          const payablePending = payableData.filter((p: any) => p.status === 'pendente').length;
          setPayableStats({ paid, pending: payablePending });

          // Calcular evolução mensal para visão individual
          const monthlyData = calculateIndividualMonthlyEvolution(receivableData, payableData);
          setEvolutionData(monthlyData);
        } catch (error) {
          console.error('Erro ao carregar dados individuais:', error);
          showToast.error('Erro ao carregar dados individuais');
          // Fallback para estatísticas básicas
          setReceivableStats({ received: 0, pending: 0 });
          setPayableStats({ paid: 0, pending: 0 });
          setEvolutionData([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas dos gráficos:', error);
      showToast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular evolução mensal individual
  const calculateIndividualMonthlyEvolution = (receivableData: any[], payableData: any[]) => {
    const allMonths = new Set<string>();
    
    // Adicionar meses das contas a receber
    receivableData?.forEach((receivable: any) => {
      if (receivable.due_date) {
        const month = new Date(receivable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        allMonths.add(month);
      }
    });

    // Adicionar meses das contas a pagar
    payableData?.forEach((payable: any) => {
      if (payable.due_date) {
        const month = new Date(payable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        allMonths.add(month);
      }
    });

    // Converter para array e ordenar cronologicamente
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const dateA = new Date(a + ' 01, 20' + a.split('/')[1]);
      const dateB = new Date(b + ' 01, 20' + b.split('/')[1]);
      return dateA.getTime() - dateB.getTime();
    });

    // Calcular valores para cada mês
    return sortedMonths.map(month => {
      let aReceber = 0;
      let aPagar = 0;

      // Calcular contas a receber para o mês
      receivableData?.forEach((receivable: any) => {
        if (receivable.due_date) {
          const receivableMonth = new Date(receivable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (receivableMonth === month) {
            aReceber += parseFloat(receivable.amount) || 0;
          }
        }
      });

      // Calcular contas a pagar para o mês
      payableData?.forEach((payable: any) => {
        if (payable.due_date) {
          const payableMonth = new Date(payable.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (payableMonth === month) {
            aPagar += parseFloat(payable.amount) || 0;
          }
        }
      });

      return {
        mes: month,
        aReceber: Math.round(aReceber * 100) / 100,
        aPagar: Math.round(aPagar * 100) / 100
      };
    });
  };

  // Recarrega estatísticas quando mudam os filtros
  useEffect(() => {
    loadStats();
  }, [isConsolidatedView, selectedUserFilter, selectedSubuserId, consolidatedData]);

  // Carrega estatísticas iniciais quando userId muda ou quando não está em visão consolidada
  useEffect(() => {
    if (userId && !isConsolidatedView) {
      loadStats();
    }
  }, [userId, isConsolidatedView]);

  // Carrega estatísticas iniciais na visão consolidada quando userId ou consolidatedData mudam
  useEffect(() => {
    if (userId && isConsolidatedView && consolidatedData) {
      loadStats();
    }
  }, [userId, isConsolidatedView, consolidatedData]);

  const receivableData = receivableStats ? [
    { name: 'Recebido', valor: receivableStats.received, color: '#22c55e' },
    { name: 'Pendente', valor: receivableStats.pending, color: '#f59e0b' },
  ] : [];

  const payableData = payableStats ? [
    { name: 'Pago', valor: payableStats.paid, color: '#22c55e' },
    { name: 'Pendente', valor: payableStats.pending, color: '#f59e0b' },
  ] : [];

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
      <h2 className="text-xl font-bold mb-6">Gráficos Financeiros</h2>
      <div className="flex gap-2 mb-6">
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'A Receber' 
              ? 'bg-blue-100 border-blue-600 text-blue-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-blue-700'
          }`}
          onClick={() => setChartTab('A Receber')}
        >
          Contas a Receber
        </button>
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'A Pagar' 
              ? 'bg-red-100 border-red-600 text-red-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-red-700'
          }`}
          onClick={() => setChartTab('A Pagar')}
        >
          Contas a Pagar
        </button>
        <button
          className={`flex-1 py-2 rounded transition-colors font-semibold text-base border ${
            chartTab === 'Evolução' 
              ? 'bg-green-100 border-green-600 text-green-700' 
              : 'bg-gray-50 border-transparent text-gray-500 hover:text-green-700'
          }`}
          onClick={() => setChartTab('Evolução')}
        >
          Evolução Mensal
        </button>
      </div>

      {chartTab === 'A Receber' && (
        <div className="space-y-6">
          {/* Gráfico de Pizza */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={receivableData}
                  dataKey="valor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {receivableData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} contas`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold pt-4 mb-4 text-center">Comparativo por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={receivableData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v} contas`} />
                <Bar dataKey="valor">
                  {receivableData.map((entry, idx) => (
                    <Cell key={`cell-bar-receber-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartTab === 'A Pagar' && (
        <div className="space-y-6">
          {/* Gráfico de Pizza */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={payableData}
                  dataKey="valor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {payableData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v} contas`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="w-full h-80">
            <h3 className="text-lg font-semibold pt-4 mb-4 text-center">Comparativo por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payableData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v} contas`} />
                <Bar dataKey="valor">
                  {payableData.map((entry, idx) => (
                    <Cell key={`cell-bar-pagar-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartTab === 'Evolução' && (
        <div className="w-full h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Evolução Mensal - Contas a Receber vs Contas a Pagar</h3>
          {evolutionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`} />
                <Legend />
                <Line type="monotone" dataKey="aReceber" stroke="#3b82f6" strokeWidth={3} name="Contas a Receber" />
                <Line type="monotone" dataKey="aPagar" stroke="#ef4444" strokeWidth={3} name="Contas a Pagar" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-center">
                <p className="text-lg mb-2">Nenhum dado disponível</p>
                <p className="text-sm">Não há movimentações financeiras nos meses selecionados</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}