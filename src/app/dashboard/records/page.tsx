'use client';

import { useState } from 'react';
import { Plus, MagnifyingGlass, Funnel, ClipboardText } from 'phosphor-react';
import { MedicalRecordsTab, AnamneseTab } from '../../modules/records';

const tabs = [
  'Todos os Prontuários',
  'Anamnese',
];

export default function RecordsPage() {
  const [tab, setTab] = useState('Todos os Prontuários');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'Todos os Prontuários':
        return <MedicalRecordsTab />;
      case 'Anamnese':
        return <AnamneseTab />;
      default:
        return <MedicalRecordsTab />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
              <span className="text-blue-600">
                <ClipboardText size={24} className="sm:w-7 sm:h-7" weight="fill" />
              </span>
              Prontuários
            </h1>
            <p className="text-sm sm:text-base text-gray-500">Gerencie os prontuários dos seus pacientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full mb-4 sm:mb-6 lg:mb-8 gap-2 overflow-x-auto pb-2">
          {tabs.map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`flex-1 sm:flex-none min-w-[140px] py-2 px-3 sm:px-4 rounded font-semibold text-sm sm:text-base transition-colors border whitespace-nowrap
                ${tab === tabName
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 hover:text-blue-700'}
              `}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
} 