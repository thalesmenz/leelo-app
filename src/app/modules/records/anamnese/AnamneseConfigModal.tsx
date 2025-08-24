'use client';

import { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash } from 'phosphor-react';
import { showToast } from '../../../utils/toast';
import { Modal } from '../../../components/Modal';
import { anamneseQuestionService, AnamneseQuestion } from '../../../services/anamneseQuestionService';
import { CreateAnamneseQuestionFormData } from '../../../schemas/anamneseQuestion';
import QuestionFormModal from './QuestionFormModal';

interface AnamneseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnamneseConfigModal({ isOpen, onClose }: AnamneseConfigModalProps) {
  const [questions, setQuestions] = useState<AnamneseQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AnamneseQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      const res = await anamneseQuestionService.getByUserId(userId);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setQuestions(data);
    } catch (error) {
      showToast.error('Erro ao carregar questões de anamnese');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (data: CreateAnamneseQuestionFormData) => {
    try {
      setSaving(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      await anamneseQuestionService.create({
        ...data,
        user_id: userId,
      });
      showToast.success('Questão criada com sucesso!');
      setIsCreateModalOpen(false);
      loadQuestions();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar questão');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = async (id: string, data: CreateAnamneseQuestionFormData) => {
    try {
      setSaving(true);
      await anamneseQuestionService.updateById(id, data);
      showToast.success('Questão atualizada com sucesso!');
      setEditingQuestion(null);
      loadQuestions();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar questão');
    } finally {
      setSaving(false);
    }
  };

  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  const handleDeleteQuestion = async (id: string) => {
    setDeleteQuestionId(id);
  };

  const confirmDeleteQuestion = async () => {
    if (!deleteQuestionId) return;
    
    try {
      setSaving(true);
      await anamneseQuestionService.deleteById(deleteQuestionId);
      showToast.success('Questão excluída com sucesso!');
      setDeleteQuestionId(null);
      loadQuestions();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao excluir questão');
    } finally {
      setSaving(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      text: 'Texto',
      number: 'Número',
      boolean: 'Sim/Não',
      multiple_choice: 'Múltipla Escolha'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getQuestionTypeIcon = (type: string) => {
    const icons = {
      text: '📝',
      number: '🔢',
      boolean: '✅',
      multiple_choice: '📋'
    };
    return icons[type as keyof typeof icons] || '❓';
  };

  const filteredQuestions = (questions || []).filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Configurar Anamnese"
        size="xl"
      >
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Plus size={18} /> Nova Questão
            </button>



            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Buscar questões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Carregando questões...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
                             <h3 className="text-lg font-medium text-gray-900 mb-2">
                 {(questions || []).length === 0 ? 'Nenhuma questão criada' : 'Nenhuma questão encontrada'}
               </h3>
               <p className="text-gray-500">
                 {(questions || []).length === 0 
                   ? 'Comece criando sua primeira questão de anamnese'
                   : 'Tente ajustar os filtros ou termos de busca'
                 }
               </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{getQuestionTypeIcon(question.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{question.question}</h3>
                          {question.is_required && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Obrigatória</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Tipo: {getQuestionTypeLabel(question.type)}</span>
                          <span>Ordem: {question.order}</span>
                          {question.type === 'multiple_choice' && question.options && (
                            <span>Opções: {question.options.length}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <PencilSimple size={12} /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={saving}
                        className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-semibold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <Trash size={12} /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
                     <div className="flex items-center justify-between pt-4 border-t border-gray-200">
             <div className="text-sm text-gray-500">
               {(questions || []).length} questão{(questions || []).length !== 1 ? 'es' : ''} no total
             </div>
           </div>
        </div>
      </Modal>

      {/* Create/Edit Question Modal */}
             {isCreateModalOpen && (
         <QuestionFormModal
           isOpen={isCreateModalOpen}
           onClose={() => setIsCreateModalOpen(false)}
           onSubmit={handleCreateQuestion}
           question={null}
           saving={saving}
         />
       )}

       {editingQuestion && (
         <QuestionFormModal
           isOpen={true}
           onClose={() => setEditingQuestion(null)}
           onSubmit={(data: CreateAnamneseQuestionFormData) => handleUpdateQuestion(editingQuestion.id, data)}
           question={editingQuestion}
           saving={saving}
         />
       )}

       {/* Delete Confirmation Modal */}
       <Modal
         isOpen={!!deleteQuestionId}
         onClose={() => setDeleteQuestionId(null)}
         title="Confirmar Exclusão"
         size="sm"
       >
         <div className="flex flex-col items-center gap-4 py-4">
           <div className="text-4xl">⚠️</div>
           <div className="text-center">
             <p className="text-lg font-semibold text-gray-900 mb-2">
               Tem certeza que deseja excluir esta questão?
             </p>
             <p className="text-sm text-gray-500">
               Esta ação não poderá ser desfeita.
             </p>
           </div>
           <div className="flex gap-4 mt-6">
             <button
               className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
               onClick={() => setDeleteQuestionId(null)}
               type="button"
               disabled={saving}
             >
               Cancelar
             </button>
             <button
               className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50"
               onClick={confirmDeleteQuestion}
               type="button"
               disabled={saving}
             >
               {saving ? 'Excluindo...' : 'Excluir'}
             </button>
           </div>
         </div>
       </Modal>
    </>
  );
}
