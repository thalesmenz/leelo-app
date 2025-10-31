'use client';

import { useState, useEffect } from 'react';
import { CalendarBlank, Plus, CurrencyDollar, Trash, PencilSimple, CheckCircle, Clock, Warning, MagnifyingGlass, User } from 'phosphor-react';
import { accountsPayableService } from '../../../services/accountsPayableService';
import { subuserService } from '../../../services/subuserService';
import { useFinance } from '@/app/contexts/FinanceContext';
import { useAuth } from '@/app/hooks/useAuth';
import { showToast } from '@/app/utils/toast';
import CreatePayableModal from './CreatePayableModal';
import EditPayableModal from './EditPayableModal';

interface Payable {
  id: string;
  name: string;
  description: string;
  category?: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pendente' | 'pago';
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

interface PayablesTabProps {
  onRefresh: () => void;
}

export default function PayablesTab({ onRefresh }: PayablesTabProps) {
  const { userId } = useAuth();
  const { 
    isConsolidatedView, 
    selectedUserFilter, 
    selectedSubuserId,
    consolidatedData,
    selectedMonth,
    selectedYear,
    refreshConsolidatedData
  } = useFinance();
  
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadPayables = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setPayables([]);
        return;
      }

      let response;
      
      if (isConsolidatedView) {
        if (selectedUserFilter === 'all') {
          // Usar dados consolidados se disponíveis
          if (consolidatedData?.accounts_payable && consolidatedData.accounts_payable.length > 0) {
            setPayables(consolidatedData.accounts_payable);
            return;
          } else {
            // Se não há dados consolidados, buscar dados individuais como fallback
            response = await accountsPayableService.getByUserId(userId);
          }
        } else if (selectedUserFilter === 'main') {
          // Buscar apenas dados do usuário principal
          response = await accountsPayableService.getByUserId(userId);
        } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
          // Buscar dados de um subusuário específico
          response = await subuserService.getSubuserAccountsPayable(selectedSubuserId);
        } else {
          setPayables([]);
          return;
        }
      } else {
        response = await accountsPayableService.getByUserId(userId);
      }

      if (response?.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setPayables(data);
      } else if (response?.data) {
        // Caso onde o service retorna { data: [...] } diretamente
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setPayables(data);
      } else if (Array.isArray(response)) {
        // Caso onde o service retorna o array diretamente
        setPayables(response);
      } else {
        setPayables([]);
      }
    } catch (error) {
      setPayables([]);
      showToast.error('Erro ao carregar contas a pagar');
    } finally {
      setLoading(false);
    }
  };

  const searchPayables = async () => {
    if (!searchTerm.trim()) {
      loadPayables();
      return;
    }

    try {
      setSearching(true);
      
      if (!userId) {
        setPayables([]);
        return;
      }

      let response;
      
      if (isConsolidatedView && selectedUserFilter === 'subuser' && selectedSubuserId) {
        // Buscar em contas a pagar de subusuário específico
        const allPayables = await subuserService.getSubuserAccountsPayable(selectedSubuserId);
        if (allPayables.success) {
          const filtered = allPayables.data.filter((p: Payable) => 
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setPayables(filtered);
          return;
        }
      } else {
        // Busca normal
        response = await accountsPayableService.searchByName(userId, searchTerm.trim());
      }

      if (response?.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setPayables(data);
      } else if (response?.data) {
        // Caso onde o service retorna { data: [...] } diretamente
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setPayables(data);
      } else if (Array.isArray(response)) {
        // Caso onde o service retorna o array diretamente
        setPayables(response);
      } else {
        setPayables([]);
      }
    } catch (error) {
      setPayables([]);
      showToast.error('Erro ao buscar contas a pagar');
    } finally {
      setSearching(false);
    }
  };

  const filterPayablesByMonth = (payables: Payable[]) => {
    if (!selectedMonth || !selectedYear) return payables;
    
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0);
    
    return payables.filter(p => {
      const dueDate = new Date(p.due_date);
      return dueDate >= startOfMonth && dueDate <= endOfMonth;
    });
  };

  const getFilteredPayables = () => {
    let filtered = payables;
    
    // Aplicar filtro de mês/ano
    if (selectedMonth && selectedYear) {
      filtered = filterPayablesByMonth(filtered);
    }
    
    // Aplicar filtro de status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(payable => payable.status === statusFilter);
    }
    
    return filtered;
  };

  // Recarrega contas a pagar quando mudam os filtros
  useEffect(() => { 
    loadPayables(); 
  }, [isConsolidatedView, selectedUserFilter, selectedSubuserId, consolidatedData, selectedMonth, selectedYear]);

  // Carrega dados iniciais quando userId muda ou quando não está em visão consolidada
  useEffect(() => {
    if (userId && !isConsolidatedView) {
      loadPayables();
    }
  }, [userId, isConsolidatedView]);

  // Carrega dados iniciais na visão consolidada quando userId ou consolidatedData mudam
  useEffect(() => {
    if (userId && isConsolidatedView && consolidatedData) {
      loadPayables();
    }
  }, [userId, isConsolidatedView, consolidatedData]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (payable: Payable) => {
    setSelectedPayable(payable);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedPayable(null);
    setIsEditModalOpen(false);
  };

  const handleDeletePayable = async (payable: Payable) => {
    try {
      await accountsPayableService.deleteById(payable.id);
      showToast.success('Conta a pagar removida com sucesso!');
      loadPayables();
      onRefresh();
      // Recarregar dados consolidados se estiver em visão consolidada
      if (isConsolidatedView) {
        await refreshConsolidatedData();
      }
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao remover conta a pagar');
    }
  };

  const handleMarkAsPaid = async (payable: Payable) => {
    try {
      const response = await accountsPayableService.markAsPaid(payable.id);
      // Exibir a mensagem específica do backend que inclui informação sobre a transação
      showToast.success(response.message || 'Conta a pagar marcada como paga!');
      loadPayables();
      onRefresh();
      // Recarregar dados consolidados se estiver em visão consolidada
      if (isConsolidatedView) {
        await refreshConsolidatedData();
      }
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao marcar como paga');
    }
  };

  const handleMarkAsPending = async (payable: Payable) => {
    try {
      const response = await accountsPayableService.updateById(payable.id, {
        status: 'pendente',
        payment_date: undefined
      });
      // Exibir a mensagem específica do backend que inclui informação sobre a transação
      showToast.success(response.message || 'Conta a pagar marcada como pendente!');
      loadPayables();
      onRefresh();
      // Recarregar dados consolidados se estiver em visão consolidada
      if (isConsolidatedView) {
        await refreshConsolidatedData();
      }
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao marcar como pendente');
    }
  };

  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadPayables();
    onRefresh();
    // Recarregar dados consolidados se estiver em visão consolidada
    if (isConsolidatedView) {
      await refreshConsolidatedData();
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    setSelectedPayable(null);
    setSearchTerm('');
    loadPayables();
    onRefresh();
    // Recarregar dados consolidados se estiver em visão consolidada
    if (isConsolidatedView) {
      await refreshConsolidatedData();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (payable: Payable) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    
    switch (payable.status) {
      case 'pago':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700`}>
            <CheckCircle size={12} />
            Pago
          </span>
        );
      default:
        const daysUntilDue = getDaysUntilDue(payable.due_date);
        if (daysUntilDue <= 3 && daysUntilDue >= 0) {
          return (
            <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
              <Clock size={12} />
              Vence em {daysUntilDue} dia{daysUntilDue !== 1 ? 's' : ''}
            </span>
          );
        }
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700`}>
            <Clock size={12} />
            Pendente
          </span>
        );
    }
  };

  const getStatusCounts = () => {
    const counts = {
      todos: payables.length,
      pendente: payables.filter(p => p.status === 'pendente').length,
      pago: payables.filter(p => p.status === 'pago').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando contas a pagar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <CurrencyDollar size={24} /> Contas a Pagar
        </div>
        <button 
          className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} /> Nova Conta
        </button>
      </div>

      {/* Filtros de Status */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'todos'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos ({getStatusCounts().todos})
        </button>
        <button
          onClick={() => setStatusFilter('pendente')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'pendente'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pendentes ({getStatusCounts().pendente})
        </button>
        <button
          onClick={() => setStatusFilter('pago')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'pago'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pagos ({getStatusCounts().pago})
        </button>
      </div>
      
      {/* Barra de Pesquisa */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlass size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar contas a pagar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPayables()}
            className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <button 
          onClick={searchPayables}
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <MagnifyingGlass size={18} />
          {searching ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>
      
      {getFilteredPayables().length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'Nenhuma conta a pagar encontrada para a busca.'
            : statusFilter === 'todos' 
            ? 'Nenhuma conta a pagar encontrada.'
            : `Nenhuma conta a pagar com status "${statusFilter}" encontrada.`}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2 px-4 font-semibold">Nome</th>
                <th className="py-2 px-4 font-semibold">Descrição</th>
                <th className="py-2 px-4 font-semibold">Valor</th>
                <th className="py-2 px-4 font-semibold">Vencimento</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                {isConsolidatedView && <th className="py-2 px-4 font-semibold">Usuário</th>}
                <th className="py-2 px-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPayables().map((payable) => (
                <tr key={payable.id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{payable.name}</td>
                  <td className="py-2 px-4">{payable.description}</td>
                  <td className="py-2 px-4 font-bold text-red-700">R$ {Number(payable.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className={`py-2 px-4 ${isOverdue(payable.due_date) ? 'text-red-600 font-semibold' : ''}`}>
                    {formatDate(payable.due_date)}
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(payable)}
                  </td>
                  {isConsolidatedView && (
                    <td className="py-2 px-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {payable.user?.name || 'Usuário não identificado'}
                      </span>
                    </td>
                  )}
                  <td className="py-2 px-4 flex gap-2">
                    {payable.status === 'pendente' ? (
                      <button 
                        className="px-3 py-1 border border-green-200 bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium text-xs flex items-center gap-1"
                        onClick={() => handleMarkAsPaid(payable)}
                        title="Marcar como pago e criar transação"
                      >
                        <CheckCircle size={12} /> Marcar como Pago
                      </button>
                    ) : (
                      <button 
                        className="px-3 py-1 border border-yellow-200 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 font-medium text-xs flex items-center gap-1"
                        onClick={() => handleMarkAsPending(payable)}
                        title="Marcar como pendente e remover transação"
                      >
                        <Clock size={12} /> Marcar como Pendente
                      </button>
                    )}
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleOpenEditModal(payable)}
                      title="Editar conta a pagar"
                    >
                      <PencilSimple size={12} /> Editar
                    </button>
                    <button 
                      className="px-3 py-1 border border-red-200 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleDeletePayable(payable)}
                      title="Excluir conta a pagar"
                    >
                      <Trash size={12} /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modais */}
      <CreatePayableModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {selectedPayable && (
        <EditPayableModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          payable={selectedPayable}
        />
      )}
    </div>
  );
} 