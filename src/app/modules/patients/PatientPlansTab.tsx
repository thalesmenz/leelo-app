'use client';

import { useState, useEffect } from 'react';
import { CalendarBlank, Plus, Clock, CurrencyDollar, PencilSimple, Trash } from 'phosphor-react';
import { patientPlanService } from '../../services/patientPlanService';
import { showToast } from '@/app/utils/toast';
import { Modal } from '@/app/components/Modal';
import CreatePatientPlanModal from '../finance/plans/CreatePatientPlanModal';
import EditPatientPlanModal from '../finance/plans/EditPatientPlanModal';

interface PatientPlan {
  id: string;
  name: string;
  plan_type: 'recorrente' | 'sessoes';
  sessions_monthly?: number;
  sessions_max?: number;
  price: number;
  notes?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
}

export default function PatientPlansTab() {
  const [patientPlans, setPatientPlans] = useState<PatientPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientPlan, setSelectedPatientPlan] = useState<PatientPlan | null>(null);

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

      {patientPlans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum plano de paciente encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2 px-4 font-semibold">Plano</th>
                <th className="py-2 px-4 font-semibold">Tipo</th>
                <th className="py-2 px-4 font-semibold">Sessões</th>
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
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      plan.plan_type === 'recorrente' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {plan.plan_type === 'recorrente' ? 'Recorrente' : 'Por Sessões'}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    <Clock size={16} />
                    {plan.plan_type === 'recorrente' 
                      ? `${plan.sessions_monthly} sessões/mês`
                      : `${plan.sessions_max} sessões máx.`
                    }
                  </td>
                  <td className="py-2 px-4 font-bold text-green-700 flex items-center gap-1">
                    <CurrencyDollar size={16} /> 
                    <div>
                      <div>R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <div className="text-xs text-gray-500">
                        {plan.plan_type === 'recorrente' ? '/mês' : '/pacote'}
                      </div>
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

      {/* Modais */}
      <CreatePatientPlanModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={loadPatientPlans}
      />

      {selectedPatientPlan && (
        <EditPatientPlanModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={loadPatientPlans}
          patientPlan={selectedPatientPlan}
        />
      )}

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