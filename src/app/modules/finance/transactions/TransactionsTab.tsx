'use client';

import { useEffect, useState } from 'react';
import { Plus, ArrowDownRight, ArrowUpRight, Trash, PencilSimple, MagnifyingGlass, User } from 'phosphor-react';
import { transactionService } from '@/app/services/transactionService';
import { subuserService } from '@/app/services/subuserService';
import { useFinance } from '@/app/contexts/FinanceContext';
import { useAuth } from '@/app/hooks/useAuth';
import { showToast } from '@/app/utils/toast';
import CreateTransactionModal from './CreateTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import { TransactionConfirmDeleteModal } from './TransactionConfirmDeleteModal';

interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'entrada' | 'saida';
  origin: 'agendamento' | 'conta_a_receber' | 'conta_a_pagar' | 'manual';
  origin_id?: string | null;
  description?: string;
  amount: number;
  status?: 'pago' | 'pendente';
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

interface TransactionsTabProps {
  onRefresh?: () => void;
}

export default function TransactionsTab({ onRefresh }: TransactionsTabProps) {
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
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setTransactions([]);
        return;
      }

      let response;
      
      if (isConsolidatedView) {
        if (selectedUserFilter === 'all') {
          // Usar dados consolidados
          if (consolidatedData?.transactions) {
            const filtered = filterTransactionsByMonth(consolidatedData.transactions);
            setTransactions(filtered);
            return;
          } else {
            // Se não há dados consolidados, buscar dados individuais
            response = await transactionService.getAll({ user_id: userId });
          }
        } else if (selectedUserFilter === 'main') {
          // Buscar apenas dados do usuário principal
          response = await transactionService.getAll({ user_id: userId });
        } else if (selectedUserFilter === 'subuser' && selectedSubuserId) {
          // Buscar dados de um subusuário específico
          response = await subuserService.getSubuserTransactions(selectedSubuserId);
        } else {
          setTransactions([]);
          return;
        }
      } else {
        response = await transactionService.getAll({ user_id: userId });
      }

      if (response?.success && response.data) {
        const filtered = filterTransactionsByMonth(response.data);
        setTransactions(filtered);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setTransactions([]);
      showToast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactionsByMonth = (transactions: Transaction[]) => {
    if (!selectedMonth || !selectedYear) return transactions;
    
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });
  };

  const searchTransactions = async () => {
    if (!searchTerm.trim()) {
      loadTransactions();
      return;
    }

    try {
      setSearching(true);
      
      if (!userId) {
        setTransactions([]);
        return;
      }

      let response;
      
      if (isConsolidatedView && selectedUserFilter === 'subuser' && selectedSubuserId) {
        // Buscar em transações de subusuário específico
        const allTransactions = await subuserService.getSubuserTransactions(selectedSubuserId);
        if (allTransactions.success) {
          let filtered = allTransactions.data.filter((t: Transaction) => 
            t.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          // Aplicar filtro de mês
          filtered = filterTransactionsByMonth(filtered);
          setTransactions(filtered);
          return;
        }
      } else {
        // Busca normal
        response = await transactionService.searchByDescription(userId, searchTerm.trim());
      }

      if (response?.success && response.data) {
        const filtered = filterTransactionsByMonth(response.data);
        setTransactions(filtered);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      setTransactions([]);
      showToast.error('Erro ao buscar transações');
    } finally {
      setSearching(false);
    }
  };

  const getFilteredTransactions = () => {
    if (typeFilter === 'todos') return transactions;
    return transactions.filter(t => t.type === typeFilter);
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleOpenEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedTransaction(null);
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setSelectedTransaction(null);
    setIsDeleteModalOpen(false);
  };

  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadTransactions();
    if (onRefresh) onRefresh();
    // Recarregar dados consolidados se estiver em visão consolidada
    if (isConsolidatedView) {
      await refreshConsolidatedData();
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    setSearchTerm('');
    loadTransactions();
    if (onRefresh) onRefresh();
    // Recarregar dados consolidados se estiver em visão consolidada
    if (isConsolidatedView) {
      await refreshConsolidatedData();
    }
  };

  const handleDeleteSuccess = async () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
    setSearchTerm('');
    loadTransactions();
    if (onRefresh) onRefresh();
    // Recarregar dados consolidados se estiver em visão consolidada
    if (isConsolidatedView) {
      await refreshConsolidatedData();
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatOrigin = (origin: string) => {
    return origin
      .replace('conta_a_receber', 'Conta a Receber')
      .replace('conta_a_pagar', 'Conta a Pagar')
      .replace('agendamento', 'Agendamento')
      .replace('manual', 'Manual');
  };

  // Recarrega transações quando mudam os filtros
  useEffect(() => { 
    if (userId) {
      loadTransactions(); 
    }
  }, [userId, isConsolidatedView, selectedUserFilter, selectedSubuserId, selectedMonth, selectedYear]);

  // Recarrega quando dados consolidados mudam
  useEffect(() => {
    if (isConsolidatedView && selectedUserFilter === 'all' && consolidatedData?.transactions) {
      const filtered = filterTransactionsByMonth(consolidatedData.transactions);
      setTransactions(filtered);
    }
  }, [consolidatedData, isConsolidatedView, selectedUserFilter, selectedMonth, selectedYear]);

  // Carrega transações iniciais quando o componente monta
  useEffect(() => {
    if (userId && !isConsolidatedView) {
      loadTransactions();
    }
  }, [userId]);

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex-1">
          <button
            onClick={() => setTypeFilter('todos')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${typeFilter === 'todos' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('entrada')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${typeFilter === 'entrada' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Entradas ({transactions.filter(t => t.type === 'entrada').length})
          </button>
          <button
            onClick={() => setTypeFilter('saida')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${typeFilter === 'saida' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Saídas ({transactions.filter(t => t.type === 'saida').length})
          </button>
        </div>
        <button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 shadow transition-colors text-sm sm:text-base shrink-0"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} /> Nova Transação
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlass size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchTransactions()}
            className="w-full border border-gray-200 rounded px-10 pr-20 sm:pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
          <button 
            onClick={searchTransactions}
            disabled={searching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
          >
            <MagnifyingGlass size={16} className="sm:hidden" />
            <span className="hidden sm:inline">{searching ? 'Buscando...' : 'Pesquisar'}</span>
          </button>
        </div>
      </div>

      {/* Cards de transações */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Carregando transações...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhuma transação encontrada para a busca.' : 'Nenhuma transação encontrada.'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 sm:px-6 py-4 shadow-sm hover:shadow-md transition-all gap-3 sm:gap-4 ${transaction.type === 'entrada' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Ícone */}
                <div className={`rounded-full p-2 shrink-0 ${transaction.type === 'entrada' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {transaction.type === 'entrada' ? <ArrowUpRight size={20} className="sm:w-[22px] sm:h-[22px]" /> : <ArrowDownRight size={20} className="sm:w-[22px] sm:h-[22px]" />}
                </div>
                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm sm:text-base truncate mb-1">
                    {transaction.description || '-'}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-1.5 sm:gap-2 items-center">
                    <span>{formatOrigin(transaction.origin)}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    {/* Mostra usuário se for visão consolidada */}
                    {isConsolidatedView && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          <span className="truncate">{transaction.user?.name || 'Usuário não identificado'}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                {/* Valor e status */}
                <div className="flex flex-col items-start sm:items-end min-w-0 flex-1 sm:flex-none">
                  <span className={`font-bold text-base sm:text-lg ${transaction.type === 'entrada' ? 'text-green-700' : 'text-red-700'}`}>
                    {transaction.type === 'entrada' ? '+ ' : '- '}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {transaction.status && (
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mt-1 ${transaction.status === 'pago' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>
                      {transaction.status === 'pago' ? 'pago' : 'pendente'}
                    </span>
                  )}
                </div>
                {/* Botões de ação */}
                <div className="flex gap-2 shrink-0">
                  <button
                    className="px-3 sm:px-4 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:border-blue-600 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors shadow-sm"
                    onClick={() => handleOpenEditModal(transaction)}
                  >
                    <PencilSimple size={14} /> <span className="sm:hidden">Editar</span>
                  </button>
                  <button
                    className="px-3 sm:px-4 py-2 border-2 border-red-500 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:border-red-600 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors shadow-sm"
                    onClick={() => handleOpenDeleteModal(transaction)}
                  >
                    <Trash size={14} /> <span className="sm:hidden">Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          transaction={selectedTransaction}
        />
      )}
      <TransactionConfirmDeleteModal
        open={isDeleteModalOpen}
        transaction={selectedTransaction}
        onClose={handleCloseDeleteModal}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
} 