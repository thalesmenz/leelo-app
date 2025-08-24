import React from 'react';
import { FieldError } from 'react-hook-form';

interface PhoneInputProps {
  label: string;
  name: string;
  error?: FieldError;
  value: string;
  setValue: (value: string) => void;
}

function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

function unmaskPhone(value: string) {
  return value.replace(/\D/g, '');
}

export function PhoneInput({ label, name, error, value, setValue }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const unmaskedValue = unmaskPhone(inputValue);
    
    // Limita a 11 dígitos
    if (unmaskedValue.length <= 11) {
      setValue(unmaskedValue); // Envia apenas números para o formulário
    }
  };

  const displayValue = maskPhone(value);

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
        placeholder="(00) 00000-0000"
        maxLength={15}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
} 