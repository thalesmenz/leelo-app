import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

function maskDate(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 10);
}

interface DateInputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  value: string;
  setValue: (value: string) => void;
}

export function DateInput({
  label,
  register,
  error,
  placeholder = 'dd/mm/aaaa',
  autoComplete = 'off',
  className = '',
  value,
  setValue,
}: DateInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...register}
        value={maskDate(value)}
        onChange={e => setValue(maskDate(e.target.value))}
        className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400 pl-3 pr-3 py-2 ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={10}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
} 