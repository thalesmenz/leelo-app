import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { workScheduleService } from '../../services/workScheduleService';
import { useAuth } from '../../hooks/useAuth';

interface WorkScheduleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

interface DayConfig {
  active: boolean;
  start: string;
  end: string;
  hasLunch: boolean;
  lunchStart: string;
  lunchEnd: string;
}

const defaultDayConfig: DayConfig = {
  active: true,
  start: '08:00',
  end: '18:00',
  hasLunch: false,
  lunchStart: '12:00',
  lunchEnd: '13:00',
};

export default function WorkScheduleConfigModal({ isOpen, onClose }: WorkScheduleConfigModalProps) {
  const { userId } = useAuth();
  const [days, setDays] = useState<DayConfig[]>(
    weekDays.map(() => ({ ...defaultDayConfig }))
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Carregar dados existentes quando o modal abrir
  useEffect(() => {
    if (isOpen && userId) {
      loadExistingData();
    }
  }, [isOpen, userId]);

  const loadExistingData = async () => {
    if (!userId) return;
    
    setInitialLoading(true);
    try {
      const response = await workScheduleService.getAll(userId);
      if (response.success && response.data) {
        const existingSchedules = response.data;
        const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        
        // Mapear os dados existentes para o formato do estado
        const mappedDays = dayNames.map((dayName, idx) => {
          const existingDay = existingSchedules.find((s: any) => s.day_of_week === dayName);
          
          if (existingDay) {
            return {
              active: existingDay.is_active || false,
              start: existingDay.start_time || '08:00',
              end: existingDay.end_time || '18:00',
              hasLunch: existingDay.has_lunch_break || false,
              lunchStart: existingDay.lunch_start_time || '12:00',
              lunchEnd: existingDay.lunch_end_time || '13:00',
            };
          }
          
          // Se não existe configuração para este dia, usar padrão
          return { ...defaultDayConfig };
        });
        
        setDays(mappedDays);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações existentes:', error);
      // Em caso de erro, mantém os valores padrão
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (idx: number, field: keyof DayConfig, value: any) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      await workScheduleService.upsertMany(userId, days.map((d, idx) => ({
        is_active: d.active,
        start_time: d.start,
        end_time: d.end,
        has_lunch_break: d.hasLunch,
        lunch_start_time: d.hasLunch ? d.lunchStart : null,
        lunch_end_time: d.hasLunch ? d.lunchEnd : null,
        day_of_week: dayNames[idx],
        user_id: userId,
      })));
      alert('Configuração salva com sucesso!');
      onClose();
    } catch (err) {
      alert('Erro ao salvar configuração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuração por Dia da Semana" size="xl">
      <div className="mb-2 text-gray-600 text-sm">
        Configure horários, pausas e status individual para cada dia da semana
      </div>
      
      {initialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Carregando configurações...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4">
        {weekDays.map((day, idx) => (
          <div key={day} className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">{day}</span>
              {/* Switch Ativo */}
              <label className="flex items-center gap-2 select-none">
                <span className="text-sm">Ativo:</span>
                <button
                  type="button"
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${days[idx].active ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={() => handleChange(idx, 'active', !days[idx].active)}
                  aria-pressed={days[idx].active}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${days[idx].active ? 'translate-x-4' : ''}`}
                  />
                </button>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
                <input type="time" className="w-full border border-gray-200 rounded px-2 py-1" value={days[idx].start} onChange={e => handleChange(idx, 'start', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim</label>
                <input type="time" className="w-full border border-gray-200 rounded px-2 py-1" value={days[idx].end} onChange={e => handleChange(idx, 'end', e.target.value)} />
              </div>
            </div>
            {/* Switch Pausa Almoço */}
            <div className="mb-2">
              <label className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${days[idx].hasLunch ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={() => handleChange(idx, 'hasLunch', !days[idx].hasLunch)}
                  aria-pressed={days[idx].hasLunch}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${days[idx].hasLunch ? 'translate-x-4' : ''}`}
                  />
                </button>
                <span className="text-sm">Tem pausa no almoço?</span>
              </label>
            </div>
            {/* Inputs de almoço só aparecem se hasLunch for true */}
            {days[idx].hasLunch && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Início da Pausa</label>
                  <input type="time" className="w-full border border-gray-200 rounded px-2 py-1" value={days[idx].lunchStart} onChange={e => handleChange(idx, 'lunchStart', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fim da Pausa</label>
                  <input type="time" className="w-full border border-gray-200 rounded px-2 py-1" value={days[idx].lunchEnd} onChange={e => handleChange(idx, 'lunchEnd', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Botões de ação */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>
        </div>
      )}
    </Modal>
  );
} 