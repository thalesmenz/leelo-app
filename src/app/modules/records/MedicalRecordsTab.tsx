'use client';

import { useState, useEffect } from 'react';
import { Plus, MagnifyingGlass, FileText, User, Calendar, Clock, PencilSimple, Trash, Eye } from 'phosphor-react';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../hooks/useAuth';
import { medicalRecordService } from '../../services/medicalRecordService';
import { patientService } from '../../services/patientService';
import CreateMedicalRecordModal from './CreateMedicalRecordModal';
import EditMedicalRecordModal from './EditMedicalRecordModal';
import ViewMedicalRecordModal from './ViewMedicalRecordModal';
import MedicalRecordConfirmDeleteModal from './MedicalRecordConfirmDeleteModal';

interface MedicalRecord {
  id: string;
  patient_id: string;
  professional_id: string;
  notes: string;
  created_at: string;
  patient_name: string;
  patient_cpf: string;
  professional_name: string;
}

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

export default function MedicalRecordsTab() {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [filterPatient, setFilterPatient] = useState<string>('todos');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected record IDs for modals
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);

  // Load medical records and patients on component mount
  useEffect(() => {
    loadMedicalRecords();
    loadPatients();
  }, []);

  const loadMedicalRecords = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const response = await medicalRecordService.getByProfessionalId(userId);
      
      if (response.success) {
        setMedicalRecords(response.data);
      } else {
        showToast.error('Erro ao carregar prontuários');
        setMedicalRecords([]);
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar prontuários');
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await patientService.getByUserId(userId);
      if (response.success) {
        setPatients(response.data);
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar pacientes');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMedicalRecords();
      return;
    }

    try {
      setSearching(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const response = await medicalRecordService.search(userId, searchTerm);
      if (response.success) {
        setMedicalRecords(response.data);
      } else {
        showToast.error('Erro ao buscar prontuários');
      }
    } catch (error: any) {
      showToast.error('Erro ao buscar prontuários');
    } finally {
      setSearching(false);
    }
  };

  // Modal handlers
  const handleCreateRecord = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecordId(record.id);
    setIsViewModalOpen(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedRecordId(record.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteRecord = (record: MedicalRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  // Success callbacks for modals
  const handleCreateSuccess = () => {
    loadMedicalRecords();
  };

  const handleEditSuccess = () => {
    loadMedicalRecords();
  };

  const handleDeleteSuccess = () => {
    loadMedicalRecords();
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

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente não encontrado';
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patient_cpf.includes(searchTerm) ||
                         record.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'todos' || record.patient_id === filterPatient;
    return matchesSearch && matchesPatient;
  });



  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Carregando prontuários...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <FileText size={24} /> Prontuários Médicos
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors"
            onClick={handleCreateRecord}
          >
            <Plus size={18} /> Novo Prontuário
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
              placeholder="Buscar prontuários por paciente, CPF ou notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={searching}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <MagnifyingGlass size={18} />
            {searching ? 'Buscando...' : 'Pesquisar'}
          </button>
        </div>

        {/* Lista de Prontuários */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prontuário encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filterPatient !== 'todos' 
                ? 'Tente ajustar os filtros ou termos de busca'
                : 'Comece criando seu primeiro prontuário'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{record.patient_name}</h3>
                        <p className="text-sm text-gray-500">CPF: {record.patient_cpf}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {record.notes.length > 150 
                          ? `${record.notes.substring(0, 150)}...` 
                          : record.notes
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Criado em {formatDate(record.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(record.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        Profissional: {record.professional_name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="px-3 py-1 border-2 border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:border-blue-600 font-semibold text-xs transition-colors shadow-sm"
                      title="Visualizar"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEditRecord(record)}
                      className="px-3 py-1 border-2 border-green-500 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:border-green-600 font-semibold text-xs transition-colors shadow-sm"
                      title="Editar"
                    >
                      <PencilSimple size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record)}
                      className="px-3 py-1 border-2 border-red-500 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:border-red-600 font-semibold text-xs transition-colors shadow-sm"
                      title="Excluir"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criar Prontuário */}
      <CreateMedicalRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onSuccess={handleCreateSuccess}
        patients={patients}
      />

      {/* Modal de Visualização */}
      <ViewMedicalRecordModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRecordId(null);
        }}
        recordId={selectedRecordId || ''}
      />

      {/* Modal de Edição */}
      <EditMedicalRecordModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecordId(null);
        }}
        onSuccess={handleEditSuccess}
        recordId={selectedRecordId || ''}
        patients={patients}
      />

      {/* Modal de Confirmação de Exclusão */}
      <MedicalRecordConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
        record={recordToDelete}
      />
    </>
  );
}
