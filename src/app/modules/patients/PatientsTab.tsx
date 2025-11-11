'use client';

import React, { useEffect, useState, useRef } from "react";
import { patientService } from "@/app/services/patientService";
import { Phone, Envelope, CalendarBlank, FileText, DotsThree, Users, MagnifyingGlass, PencilSimple, Trash, Plus } from 'phosphor-react';
import { showToast } from "@/app/utils/toast";
import { PatientConfirmDeleteModal } from './PatientConfirmDeleteModal';
import { PatientCreateForm } from './PatientCreateForm';
import EditPatientModal from './EditPatientModal';
import { Modal } from '@/app/components/Modal';

interface Patient {
  id: string;
  user_id: string;
  cpf: string;
  name: string;
  phone: string | number;
  email: string;
  birth_date: string;
  status: 'Ativo' | 'Inativo';
  lastVisit?: string;
  nextVisit?: string;
  treatment?: string;
  created_at: string;
}

// Funções de máscara
function maskCPF(value: string) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function maskPhone(value: string | number) {
  if (!value) {
    return '';
  }
  
  // Converte para string se for número
  const stringValue = String(value);
  
  // Remove todos os caracteres não numéricos
  const numbers = stringValue.replace(/\D/g, '');
  
  // Aplica a máscara baseada no tamanho
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return numbers.replace(/(\d{2})(\d)/, '($1) $2');
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }
}

