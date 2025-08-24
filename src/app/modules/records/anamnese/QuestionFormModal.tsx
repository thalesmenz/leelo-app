'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash } from 'phosphor-react';
import { Modal } from '../../../components/Modal';
import { FormInput } from '../../../components/FormInput';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { anamneseQuestionService, AnamneseQuestion } from '../../../services/anamneseQuestionService';
import { createAnamneseQuestionSchema, type CreateAnamneseQuestionFormData } from '../../../schemas/anamneseQuestion';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnamneseQuestionFormData) => void;
  question: AnamneseQuestion | null;
  saving: boolean;
}

export default function QuestionFormModal({ isOpen, onClose, onSubmit, question, saving }: QuestionFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateAnamneseQuestionFormData>({
    resolver: zodResolver(createAnamneseQuestionSchema),
    defaultValues: {
      question: question?.question || '',
      type: question?.type || 'text',
      options: question?.options || [],
      is_required: question?.is_required || false,
      order: question?.order,
    },
  });

  const { isLoading, submit } = useFormSubmit({
    onSuccess: () => {
      onClose();
    },
    successMessage: question ? 'Questão atualizada com sucesso!' : 'Questão criada com sucesso!',
  });

  const watchedType = watch('type');
  const watchedOptions = watch('options') || [];

  const addOption = () => {
    const newOptions = [...watchedOptions, ''];
    setValue('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = watchedOptions.filter((_, i) => i !== index);
    setValue('options', newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...watchedOptions];
    newOptions[index] = value;
    setValue('options', newOptions);
  };

  const handleFormSubmit = async (data: CreateAnamneseQuestionFormData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const submitData = {
      ...data,
      user_id: userId,
      options: data.type === 'multiple_choice' ? data.options : undefined,
    };

    await submit(async () => {
      await onSubmit(submitData);
    });
  };

  // Reset form when question changes
  React.useEffect(() => {
    if (question) {
      reset({
        question: question.question,
        type: question.type,
        options: question.options || [],
        is_required: question.is_required,
        order: question.order,
      });
    } else {
      reset({
        question: '',
        type: 'text',
        options: [],
        is_required: false,
        order: undefined,
      });
    }
  }, [question, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={question ? 'Editar Questão' : 'Nova Questão'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Pergunta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pergunta *
          </label>
          <textarea
            {...register('question')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.question ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
            rows={3}
            placeholder="Digite a pergunta..."
          />
          {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
        </div>



        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            {...register('type')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.type ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="boolean">Sim/Não</option>
            <option value="multiple_choice">Múltipla Escolha</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        {/* Opções para múltipla escolha */}
        {watchedType === 'multiple_choice' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opções *
            </label>
            <div className="space-y-2">
              {watchedOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder={`Opção ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Plus size={16} />
                Adicionar opção
              </button>
            </div>
            {errors.options && <p className="text-red-500 text-xs mt-1">{errors.options.message}</p>}
          </div>
        )}

        {/* Obrigatória */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('is_required')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Questão obrigatória
          </label>
        </div>

        {/* Ordem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordem (opcional)
          </label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.order ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
            placeholder="Deixe em branco para ordem automática"
            min="1"
          />
          {errors.order && <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || saving}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading || saving ? 'Salvando...' : (question ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
