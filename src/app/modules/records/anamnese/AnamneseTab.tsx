'use client';

import { useState, useEffect } from 'react';
import { Plus, MagnifyingGlass, FileText, User, Calendar, Clock, PencilSimple, Trash, Gear } from 'phosphor-react';
import { showToast } from '../../../utils/toast';
import { useAuth } from '../../../hooks/useAuth';
import { Modal } from '../../../components/Modal';
import AnamneseConfigModal from './AnamneseConfigModal';
import CreateAnamneseModal from './CreateAnamneseModal';
import ViewAnamneseModal from './ViewAnamneseModal';
import EditAnamneseModal from './EditAnamneseModal';
import { AnamneseConfirmDeleteModal } from './AnamneseConfirmDeleteModal';
import { anamneseAnswerService } from '../../../services/anamneseAnswerService';

interface Anamnese {
  id: string;
  patient_name: string;
  patient_cpf: string;
  created_at: string;
  status: 'pendente' | 'completa' | 'em_andamento';
  last_updated: string;
  answers_count?: number;
  answers?: any[];
}

export default function AnamneseTab() {
  const { user } = useAuth();
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'completa' | 'em_andamento'>('todos');
  
  // Modal states - only for opening/closing
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected anamnese IDs for modals
  const [selectedAnamneseId, setSelectedAnamneseId] = useState<string | null>(null);
  const [anamneseToDelete, setAnamneseToDelete] = useState<Anamnese | null>(null);

  // Load anamneses on component mount
  useEffect(() => {
    loadAnamneses();
  }, []);

  const loadAnamneses = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const response = await anamneseAnswerService.getByUserId(userId);
      
      const anamnesesData = Array.isArray(response) ? response : [response];
      
      // Mapear dados da API para o formato esperado
      const mappedAnamneses: Anamnese[] = anamnesesData.map((anamnese: any) => {
        return {
          id: anamnese.id,
          patient_name: anamnese.patient_name,
          patient_cpf: anamnese.patient_cpf,
          created_at: anamnese.created_at,
          status: anamnese.status || 'completa',
          last_updated: anamnese.last_updated,
          answers_count: anamnese.answers_count || 0,
          answers: anamnese.answers || []
        };
      });

      setAnamneses(mappedAnamneses);
    } catch (error) {
      showToast.error('Erro ao carregar anamneses');
      setAnamneses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAnamneses();
      return;
    }

    try {
      setSearching(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const response = await anamneseAnswerService.getByUserId(userId);
      const anamnesesData = Array.isArray(response) ? response : [response];
      
      // Filtrar por termo de busca
      const filteredData = anamnesesData.filter((anamnese: any) => 
        anamnese.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anamnese.patient_cpf.includes(searchTerm)
      );

      const mappedAnamneses: Anamnese[] = filteredData.map((anamnese: any) => ({
        id: anamnese.id,
        patient_name: anamnese.patient_name,
        patient_cpf: anamnese.patient_cpf,
        created_at: anamnese.created_at,
        status: anamnese.status || 'completa',
        last_updated: anamnese.last_updated,
        answers_count: anamnese.answers_count || 0,
        answers: anamnese.answers || []
      }));

      setAnamneses(mappedAnamneses);
    } catch (error) {
      showToast.error('Erro ao buscar anamneses');
    } finally {
      setSearching(false);
    }
  };

  // Modal open handlers - only set state and IDs
  const handleCreateAnamnese = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfigAnamnese = () => {
    setIsConfigModalOpen(true);
  };

  const handleViewAnamnese = (anamnese: Anamnese) => {
    setSelectedAnamneseId(anamnese.id);
    setIsViewModalOpen(true);
  };

  const handleEditAnamnese = (anamnese: Anamnese) => {
    setSelectedAnamneseId(anamnese.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteAnamnese = (anamnese: Anamnese) => {
    setAnamneseToDelete(anamnese);
    setIsDeleteModalOpen(true);
  };

  // Success callbacks for modals
  const handleCreateSuccess = () => {
    loadAnamneses(); // Reload the list
  };

  const handleEditSuccess = () => {
    loadAnamneses(); // Reload the list
  };

  const handleDeleteSuccess = () => {
    loadAnamneses(); // Reload the list
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pendente' },
      em_andamento: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Em Andamento' },
      completa: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completa' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredAnamneses = anamneses.filter(anamnese => {
    const matchesSearch = anamnese.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anamnese.patient_cpf.includes(searchTerm);
    const matchesStatus = filterStatus === 'todos' || anamnese.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-sm sm:text-base text-gray-600">Carregando anamneses...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-blue-600">
            <FileText size={20} className="sm:w-6 sm:h-6" /> Anamneses
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              onClick={handleConfigAnamnese}
            >
              <Gear size={18} /> Configurar Anamnese
            </button>
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 shadow transition-colors text-sm sm:text-base"
              onClick={handleCreateAnamnese}
            >
              <Plus size={18} /> Nova Anamnese
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${filterStatus === 'todos' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos ({anamneses.length})
          </button>
          <button
            onClick={() => setFilterStatus('pendente')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${filterStatus === 'pendente' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Pendentes ({anamneses.filter(a => a.status === 'pendente').length})
          </button>
          <button
            onClick={() => setFilterStatus('em_andamento')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${filterStatus === 'em_andamento' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Em Andamento ({anamneses.filter(a => a.status === 'em_andamento').length})
          </button>
          <button
            onClick={() => setFilterStatus('completa')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${filterStatus === 'completa' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Completas ({anamneses.filter(a => a.status === 'completa').length})
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
              placeholder="Buscar anamneses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full border border-gray-200 rounded px-10 pr-20 sm:pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            />
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
            >
              <MagnifyingGlass size={16} className="sm:hidden" />
              <span className="hidden sm:inline">{searching ? 'Buscando...' : 'Pesquisar'}</span>
            </button>
          </div>
        </div>

        {/* Lista de Anamneses */}
        {filteredAnamneses.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma anamnese encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'todos' 
                ? 'Tente ajustar os filtros ou termos de busca'
                : 'Comece criando sua primeira anamnese'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredAnamneses.map((anamnese) => (
              <div key={anamnese.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{anamnese.patient_name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">CPF: {anamnese.patient_cpf}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {getStatusBadge(anamnese.status)}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Criada em {formatDate(anamnese.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Atualizada em {formatDate(anamnese.last_updated)} às {formatTime(anamnese.last_updated)}
                      </span>
                      {anamnese.answers_count && (
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {anamnese.answers_count} resposta{anamnese.answers_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0 sm:pt-2">
                    <button
                      onClick={() => handleViewAnamnese(anamnese)}
                      className="flex-1 sm:flex-none px-3 py-2 sm:px-3 sm:py-1.5 border-2 border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:border-blue-600 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      title="Visualizar"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditAnamnese(anamnese)}
                      className="flex-1 sm:flex-none px-3 py-2 sm:px-3 sm:py-1.5 border-2 border-green-500 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:border-green-600 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAnamnese(anamnese)}
                      className="flex-1 sm:flex-none px-3 py-2 sm:px-3 sm:py-1.5 border-2 border-red-500 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:border-red-600 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      title="Excluir"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criar Anamnese */}
      <CreateAnamneseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal de Visualização */}
      {selectedAnamneseId && (
        <ViewAnamneseModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedAnamneseId(null);
          }}
          anamneseId={selectedAnamneseId}
        />
      )}

      {/* Modal de Edição */}
      {selectedAnamneseId && (
        <EditAnamneseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAnamneseId(null);
          }}
          onSuccess={handleEditSuccess}
          anamneseId={selectedAnamneseId}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <AnamneseConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAnamneseToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
        anamnese={anamneseToDelete}
      />

      {/* Modal de Configuração */}
      <AnamneseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </>
  );
}