export default function PatientsTab() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openActionMenuIndex, setOpenActionMenuIndex] = useState<number | null>(null);
  const actionMenuRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Inativo'>('todos');

  const loadPatients = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await patientService.getByUserId(userId);
        const patientsData = Array.isArray(response.data) ? response.data : [response.data];
        setPatients(patientsData);
      } else {
        setPatients([]);
      }
    } catch (error) {
      setPatients([]);
      showToast.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      loadPatients();
      return;
    }

    try {
      setSearching(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await patientService.searchByName(userId, searchTerm.trim());
        setPatients(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setPatients([]);
      }
    } catch (error) {
      setPatients([]);
      showToast.error('Erro ao buscar pacientes');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    function handleClickOutsideActionMenu(event: MouseEvent) {
      if (openActionMenuIndex !== null && actionMenuRefs.current[openActionMenuIndex]) {
        if (!actionMenuRefs.current[openActionMenuIndex]?.contains(event.target as Node)) {
          setOpenActionMenuIndex(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutsideActionMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideActionMenu);
  }, [openActionMenuIndex]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setSearchTerm('');
    loadPatients();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedPatient(null);
    setSearchTerm('');
    loadPatients();
  };

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
    setSearchTerm('');
    loadPatients();
  };

  const handleOpenEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
    setOpenActionMenuIndex(null);
  };

  const handleAskDelete = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
    setOpenActionMenuIndex(null);
  };

  const getFilteredPatients = () => {
    let filtered = patients;
    
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    return filtered;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredPatients = getFilteredPatients();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-blue-600">
          <Users size={20} className="sm:w-6 sm:h-6" /> Pacientes
        </div>
        <button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 shadow transition-colors text-sm sm:text-base"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      {/* Busca - Mobile First */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlass size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPatients()}
            className="w-full border border-gray-200 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
          <button 
            onClick={searchPatients}
            disabled={searching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
          >
            <MagnifyingGlass size={16} className="sm:hidden" />
            <span className="hidden sm:inline">{searching ? 'Buscando...' : 'Pesquisar'}</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${statusFilter === 'todos' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos ({patients.length})
        </button>
        <button
          onClick={() => setStatusFilter('Ativo')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${statusFilter === 'Ativo' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Ativos ({patients.filter(p => p.status === 'Ativo').length})
        </button>
        <button
          onClick={() => setStatusFilter('Inativo')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${statusFilter === 'Inativo' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Inativos ({patients.filter(p => p.status === 'Inativo').length})
        </button>
      </div>

      {/* Lista de Pacientes */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Carregando pacientes...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-gray-500 mb-4">Nenhum paciente encontrado</div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar primeiro paciente
          </button>
        </div>
      ) : (
        <>
          {/* Cards Mobile */}
          <div className="md:hidden space-y-3">
            {filteredPatients.map((p, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-gray-900 mb-1">{p.name}</div>
                    <div className="text-xs text-gray-500 mb-2">CPF: {maskCPF(p.cpf)}</div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Envelope size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{p.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <span>{p.phone ? maskPhone(p.phone) : 'Sem telefone'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {p.status}
                    </span>
                    <div className="relative">
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:shadow-md transition-all border border-blue-200"
                        onClick={() => setOpenActionMenuIndex(openActionMenuIndex === idx ? null : idx)}
                        title="Ações"
                      >
                        <DotsThree size={20} weight="bold" />
                      </button>
                      {openActionMenuIndex === idx && (
                        <div
                          ref={el => { actionMenuRefs.current[idx] = el; }}
                          className="absolute z-10 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col"
                        >
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                            onClick={() => handleOpenEditModal(p)}
                          >
                            <PencilSimple size={16} /> Editar
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                            onClick={() => handleAskDelete(p)}
                          >
                            <Trash size={16} /> Deletar
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                            onClick={() => { /* lógica de agendar */ setOpenActionMenuIndex(null); }}
                          >
                            <CalendarBlank size={16} /> Agendar
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                            onClick={() => { /* lógica de prontuário */ setOpenActionMenuIndex(null); }}
                          >
                            <FileText size={16} /> Prontuário
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 px-2 border-b border-gray-200">Paciente</th>
                  <th className="py-2 px-2 border-b border-gray-200">Email</th>
                  <th className="py-2 px-2 border-b border-gray-200">Telefone</th>
                  <th className="py-2 px-2 border-b border-gray-200">Status</th>
                  <th className="py-2 px-2 border-b border-gray-200 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className={`py-4 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                      <div className="font-bold text-base">{p.name}</div>
                      <div className="text-xs text-gray-500">CPF: {maskCPF(p.cpf)}</div>
                    </td>
                    <td className={`py-4 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Envelope size={16} />
                        {p.email}
                      </div>
                    </td>
                    <td className={`py-4 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone size={16} />
                        {p.phone ? maskPhone(p.phone) : 'Sem telefone'}
                      </div>
                    </td>
                    <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                      <div className="flex justify-center relative">
                        <button
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200 hover:shadow-md transition-all border border-blue-200"
                          onClick={() => setOpenActionMenuIndex(openActionMenuIndex === idx ? null : idx)}
                          title="Ações"
                        >
                          <DotsThree size={28} weight="bold" />
                        </button>
                        {openActionMenuIndex === idx && (
                          <div
                            ref={el => { actionMenuRefs.current[idx] = el; }}
                            className="absolute z-10 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col"
                          >
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              onClick={() => handleOpenEditModal(p)}
                            >
                              <PencilSimple size={16} /> Editar
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              onClick={() => handleAskDelete(p)}
                            >
                              <Trash size={16} /> Deletar
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              onClick={() => { /* lógica de agendar */ setOpenActionMenuIndex(null); }}
                            >
                              <CalendarBlank size={16} /> Agendar
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              onClick={() => { /* lógica de prontuário */ setOpenActionMenuIndex(null); }}
                            >
                              <FileText size={16} /> Prontuário
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modais */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Paciente"
        size="xl"
      >
        <PatientCreateForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {selectedPatient && (
        <EditPatientModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedPatient(null); }}
          onSuccess={handleEditSuccess}
          patient={selectedPatient}
        />
      )}

      <PatientConfirmDeleteModal
        open={deleteModalOpen}
        patient={patientToDelete}
        onClose={() => { setDeleteModalOpen(false); setPatientToDelete(null); }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
} 