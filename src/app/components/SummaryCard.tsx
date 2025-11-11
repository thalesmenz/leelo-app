export default function SummaryCard({ title, value, variation, icon, variationColor, valueColor }: { title: string, value: string, variation: string, icon?: React.ReactNode, variationColor?: string, valueColor?: string }) {
  return (
    <div className="bg-white rounded shadow p-4 sm:p-5 flex flex-col gap-2">
      <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">{icon}{title}</span>
      <span className={`text-xl sm:text-2xl font-bold ${valueColor || 'text-gray-900'}`}>{value}</span>
      <span className={`${variationColor || 'text-green-600'} text-xs font-semibold`}>{variation}</span>
    </div>
  );
} 