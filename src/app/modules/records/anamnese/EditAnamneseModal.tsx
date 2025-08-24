'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/app/components/Modal';
import { PencilSimple, FloppyDisk, User, FileText } from 'phosphor-react';
import { updateAnamneseAnswerSchema, type UpdateAnamneseAnswerFormData } from '@/app/schemas/anamneseAnswer';
import { anamneseAnswerService } from '@/app/services/anamneseAnswerService';
import { showToast } from '@/app/utils/toast';
import { CompleteAnamnese } from '@/app/types/anamneseAnswer';

interface EditAnamneseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for parent component
  anamneseId: string; // Only need the ID, not the full anamnese object
}

export default function EditAnamneseModal({ isOpen, onClose, onSuccess, anamneseId }: EditAnamneseModalProps) {
  const [loading, setLoading] = useState(false);
  const [anamnese, setAnamnese] = useState<CompleteAnamnese | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAnamneseAnswerFormData>({
    resolver: zodResolver(updateAnamneseAnswerSchema),
  });

  // Load anamnese data when modal opens
  useEffect(() => {
    if (isOpen && anamneseId) {
      loadAnamneseData();
    }
  }, [isOpen, anamneseId]);

  const loadAnamneseData = async () => {
    try {
      setLoading(true);
      const completeAnamnese = await anamneseAnswerService.getAnamneseComplete(anamneseId);
      setAnamnese(completeAnamnese);
      if (completeAnamnese.answers) {
        setAnswers(completeAnamnese.answers);
      }
    } catch (error) {
      showToast.error('Erro ao carregar anamnese');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answerId: string, newAnswer: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.id === answerId 
          ? { ...answer, answer: newAnswer }
          : answer
      )
    );
  };

  const handleSubmitForm = async () => {
    if (!anamnese) return;

    try {
      setLoading(true);
      
      // Atualizar cada resposta modificada
      const updatePromises = answers.map(async (answer) => {
        try {
          await anamneseAnswerService.updateById(answer.id, {
            answer: answer.answer,
          });
        } catch (error) {
          throw error;
        }
      });

      await Promise.all(updatePromises);
      
      showToast.success('Anamnese atualizada com sucesso!');
      
      // Call parent callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar anamnese');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pendente' },
      em_andamento: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Em Andamento' },
      completa: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completa' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (!isOpen || !anamneseId) return null;

  if (loading && !anamnese) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Anamnese" size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Carregando anamnese...</span>
        </div>
      </Modal>
    );
  }

  if (!anamnese) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Anamnese" size="xl">
      <div className="space-y-6">
        {/* Cabeçalho com informações do paciente */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              <User size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{anamnese.patient_name}</h2>
              <p className="text-gray-600">CPF: {formatCPF(anamnese.patient_cpf)}</p>
            </div>
            {getStatusBadge(anamnese.status)}
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Status:</strong> {anamnese.status === 'pendente' ? 'Pendente - Aguardando preenchimento' : 
                                         anamnese.status === 'em_andamento' ? 'Em Andamento - Preenchimento parcial' : 
                                         'Completa - Todas as respostas preenchidas'}</p>
          </div>
        </div>

        {/* Formulário de edição das respostas */}
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PencilSimple size={20} />
              Editar Respostas
            </h3>
            
            {answers.length > 0 ? (
              <div className="space-y-4">
                {answers
                  .sort((a, b) => (a.question?.order || 0) - (b.question?.order || 0))
                  .map((answer, index) => (
                  <div key={answer.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {answer.question?.order || index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {answer.question?.question || 'Pergunta não encontrada'}
                          {answer.question?.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h4>
                        
                        {/* Campo de resposta baseado no tipo */}
                        {answer.question?.type === 'boolean' ? (
                          <select
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="">Selecione uma opção</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        ) : answer.question?.type === 'multiple_choice' && answer.question?.options ? (
                          <select
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="">Selecione uma opção</option>
                            {answer.question.options.map((option: string, idx: number) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : answer.question?.type === 'number' ? (
                          <input
                            type="number"
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Digite um número"
                          />
                        ) : (
                          <textarea
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Digite sua resposta"
                          />
                        )}
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Respondido em {new Date(answer.answered_at).toLocaleDateString('pt-BR')} às {new Date(answer.answered_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p>Nenhuma resposta encontrada para editar.</p>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <FloppyDisk size={16} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
