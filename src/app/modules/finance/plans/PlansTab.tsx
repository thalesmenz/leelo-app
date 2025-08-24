'use client';

import { useState, useEffect } from 'react';
import { CalendarBlank, Plus, Clock, CurrencyDollar, PencilSimple, Trash, MagnifyingGlass } from 'phosphor-react';
import { patientPlanService } from '../../../services/patientPlanService';
import { showToast } from '@/app/utils/toast';
import { Modal } from '../../../components/Modal';
import CreatePatientPlanModal from './CreatePatientPlanModal';
import EditPatientPlanModal from './EditPatientPlanModal';

interface PatientPlan {
  id: string;
  name: string;
  notes?: string;
  sessions: number;
  duration: number;
  price: number;
  status: 'ativo' | 'inativo';
  created_at: string;
  plan_type: 'recorrente' | 'pacote';
}

export default function PlansTab() {
  const [patientPlans, setPatientPlans] = useState<PatientPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientPlan, setSelectedPatientPlan] = useState<PatientPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadPatientPlans = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const res = await patientPlanService.getByUserId(userId);
        const data = Array.isArray(res.data) ? res.data : [];
        setPatientPlans(data);
      } else {
        setPatientPlans([]);
      }
    } catch (error) {
      setPatientPlans([]);
      showToast.error('Erro ao carregar planos de pacientes');
    } finally {
      setLoading(false);
    }
  };

  const searchPatientPlans = async () => {
    if (!searchTerm.trim()) {
      loadPatientPlans();
      return;
    }

    try {
      setSearching(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await patientPlanService.searchByName(userId, searchTerm.trim());
        const data = Array.isArray(response.data) ? response.data : [];
        setPatientPlans(data);
      } else {
        setPatientPlans([]);
      }
    } catch (error) {
      setPatientPlans([]);
      showToast.error('Erro ao buscar planos de pacientes');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadPatientPlans();
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (patientPlan: PatientPlan) => {
    setSelectedPatientPlan(patientPlan);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedPatientPlan(null);
    setIsEditModalOpen(false);
  };

  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const handleDeletePatientPlan = async (id: string) => {
    setDeletePlanId(id);
  };

  const confirmDeletePlan = async () => {
    if (!deletePlanId) return;

    try {
      await patientPlanService.deleteById(deletePlanId);
      showToast.success('Plano de paciente removido com sucesso!');
      setDeletePlanId(null);
      loadPatientPlans();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao remover plano de paciente');
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadPatientPlans();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedPatientPlan(null);
    setSearchTerm('');
    loadPatientPlans();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando planos de pacientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <CalendarBlank size={24} /> Planos dos Pacientes
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} /> Novo Plano
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
            placeholder="Buscar planos por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPatientPlans()}
            className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <button 
          onClick={searchPatientPlans}
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <MagnifyingGlass size={18} />
          {searching ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>

      {patientPlans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhum plano encontrado para a busca.' : 'Nenhum plano de paciente encontrado.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2 px-4 font-semibold">Plano</th>
                <th className="py-2 px-4 font-semibold">Sessões</th>
                <th className="py-2 px-4 font-semibold">Duração</th>
                <th className="py-2 px-4 font-semibold">Valor</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                <th className="py-2 px-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patientPlans.map((plan) => (
                <tr key={plan.id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-4 font-normal text-gray-800">
                    <div className="font-medium text-gray-800">{plan.name}</div>
                    <div className="text-gray-500 text-xs">{plan.notes}</div>
                  </td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    <Clock size={16} /> {plan.sessions} sessões
                  </td>
                  <td className="py-2 px-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {plan.duration}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-bold text-green-700">
                    <div className="flex flex-col items-start">
                      <span className="flex items-center gap-1">
                        <CurrencyDollar size={16} />
                        <span>R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </span>
                      <span className="text-xs text-gray-500 ml-6">
                        {plan.plan_type === 'recorrente' ? '/mês' : '/pacote'}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {plan.status === 'ativo' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Ativo
                      </span>
                    )}
                    {plan.status === 'inativo' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-500">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleOpenEditModal(plan)}
                    >
                      <PencilSimple size={12} /> Editar
                    </button>
                    <button 
                      className="px-3 py-1 border border-red-200 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-xs flex items-center gap-1"
                      onClick={() => handleDeletePatientPlan(plan.id)}
                    >
                      <Trash size={12} /> Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modais
      <CreatePatientPlanModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {selectedPatientPlan && (
        <EditPatientPlanModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          patientPlan={selectedPatientPlan}
        />
      )} */}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletePlanId}
        onClose={() => setDeletePlanId(null)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-4xl">⚠️</div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Tem certeza que deseja remover este plano?
            </p>
            <p className="text-sm text-gray-500">
              Esta ação não poderá ser desfeita.
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              onClick={() => setDeletePlanId(null)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium"
              onClick={confirmDeletePlan}
              type="button"
            >
              Remover
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 