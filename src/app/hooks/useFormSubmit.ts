import { useState } from 'react';
import { showToast } from '../utils/toast';

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  showToasts?: boolean;
}

export function useFormSubmit<T = any>(options: UseFormSubmitOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (submitFn: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await submitFn();
      
      // Mostrar toast de sucesso se habilitado
      if (options.showToasts !== false) {
        showToast.success(options.successMessage || 'Operação realizada com sucesso!');
      }
      
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      // Pegar mensagem diretamente da API
      const apiMessage = err.response?.data?.message;
      const errorMessage = apiMessage || err.message || 'Ocorreu um erro inesperado';
      
      setError(errorMessage);
      
      // Mostrar toast de erro se habilitado
      if (options.showToasts !== false) {
        showToast.error(apiMessage || options.errorMessage || errorMessage);
      }
      
      options.onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    submit,
    clearError,
  };
} 