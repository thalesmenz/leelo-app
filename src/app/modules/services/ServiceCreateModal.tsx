import { useState } from 'react';
import { Modal, CurrencyInput } from '../../components';
import { Plus, FloppyDisk } from 'phosphor-react';
import { createServiceSchema, CreateServiceFormData } from '../../schemas/service';

interface ServiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: CreateServiceFormData) => void;
}

const DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '50 min', value: 50 },
  { label: '1h', value: 60 },
  { label: '1h 30min', value: 90 },
];

export default function ServiceCreateModal({ isOpen, onClose, onSave }: ServiceCreateModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Parse currency value to number
  const parseCurrency = (value: string) => {
    if (!value) return 0;
    
    // Convert raw numeric string to number (divide by 100 to get actual value)
    const number = parseInt(value) / 100;
    
    return number || 0;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handlePriceChange(value: string) {
    setForm(f => ({ ...f, price: value }));
    
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = createServiceSchema.parse({
        ...form,
        duration: Number(form.duration),
        price: parseCurrency(form.price), // Convert raw value to number
        user_id: 'temp',
        active: true
      });

      if (onSave) {
        await onSave(validatedData);
      }
      
      setForm({
        name: '',
        description: '',
        duration: '',
        price: '',
      });
      onClose();
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error.message || 'Erro ao salvar serviço' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Serviço" size="md">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <Plus size={20} /> Adicionar Novo Serviço
      </div>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Serviço *
          </label>
          <input
            name="name"
            type="text"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: Consulta de Fisioterapia"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descreva o serviço oferecido"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração *
          </label>
          <select
            name="duration"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              errors.duration ? 'border-red-300' : 'border-gray-300'
            }`}
            value={form.duration}
            onChange={handleChange}
          >
            <option value="">Selecione a duração</option>
            {DURATIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        <div>
          <CurrencyInput
            name="price"
            label="Preço"
            required
            value={form.price}
            onChange={handlePriceChange}
            error={!!errors.price}
            placeholder="R$ 0,00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FloppyDisk size={18} /> 
            {loading ? 'Salvando...' : 'Salvar Serviço'}
          </button>
        </div>
      </form>
    </Modal>
  );
}