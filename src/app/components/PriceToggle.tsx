interface PriceToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  onToggle: (period: 'monthly' | 'yearly') => void;
}

export const PriceToggle = ({ billingPeriod, onToggle }: PriceToggleProps) => {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
      <button
        onClick={() => onToggle('monthly')}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          billingPeriod === 'monthly'
            ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Mensal
      </button>
      <button
        onClick={() => onToggle('yearly')}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
          billingPeriod === 'yearly'
            ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span>Anual</span>
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -20%
        </span>
      </button>
    </div>
  );
};




