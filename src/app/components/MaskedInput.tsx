'use client'

import React from 'react';
import InputMask from 'react-input-mask';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface MaskedInputProps {
  label: string;
  mask: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
  type?: string;
  className?: string;
}

export function MaskedInput({
  label,
  mask,
  placeholder,
  register,
  error,
  autoComplete,
  type = 'text',
  className = '',
}: MaskedInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <InputMask
        mask={mask}
        {...register}
      >
        {(inputProps: any) => (
          <input
            {...inputProps}
            type={type}
            className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400 pl-3 pr-3 py-2 ${
              error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
            }`}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
        )}
      </InputMask>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
} 