'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'phosphor-react';
import { showToast } from '../../../utils/toast';
import { Modal } from '../../../components/Modal';
import { FormInput } from '../../../components/FormInput';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { anamneseQuestionService } from '../../../services/anamneseQuestionService';
import { anamneseAnswerService } from '../../../services/anamneseAnswerService';
import { patientService } from '../../../services/patientService';
import { AnamneseQuestion, Patient } from '../../../types/anamneseAnswer';
import { z } from 'zod';

interface CreateAnamneseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for parent component
}

// Schema de validação para o formulário
const createAnamneseSchema = z.object({
  patient_id: z.string().min(1, 'Selecione um paciente'),
  answers: z.record(z.string().optional()),
});

type FormData = z.infer<typeof createAnamneseSchema>;

export default function CreateAnamneseModal({ isOpen, onClose, onSuccess }: CreateAnamneseModalProps) {
  const [questions, setQuestions] = useState<AnamneseQuestion[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createAnamneseSchema),
    defaultValues: {
      patient_id: '',
      answers: {},
    },
  });

  const { isLoading, submit } = useFormSubmit({
    onSuccess: async () => {
      showToast.success('Anamnese criada com sucesso!');
      
      // Call parent callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal and reset form
      onClose();
      reset();
    },
    onError: (error: any) => {
      // Tratar erro específico de anamnese já existente
      if (error.response?.data?.error && error.response.data.error.includes('Já existe uma anamnese para este paciente')) {
        showToast.error('Este paciente já possui uma anamnese. Cada paciente pode ter apenas uma anamnese.');
      } else if (error.response?.data?.error && error.response.data.error.includes('Já existe uma resposta para esta questão')) {
        showToast.error('Já existe uma resposta para uma das questões. Verifique se não há duplicação.');
      } else {
        showToast.error('Erro ao criar anamnese. Tente novamente.');
      }
    },
    successMessage: '', // We handle success message manually above
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Carregar perguntas e pacientes em paralelo
      const [questionsRes, patientsRes] = await Promise.all([
        anamneseQuestionService.getByUserId(userId),
        patientService.getByUserId(userId),
      ]);

      const questionsData = Array.isArray(questionsRes.data) ? questionsRes.data : [questionsRes.data];
      const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : [patientsRes.data];

      // Ordenar perguntas por ordem
      const sortedQuestions = questionsData.sort((a: AnamneseQuestion, b: AnamneseQuestion) => (a.order || 0) - (b.order || 0));
      
      setQuestions(sortedQuestions);
      setPatients(patientsData);

      // Inicializar respostas vazias
      const initialAnswers: Record<string, string> = {};
      sortedQuestions.forEach((question: AnamneseQuestion) => {
        initialAnswers[question.id] = '';
      });
      setValue('answers', initialAnswers);
    } catch (error) {
      showToast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: FormData) => {
    if (!data.patient_id) {
      showToast.error('Selecione um paciente');
      return;
    }

    // Verificar se todas as perguntas obrigatórias foram respondidas
    const requiredQuestions = questions.filter(q => q.is_required);
    const missingRequired = requiredQuestions.filter(q => {
      const answer = data.answers[q.id];
      return !answer || answer.trim() === '';
    });

    if (missingRequired.length > 0) {
      showToast.error(`Preencha as perguntas obrigatórias: ${missingRequired.map(q => q.question).join(', ')}`);
      return;
    }

    // Filtrar apenas respostas que foram preenchidas
    const answers = Object.entries(data.answers)
      .filter(([_, answer]) => answer && answer.trim() !== '')
      .map(([questionId, answer]) => ({
        question_id: questionId,
        patient_id: data.patient_id,
        answer: answer!.trim(),
      }));

    if (answers.length === 0) {
      showToast.error('Preencha pelo menos uma resposta');
      return;
    }

    await submit(async () => {
      await anamneseAnswerService.bulkCreate(answers);
    });
  };

  const renderQuestionInput = (question: AnamneseQuestion) => {
    const fieldName = `answers.${question.id}` as const;
    const isRequired = question.is_required;

    switch (question.type) {
      case 'text':
        return (
          <div>
            <FormInput
              label={question.question}
              register={register(fieldName, {
                required: isRequired ? 'Esta pergunta é obrigatória' : false,
              })}
              placeholder="Digite sua resposta..."
              className="w-full"
            />
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm">{errors.answers[question.id]?.message}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <FormInput
              label={question.question}
              type="number"
              register={register(fieldName, {
                required: isRequired ? 'Esta pergunta é obrigatória' : false,
              })}
              placeholder="Digite um número..."
              className="w-full"
            />
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm">{errors.answers[question.id]?.message}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sim"
                  {...register(fieldName, {
                    required: isRequired ? 'Esta pergunta é obrigatória' : false,
                  })}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="não"
                  {...register(fieldName, {
                    required: isRequired ? 'Esta pergunta é obrigatória' : false,
                  })}
                  className="mr-2"
                />
                Não
              </label>
            </div>
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm">{errors.answers[question.id]?.message}</p>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    value={option}
                    {...register(fieldName, {
                      required: isRequired ? 'Esta pergunta é obrigatória' : false,
                    })}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm">{errors.answers[question.id]?.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Anamnese"
      size="xl"
    >
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        {/* Seleção de Paciente */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User size={20} /> Dados do Paciente
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Paciente *</label>
              <select
                {...register('patient_id', { required: 'Selecione um paciente' })}
                className="w-full border rounded-lg px-4 py-3 text-base"
              >
                <option value="">Selecione o paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="text-red-600 text-xs mt-1">{errors.patient_id.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Perguntas */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Carregando perguntas...</span>
          </div>
        ) : questions.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <User size={20} /> Perguntas da Anamnese
            </div>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  {renderQuestionInput(question)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma pergunta cadastrada. Configure as perguntas primeiro.
          </div>
        )}

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
            disabled={isLoading || loading || questions.length === 0}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Salvando...' : 'Criar Anamnese'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
