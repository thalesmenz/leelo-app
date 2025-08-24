'use client';

import { useState } from 'react';
import { X, User, FileText } from 'phosphor-react';
import { Modal } from '../../components/Modal';
import { showToast } from '../../utils/toast';
import { medicalRecordService } from '../../services/medicalRecordService';
import { createMedicalRecordSchema, CreateMedicalRecordFormData } from '../../schemas/medicalRecord';

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

interface CreateMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patients: Patient[];
}

export default function CreateMedicalRecordModal({
  isOpen,
  onClose,
  onSuccess,
  patients
}: CreateMedicalRecordModalProps) {
  const [formData, setFormData] = useState<CreateMedicalRecordFormData>({
    patient_id: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<CreateMedicalRecordFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateMedicalRecordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      createMedicalRecordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<CreateMedicalRecordFormData> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0] as keyof CreateMedicalRecordFormData] = err.message;
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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const recordData = {
        ...formData,
        professional_id: userId
      };

      const response = await medicalRecordService.create(recordData);
      
      if (response.success) {
        showToast.success('Prontuário criado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        showToast.error(response.message || 'Erro ao criar prontuário');
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Erro ao criar prontuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ patient_id: '', notes: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Prontuário">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-2" />
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
            <FileText size={16} className="inline mr-2" />
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
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white rounded-lg font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Criando...' : 'Criar Prontuário'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
