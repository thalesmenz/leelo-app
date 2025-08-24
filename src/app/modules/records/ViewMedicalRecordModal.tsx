'use client';

import { useState, useEffect } from 'react';
import { X, User, FileText, Calendar, Clock, User as ProfessionalIcon } from 'phosphor-react';
import { Modal } from '../../components/Modal';
import { showToast } from '../../utils/toast';
import { medicalRecordService } from '../../services/medicalRecordService';

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

interface ViewMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
}

export default function ViewMedicalRecordModal({
  isOpen,
  onClose,
  recordId
}: ViewMedicalRecordModalProps) {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && recordId) {
      loadRecord();
    }
  }, [isOpen, recordId]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getById(recordId);
      
      if (response.success) {
        setRecord(response.data);
      } else {
        showToast.error('Erro ao carregar prontuário');
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar prontuário');
    } finally {
      setLoading(false);
    }
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

  const handleClose = () => {
    setRecord(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Visualizar Prontuário">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Carregando prontuário...</span>
        </div>
      ) : record ? (
        <div className="space-y-6">
          {/* Informações do Paciente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Informações do Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                <p className="text-gray-900 font-medium">{record.patient_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CPF</label>
                <p className="text-gray-900 font-mono">{record.patient_cpf}</p>
              </div>
            </div>
          </div>

          {/* Informações do Profissional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ProfessionalIcon size={20} className="text-green-600" />
              Profissional Responsável
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
              <p className="text-gray-900 font-medium">{record.professional_name}</p>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-purple-600" />
              Data e Hora
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Data de Criação</label>
                <p className="text-gray-900 font-medium">{formatDate(record.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Hora</label>
                <p className="text-gray-900 font-medium">{formatTime(record.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Notas do Prontuário */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-orange-600" />
              Notas do Prontuário
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Observações</label>
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[120px]">
                <p className="text-gray-900 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
