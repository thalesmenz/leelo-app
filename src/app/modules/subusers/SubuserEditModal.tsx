'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../components/Modal';
import { PencilSimple, FloppyDisk, User, Envelope } from 'phosphor-react';
import { updateSubuserSchema, type UpdateSubuserFormData } from '../../schemas/subuser';
import { subuserService } from '../../services/subuserService';
import { showToast } from '../../utils/toast';
import { useEffect } from 'react';
import { Subuser } from '../../types/subuser';

interface SubuserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subuser: Subuser | null;
}

export default function SubuserEditModal({ isOpen, onClose, onSuccess, subuser }: SubuserEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSubuserFormData>({
    resolver: zodResolver(updateSubuserSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (subuser) {
      reset({
        name: subuser.name,
        email: subuser.email,
      });
    }
  }, [subuser, reset]);

  async function onSubmit(data: UpdateSubuserFormData) {
    if (!subuser) return;

    try {
      await subuserService.updateById(subuser.id, data);
      showToast.success('Fisioterapeuta atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar fisioterapeuta');
    }
  }

  if (!subuser) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Fisioterapeuta"
      size="md"
    >
      <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-800">
        <PencilSimple size={20} className="text-blue-600" />
        Editar Fisioterapeuta
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            Nome Completo *
          </label>
          <input
            {...register('name')}
            type="text"
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Nome completo do fisioterapeuta"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.name.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Envelope size={16} className="text-gray-500" />
            E-mail *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.email.message}
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Atualizando...
              </>
            ) : (
              <>
                <FloppyDisk size={18} />
                Atualizar Fisioterapeuta
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 