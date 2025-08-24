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

export default function TransactionsTab() {
  const { userId } = useAuth();
  const { 
    isConsolidatedView, 
    selectedUserFilter, 
    selectedSubuserId,
    consolidatedData 
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
            setTransactions(consolidatedData.transactions);
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
        // Visão individual normal
        response = await transactionService.getAll({ user_id: userId });
      }

      if (response?.success && response.data) {
        setTransactions(response.data);
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
          const filtered = allTransactions.data.filter((t: Transaction) => 
            t.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setTransactions(filtered);
          return;
        }
      } else {
        // Busca normal
        response = await transactionService.searchByDescription(userId, searchTerm.trim());
      }

      if (response?.success && response.data) {
        setTransactions(response.data);
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

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadTransactions();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    setSearchTerm('');
    loadTransactions();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
    setSearchTerm('');
    loadTransactions();
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
  }, [userId, isConsolidatedView, selectedUserFilter, selectedSubuserId]);

  // Recarrega quando dados consolidados mudam
  useEffect(() => {
    if (isConsolidatedView && selectedUserFilter === 'all' && consolidatedData?.transactions) {
      setTransactions(consolidatedData.transactions);
    }
  }, [consolidatedData, isConsolidatedView, selectedUserFilter]);

  // Carrega transações iniciais quando o componente monta
  useEffect(() => {
    if (userId && !isConsolidatedView) {
      loadTransactions();
    }
  }, [userId]);

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setTypeFilter('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'todos' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos ({transactions.length})
        </button>
        <button
          onClick={() => setTypeFilter('entrada')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'entrada' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Entradas ({transactions.filter(t => t.type === 'entrada').length})
        </button>
        <button
          onClick={() => setTypeFilter('saida')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'saida' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Saídas ({transactions.filter(t => t.type === 'saida').length})
        </button>
        <button
          className="ml-auto bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} /> Nova Transação
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
            placeholder="Buscar transações por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchTransactions()}
            className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <button 
          onClick={searchTransactions}
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <MagnifyingGlass size={18} />
          {searching ? 'Buscando...' : 'Pesquisar'}
        </button>
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
              className={`flex items-center justify-between rounded-xl border px-6 py-4 shadow-sm hover:shadow-md transition-all ${transaction.type === 'entrada' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}
            >
              {/* Ícone */}
              <div className={`rounded-full p-2 mr-4 ${transaction.type === 'entrada' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {transaction.type === 'entrada' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
              </div>
              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-base truncate">
                  {transaction.description || '-'}
                </div>
                <div className="text-xs text-gray-500 flex gap-2 items-center truncate">
                  <span>{formatOrigin(transaction.origin)}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                  {/* Mostra usuário se for visão consolidada */}
                  {isConsolidatedView && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {transaction.user?.name || 'Usuário não identificado'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* Valor e status */}
              <div className="flex flex-col items-end min-w-[120px] ml-4">
                <span className={`font-bold text-lg ${transaction.type === 'entrada' ? 'text-green-700' : 'text-red-700'}`}>
                  {transaction.type === 'entrada' ? '+ ' : '- '}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                {transaction.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${transaction.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {transaction.status === 'pago' ? 'pago' : 'pendente'}
                      </span>
                    )}
              </div>
              {/* Botões de ação */}
              <div className="flex gap-2 ml-4">
                <button
                  className="px-4 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:border-blue-600 font-semibold text-sm flex items-center gap-1 transition-colors shadow-sm"
                  onClick={() => handleOpenEditModal(transaction)}
                >
                  <PencilSimple size={14} /> Editar
                </button>
                <button
                  className="px-4 py-2 border-2 border-red-500 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:border-red-600 font-semibold text-sm flex items-center gap-1 transition-colors shadow-sm"
                  onClick={() => handleOpenDeleteModal(transaction)}
                >
                  <Trash size={14} /> Remover
                </button>
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