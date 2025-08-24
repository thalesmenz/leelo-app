'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { showToast } from '../../utils/toast';
import { medicalRecordService } from '../../services/medicalRecordService';
import { updateMedicalRecordSchema, UpdateMedicalRecordFormData } from '../../schemas/medicalRecord';

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

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

interface EditMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recordId: string;
  patients: Patient[];
}

export default function EditMedicalRecordModal({
  isOpen,
  onClose,
  onSuccess,
  recordId,
  patients
}: EditMedicalRecordModalProps) {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<UpdateMedicalRecordFormData>({
    patient_id: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<UpdateMedicalRecordFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const recordData = response.data;
        setRecord(recordData);
        setFormData({
          patient_id: recordData.patient_id,
          notes: recordData.notes
        });
      } else {
        showToast.error('Erro ao carregar prontuário');
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar prontuário');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateMedicalRecordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateMedicalRecordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<UpdateMedicalRecordFormData> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0] as keyof UpdateMedicalRecordFormData] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await medicalRecordService.update(recordId, formData);
      
      if (response.success) {
        showToast.success('Prontuário atualizado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        showToast.error(response.message || 'Erro ao atualizar prontuário');
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Erro ao atualizar prontuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRecord(null);
    setFormData({ patient_id: '', notes: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Prontuário" size="lg">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Carregando prontuário...</span>
        </div>
      ) : record ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paciente *
            </label>
            <select
              value={formData.patient_id}
              onChange={(e) => handleInputChange('patient_id', e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${
                errors.patient_id ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione um paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - CPF: {patient.cpf}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas do Prontuário *
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={6}
              placeholder="Descreva as observações, diagnósticos, tratamentos, etc..."
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors resize-none ${
                errors.notes ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
              }`}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mínimo de 10 caracteres. Descreva detalhadamente as informações do paciente.
            </p>
          </div>

          {/* Informações do Registro */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Informações do Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Criado em:</span>
                <p className="text-gray-900">{new Date(record.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-500">Profissional:</span>
                <p className="text-gray-900">{record.professional_name}</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-400 hover:from-blue-400 hover:to-green-500 text-white rounded-lg font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
