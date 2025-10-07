import React, { forwardRef, useCallback } from 'react';

interface CurrencyInputProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  required?: boolean;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    name, 
    value = '', 
    onChange, 
    placeholder = 'R$ 0,00', 
    className = '', 
    disabled = false,
    error = false,
    label,
    required = false,
    ...props 
  }, ref) => {

    // Format currency for display - simple and fast
    const formatCurrency = useCallback((rawValue: string) => {
      if (!rawValue) return '';
      
      // Remove all non-numeric characters
      const numericValue = rawValue.replace(/\D/g, '');
      
      if (!numericValue) return '';
      
      // Convert to number and format
      const number = parseInt(numericValue) / 100;
      
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Extract only numeric characters
      const rawValue = inputValue.replace(/\D/g, '');
      
      if (onChange) {
        onChange(rawValue);
      }
    }, [onChange]);

    // Always show formatted value for consistency
    const displayValue = formatCurrency(value);

    const baseClasses = `w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${
      error ? 'border-red-300' : 'border-gray-300'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          name={name}
          type="text"
          className={baseClasses}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;