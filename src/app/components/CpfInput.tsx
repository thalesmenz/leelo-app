import React from 'react';
import { FieldError } from 'react-hook-form';

interface CpfInputProps {
  label: string;
  name: string;
  error?: FieldError;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

function maskCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function unmaskCPF(value: string) {
  return value.replace(/\D/g, '');
}

export function CpfInput({ label, name, error, value, setValue, disabled }: CpfInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const unmaskedValue = unmaskCPF(inputValue);
    
    // Limita a 11 dígitos
    if (unmaskedValue.length <= 11) {
      setValue(unmaskedValue); // Envia apenas números para o formulário
    }
  };

  const displayValue = maskCPF(value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700 pl-3 pr-3 py-2 ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
        }`}
        placeholder="000.000.000-00"
        maxLength={14}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
} 