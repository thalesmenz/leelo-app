'use client';

import { useState, useEffect } from 'react';
import { CalendarBlank, Plus, CurrencyDollar, Trash, PencilSimple, CheckCircle, Clock, Warning, MagnifyingGlass, User } from 'phosphor-react';
import { accountsReceivableService } from '../../../services/accountsReceivableService';
import { subuserService } from '../../../services/subuserService';
import { useFinance } from '@/app/contexts/FinanceContext';
import { useAuth } from '@/app/hooks/useAuth';
import { showToast } from '@/app/utils/toast';
import CreateReceivableModal from './CreateReceivableModal';
import EditReceivableModal from './EditReceivableModal';

interface Receivable {
  id: string;
  name: string;
  description: string;
  category?: string;
  amount: number;
  due_date: string;
  receive_date?: string;
  status: 'pendente' | 'recebido';
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function ReceivablesTab() {
  const { userId } = useAuth();
  const { 
    isConsolidatedView, 
    selectedUserFilter, 
    selectedSubuserId,
    consolidatedData 
  } = useFinance();
  
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadReceivables = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setReceivables([]);
        return;
      }

      let response;
      
      if (isConsolidatedView) {
        if (selectedUserFilter === 'all') {
          // Usar dados consolidados se disponíveis
          if (consolidatedData?.accounts_receivable && consolidatedData.accounts_receivable.length > 0) {
            setReceivables(consolidatedData.accounts_receivable);
            return;
          } else {
            // Se não há dados consolidados, buscar dados individuais como fallback
            response = await accountsReceivableService.getByUserId(userId);
          }
        } else if (selectedUserFilter === 'main') {
          // Buscar apenas dados do usuário principal
          response = await accountsReceivableService.getByUserId(userId);
        } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
          // Buscar dados de um subusuário específico
          response = await subuserService.getSubuserAccountsReceivable(selectedSubuserId);
        } else {
          setReceivables([]);
          return;
        }
      } else {
        // Visão individual normal
        response = await accountsReceivableService.getByUserId(userId);
      }

      if (response?.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setReceivables(data);
      } else if (response?.data) {
        // Caso onde o service retorna { data: [...] } diretamente
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setReceivables(data);
      } else if (Array.isArray(response)) {
        // Caso onde o service retorna o array diretamente
        setReceivables(response);
      } else {
        setReceivables([]);
      }
    } catch (error) {
      setReceivables([]);
      showToast.error('Erro ao carregar contas a receber');
    } finally {
      setLoading(false);
    }
  };

  const searchReceivables = async () => {
    if (!searchTerm.trim()) {
      loadReceivables();
      return;
    }

    try {
      setSearching(true);
      
      if (!userId) {
        setReceivables([]);
        return;
      }

      let response;
      
      if (isConsolidatedView && selectedUserFilter === 'subuser' && selectedSubuserId) {
        // Buscar em contas a receber de subusuário específico
        const allReceivables = await subuserService.getSubuserAccountsReceivable(selectedSubuserId);
        if (allReceivables.success) {
          const filtered = allReceivables.data.filter((r: Receivable) => 
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setReceivables(filtered);
          return;
        }
      } else {
        // Busca normal
        response = await accountsReceivableService.searchByName(userId, searchTerm.trim());
      }

      if (response?.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setReceivables(data);
      } else if (response?.data) {
        // Caso onde o service retorna { data: [...] } diretamente
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setReceivables(data);
      } else if (Array.isArray(response)) {
        // Caso onde o service retorna o array diretamente
        setReceivables(response);
      } else {
        setReceivables([]);
      }
    } catch (error) {
      setReceivables([]);
      showToast.error('Erro ao buscar contas a receber');
    } finally {
      setSearching(false);
    }
  };

  const getFilteredReceivables = () => {
    if (statusFilter === 'todos') {
      return receivables;
    }
    const filtered = receivables.filter(receivable => receivable.status === statusFilter);
    return filtered;
  };

  // Recarrega contas a receber quando mudam os filtros
  useEffect(() => { 
    loadReceivables(); 
  }, [isConsolidatedView, selectedUserFilter, selectedSubuserId, consolidatedData]);

  // Carrega dados iniciais quando userId muda ou quando não está em visão consolidada
  useEffect(() => {
    if (userId && !isConsolidatedView) {
      loadReceivables();
    }
  }, [userId, isConsolidatedView]);

  // Carrega dados iniciais na visão consolidada quando userId ou consolidatedData mudam
  useEffect(() => {
    if (userId && isConsolidatedView && consolidatedData) {
      loadReceivables();
    }
  }, [userId, isConsolidatedView, consolidatedData]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (receivable: Receivable) => {
    setSelectedReceivable(receivable);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedReceivable(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteReceivable = async (receivable: Receivable) => {
    try {
      await accountsReceivableService.deleteById(receivable.id);
      showToast.success('Conta a receber removida com sucesso!');
      loadReceivables();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao remover conta a receber');
    }
  };

  const handleMarkAsReceived = async (receivable: Receivable) => {
    try {
      const response = await accountsReceivableService.markAsReceived(receivable.id);
      // Exibir a mensagem específica do backend que inclui informação sobre a transação
      showToast.success(response.message || 'Conta a receber marcada como recebida!');
      loadReceivables();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao marcar como recebido');
    }
  };

  const handleMarkAsPending = async (receivable: Receivable) => {
    try {
      const response = await accountsReceivableService.updateById(receivable.id, {
        status: 'pendente',
        receive_date: null
      });
      // Exibir a mensagem específica do backend que inclui informação sobre a transação
      showToast.success(response.message || 'Conta a receber marcada como pendente!');
      loadReceivables();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao marcar como pendente');
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadReceivables();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedReceivable(null);
    setSearchTerm('');
    loadReceivables();
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

  const getStatusBadge = (receivable: Receivable) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    
    switch (receivable.status) {
      case 'recebido':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700`}>
            <CheckCircle size={12} />
            Recebido
          </span>
        );
      default:
        const daysUntilDue = getDaysUntilDue(receivable.due_date);
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
      todos: receivables.length,
      pendente: receivables.filter(r => r.status === 'pendente').length,
      recebido: receivables.filter(r => r.status === 'recebido').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando contas a receber...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <CurrencyDollar size={24} /> Contas a Receber
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
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
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
          onClick={() => setStatusFilter('recebido')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'recebido'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Recebidos ({getStatusCounts().recebido})
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
            placeholder="Buscar contas a receber por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchReceivables()}
            className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <button 
          onClick={searchReceivables}
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <MagnifyingGlass size={18} />
          {searching ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>

      {getFilteredReceivables().length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm 
            ? 'Nenhuma conta a receber encontrada para a busca.'
            : statusFilter === 'todos'
            ? 'Nenhuma conta a receber encontrada.'
            : `Nenhuma conta a receber com status "${statusFilter}" encontrada.`}
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
              {getFilteredReceivables().map((receivable) => (
                <tr key={receivable.id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{receivable.name}</td>
                  <td className="py-2 px-4">{receivable.description}</td>
                  <td className="py-2 px-4 font-bold text-green-700">R$ {Number(receivable.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className={`py-2 px-4 ${isOverdue(receivable.due_date) ? 'text-red-600 font-semibold' : ''}`}>
                    {formatDate(receivable.due_date)}
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(receivable)}
                  </td>
                  {isConsolidatedView && (
                    <td className="py-2 px-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {receivable.user?.name || 'Usuário não identificado'}
                      </span>
                    </td>
                  )}
                  <td className="py-2 px-4 flex gap-2">
                    {receivable.status === 'pendente' ? (
                      <button
                        className="px-3 py-1 border border-green-200 bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium text-xs flex items-center gap-1"
                        onClick={() => handleMarkAsReceived(receivable)}
                        title="Marcar como recebido e criar transação"
                      >
                        <CheckCircle size={12} /> Marcar como Recebido
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 border border-yellow-200 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 font-medium text-xs flex items-center gap-1"
                        onClick={() => handleMarkAsPending(receivable)}
                        title="Marcar como pendente e remover transação"
                      >
                        <Clock size={12} /> Marcar como Pendente
                      </button>
                    )}
                    <button
                      className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleOpenEditModal(receivable)}
                      title="Editar conta a receber"
                    >
                      <PencilSimple size={12} /> Editar
                    </button>
                    <button
                      className="px-3 py-1 border border-red-200 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleDeleteReceivable(receivable)}
                      title="Excluir conta a receber"
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
      <CreateReceivableModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {selectedReceivable && (
        <EditReceivableModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          receivable={selectedReceivable}
        />
      )}
    </div>
  );
} 