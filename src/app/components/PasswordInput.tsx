import React, { useState } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Lock, Eye, EyeSlash } from 'phosphor-react';

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
  className?: string;
}

export function PasswordInput({
  label,
  placeholder = 'Sua senha',
  register,
  error,
  autoComplete = 'current-password',
  className = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative flex items-center mb-1">
        <Lock className="absolute left-3 text-gray-400" size={20} />
        <input
          type={showPassword ? 'text' : 'password'}
          className={`pl-10 pr-10 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 placeholder-gray-400 ${
            error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
        />
        <button
          type="button"
          className="absolute right-3 text-gray-400 hover:text-blue-600"
          tabIndex={-1}
          onClick={() => setShowPassword(s => !s)}
        >
          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mb-3">{error.message}</p>
      )}
    </div>
  );
} 