'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../components/Modal';
import { Plus, FloppyDisk, User, Envelope, Lock } from 'phosphor-react';
import { createSubuserSchema, type CreateSubuserFormData } from '../../schemas/subuser';
import { subuserService } from '../../services/subuserService';
import { showToast } from '../../utils/toast';
import { useState } from 'react';

interface SubuserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubuserCreateModal({ isOpen, onClose, onSuccess }: SubuserCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSubuserFormData>({
    resolver: zodResolver(createSubuserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      parent_id: '',
    },
  });

  // Função simplificada para testar
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        showToast.error('Usuário não autenticado');
        return;
      }

      const subuserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        parent_id: userId,
      };

      await subuserService.create(subuserData);
      showToast.success('Fisioterapeuta criado com sucesso!');
      
      setFormData({ name: '', email: '', password: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar fisioterapeuta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Fisioterapeuta"
      size="md"
    >
      <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-800">
        <Plus size={20} className="text-blue-600" />
        Novo Fisioterapeuta
      </div>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            Nome Completo *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-400"
            placeholder="Nome completo do fisioterapeuta"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Envelope size={16} className="text-gray-500" />
            E-mail *
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-400"
            placeholder="email@exemplo.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Lock size={16} className="text-gray-500" />
            Senha *
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-400"
            placeholder="Senha do fisioterapeuta"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            A senha deve ter pelo menos 6 caracteres
          </p>
        </div>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Criando...
              </>
            ) : (
              <>
                <FloppyDisk size={18} />
                Criar Fisioterapeuta
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 