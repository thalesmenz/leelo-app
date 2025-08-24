import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder?: string;
  icon?: React.ReactNode;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
  className?: string;
}

export function FormInput({
  label,
  type = 'text',
  placeholder,
  icon,
  register,
  error,
  autoComplete,
  className = '',
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative flex items-center mb-1">
        {icon && (
          <div className="absolute left-3 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400 ${
            icon ? 'pl-10' : 'pl-3'
          } pr-3 py-2 ${
            error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mb-3">{error.message}</p>
      )}
    </div>
  );
}
