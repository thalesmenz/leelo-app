'use client';

import { Modal } from '../../components/Modal';
import { Trash, Warning, User, Envelope } from 'phosphor-react';
import { subuserService } from '../../services/subuserService';
import { showToast } from '../../utils/toast';
import { Subuser } from '../../types/subuser';
import { useState } from 'react';

interface SubuserConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subuser: Subuser | null;
}

export default function SubuserConfirmDeleteModal({ 
  open, 
  onClose, 
  onSuccess, 
  subuser 
}: SubuserConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!subuser) return;

    try {
      setIsDeleting(true);
      await subuserService.deleteById(subuser.id);
      showToast.success('Fisioterapeuta removido com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      showToast.error('Erro ao remover fisioterapeuta');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!subuser) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Confirmar Exclusão"
      size="sm"
    >
      <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-800">
        <Trash size={20} className="text-red-600" />
        Confirmar Exclusão
      </div>
      
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Tem certeza que deseja remover o fisioterapeuta:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-gray-500" />
              <span className="font-semibold text-gray-900">{subuser.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Envelope size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{subuser.email}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Warning size={16} className="text-red-600" />
            <p className="text-sm text-red-800 font-medium">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Removendo...
              </>
            ) : (
              <>
                <Trash size={18} />
                Confirmar Exclusão
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 