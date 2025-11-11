import { Warning } from 'phosphor-react';

interface PriceWarningProps {
  warnings: string[];
}

export const PriceWarning = ({ warnings }: PriceWarningProps) => {
  if (warnings.length === 0 || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Warning size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" weight="fill" />
        <div>
          <p className="font-semibold text-yellow-800 mb-1">
            ⚠️ Price IDs não configurados
          </p>
          <p className="text-sm text-yellow-700 mb-2">
            Os seguintes planos não possuem Price IDs configurados nas variáveis de ambiente:
          </p>
          <ul className="text-xs text-yellow-600 list-disc list-inside">
            {warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};




