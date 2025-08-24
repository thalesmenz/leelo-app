'use client';

import { useEffect, useState } from 'react';
import { Users, Plus, PencilSimple, Trash, MagnifyingGlass } from 'phosphor-react';
import { subuserService } from '../../services/subuserService';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../hooks/useAuth';
import { ProtectedRoute } from '../../components';
import { 
  SubuserCreateModal, 
  SubuserEditModal, 
  SubuserConfirmDeleteModal 
} from '../../modules/subusers';
import { Subuser } from '../../types/subuser';

function SubusersPageContent() {
  const { userId } = useAuth();
  const [subusers, setSubusers] = useState<Subuser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubuser, setSelectedSubuser] = useState<Subuser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadSubusers = async () => {
    try {
      setLoading(true);
      if (userId) {
        const response = await subuserService.getByUserId(userId);
        // A API retorna { success: true, data: [...] }
        const subusersData = response.success ? response.data : [];
        setSubusers(Array.isArray(subusersData) ? subusersData : [subusersData]);
      } else {
        setSubusers([]);
      }
    } catch (error) {
      setSubusers([]);
      showToast.error('Erro ao carregar fisioterapeutas');
    } finally {
      setLoading(false);
    }
  };

  const searchSubusers = async () => {
    if (!searchTerm.trim()) {
      loadSubusers();
      return;
    }

    try {
      setSearching(true);
      if (userId) {
        const response = await subuserService.getByUserId(userId);
        // A API retorna { success: true, data: [...] }
        const subusersData = response.success ? response.data : [];
        const allSubusers = Array.isArray(subusersData) ? subusersData : [subusersData];
        const filtered = allSubusers.filter((subuser: Subuser) => 
          subuser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subuser.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSubusers(filtered);
      } else {
        setSubusers([]);
      }
    } catch (error) {
      setSubusers([]);
      showToast.error('Erro ao buscar fisioterapeutas');
    } finally {
      setSearching(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadSubusers();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedSubuser(null);
    loadSubusers();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedSubuser(null);
    loadSubusers();
  };

  const handleEditSubuser = (subuser: Subuser) => {
    setSelectedSubuser(subuser);
    setIsEditModalOpen(true);
  };

  const handleDeleteSubuser = (subuser: Subuser) => {
    setSelectedSubuser(subuser);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (userId) {
      loadSubusers();
    }
  }, [userId]);

  const filteredSubusers = subusers.filter(subuser =>
    subuser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subuser.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-blue-600">
                <Users size={32} weight="fill" />
              </span>
              Fisioterapeutas
            </h1>
            <p className="text-gray-600 text-lg">Gerencie os fisioterapeutas da sua clínica</p>
          </div>
          
          <button
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} weight="bold" />
            Novo Fisioterapeuta
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MagnifyingGlass size={20} />
            </span>
            <input
              type="text"
              placeholder="Buscar fisioterapeutas por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSubusers()}
              className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white"
            />
          </div>
          
          <button 
            onClick={searchSubusers}
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <MagnifyingGlass size={20} weight="bold" />
            {searching ? 'Buscando...' : 'Pesquisar'}
          </button>
        </div>

        {/* Lista de Subusers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Carregando fisioterapeutas...
              </div>
            </div>
          ) : filteredSubusers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-6 flex justify-center">
                <Users size={64} weight="light" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum fisioterapeuta encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece adicionando o primeiro fisioterapeuta da sua clínica.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus size={20} weight="bold" />
                  Adicionar Primeiro Fisioterapeuta
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Nome</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Data de Criação</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubusers.map((subuser) => (
                    <tr key={subuser.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{subuser.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-600">{subuser.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-500">
                          {new Date(subuser.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => handleEditSubuser(subuser)}
                          >
                            <PencilSimple size={16} weight="bold" />
                            Editar
                          </button>
                          
                          <button
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => handleDeleteSubuser(subuser)}
                          >
                            <Trash size={16} weight="bold" />
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modais */}
        <SubuserCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        <SubuserEditModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedSubuser(null); }}
          onSuccess={handleEditSuccess}
          subuser={selectedSubuser}
        />

        <SubuserConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedSubuser(null); }}
          onSuccess={handleDeleteSuccess}
          subuser={selectedSubuser}
        />
      </div>
    </div>
  );
}

export default function SubusersPage() {
  return (
    <ProtectedRoute requiredRole="main_user">
      <SubusersPageContent />
    </ProtectedRoute>
  );
} 