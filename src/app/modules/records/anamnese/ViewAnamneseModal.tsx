import React, { useState, useEffect } from 'react';
import { Modal } from '@/app/components/Modal';
import { User, Calendar, Clock, FileText, CheckCircle, Clock as ClockIcon, Warning } from 'phosphor-react';
import { CompleteAnamnese } from '@/app/types/anamneseAnswer';
import { anamneseAnswerService } from '@/app/services/anamneseAnswerService';
import { showToast } from '@/app/utils/toast';

interface ViewAnamneseModalProps {
  isOpen: boolean;
  onClose: () => void;
  anamneseId: string; // Only need the ID, not the full anamnese object
}

export default function ViewAnamneseModal({ isOpen, onClose, anamneseId }: ViewAnamneseModalProps) {
  const [loading, setLoading] = useState(false);
  const [anamnese, setAnamnese] = useState<CompleteAnamnese | null>(null);

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
    } catch (error) {
      showToast.error('Erro ao carregar anamnese');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pendente', icon: Warning },
      em_andamento: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Em Andamento', icon: ClockIcon },
      completa: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completa', icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    const IconComponent = config.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color} flex items-center gap-2`}>
        <IconComponent size={16} />
        {config.text}
      </span>
    );
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

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (!isOpen || !anamneseId) return null;

  if (loading && !anamnese) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Anamnese" size="xl">
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
    <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Anamnese" size="xl">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span><strong>Criada em:</strong> {formatDate(anamnese.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span><strong>Atualizada em:</strong> {formatDate(anamnese.last_updated)} às {formatTime(anamnese.last_updated)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText size={16} />
              <span><strong>Respostas:</strong> {anamnese.answers_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Respostas da anamnese */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} />
            Respostas da Anamnese
          </h3>
          
          {anamnese.answers && anamnese.answers.length > 0 ? (
            <div className="space-y-4">
              {anamnese.answers
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
                      
                      {/* Exibir resposta baseada no tipo de questão */}
                      <div className="bg-white border border-gray-200 rounded p-3">
                        {answer.question?.type === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              answer.answer === 'Sim' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {answer.answer}
                            </span>
                          </div>
                        ) : answer.question?.type === 'multiple_choice' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {answer.answer}
                            </span>
                          </div>
                        ) : answer.question?.type === 'number' ? (
                          <div className="text-lg font-mono text-gray-700">
                            {answer.answer}
                          </div>
                        ) : (
                          <p className="text-gray-700">{answer.answer}</p>
                        )}
                      </div>
                      
                      {/* Informações adicionais da questão */}
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Tipo:</span> {
                            answer.question?.type === 'text' ? 'Texto' :
                            answer.question?.type === 'number' ? 'Número' :
                            answer.question?.type === 'boolean' ? 'Sim/Não' :
                            answer.question?.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Desconhecido'
                          }
                        </div>
                        <div>
                          Respondido em {formatDate(answer.answered_at)} às {formatTime(answer.answered_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p>Nenhuma resposta encontrada para esta anamnese.</p>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
