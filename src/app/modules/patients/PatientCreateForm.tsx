'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../components/FormInput';
import { CpfInput } from '../../components/CpfInput';
import { PhoneInput } from '../../components/PhoneInput';
import { DateInput } from '../../components/DateInput';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { patientService } from '../../services/patientService';
import { createPatientSchema, type CreatePatientFormData } from '../../schemas/patient';

interface PatientCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PatientCreateForm({ onSuccess, onCancel }: PatientCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      cpf: '',
      name: '',
      phone: '',
      status: 'Ativo',
      email: '',
      birth_date: '',
    },
  });

  const { isLoading, submit } = useFormSubmit({
    onSuccess: () => {
      onSuccess();
    },
    successMessage: 'Paciente criado com sucesso!',
  });

  const onSubmit = async (data: CreatePatientFormData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    await submit(() => patientService.create({
      ...data,
      user_id: userId,
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CpfInput
          label="CPF"
          name="cpf"
          error={errors.cpf}
          value={watch('cpf')}
          setValue={val => setValue('cpf', val)}
        />
        <FormInput
          label="Nome Completo"
          register={register('name')}
          error={errors.name}
          placeholder="Nome completo do paciente"
        />
        <PhoneInput
          label="Telefone"
          name="phone"
          error={errors.phone}
          value={watch('phone')}
          setValue={val => setValue('phone', val)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            {...register('status')}
            className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 pl-3 pr-3 py-2 ${errors.status ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
            defaultValue="Ativo"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>
        <FormInput
          label="Email"
          type="email"
          register={register('email')}
          error={errors.email}
          placeholder="email@exemplo.com"
        />
        <DateInput
          label="Data de Nascimento"
          register={register('birth_date')}
          error={errors.birth_date}
          value={watch('birth_date')}
          setValue={val => setValue('birth_date', val)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Criando...' : 'Criar Paciente'}
        </button>
      </div>
    </form>
  );
} 