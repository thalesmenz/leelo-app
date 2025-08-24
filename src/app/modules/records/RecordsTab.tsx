'use client';

import React, { useState, useEffect } from 'react';
import { Eye, PencilSimple, FileText, MagnifyingGlass, Plus } from 'phosphor-react';
import { showToast } from '@/app/utils/toast';

interface Record {
  id: string;
  patientName: string;
  patientId: string;
  lastVisit: string;
  nextVisit: string;
  treatment: string;
  status: 'Em Tratamento' | 'Concluído' | 'Aguardando';
  therapist: string;
  notes: string;
}

export default function RecordsTab() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRecords: Record[] = [
      {
        id: '1',
        patientName: 'Maria Silva',
        patientId: 'P001',
        lastVisit: '2024-01-15',
        nextVisit: '2024-01-22',
        treatment: 'Fisioterapia - Lombar',
        status: 'Em Tratamento',
        therapist: 'Dr. João Santos',
        notes: 'Paciente apresentou melhora significativa na dor lombar após 3 sessões.'
      },
      {
        id: '2',
        patientName: 'Carlos Oliveira',
        patientId: 'P002',
        lastVisit: '2024-01-10',
        nextVisit: '2024-01-17',
        treatment: 'Fisioterapia - Joelho',
        status: 'Em Tratamento',
        therapist: 'Dra. Ana Costa',
        notes: 'Recuperação pós-operatória do LCA. Paciente em fase de fortalecimento.'
      },
      {
        id: '3',
        patientName: 'Fernanda Lima',
        patientId: 'P003',
        lastVisit: '2024-01-08',
        nextVisit: '2024-01-15',
        treatment: 'Fisioterapia - Ombro',
        status: 'Concluído',
        therapist: 'Dr. Pedro Almeida',
        notes: 'Tratamento concluído com sucesso. Paciente liberado para atividades normais.'
      },
      {
        id: '4',
        patientName: 'Roberto Santos',
        patientId: 'P004',
        lastVisit: '2024-01-12',
        nextVisit: '2024-01-19',
        treatment: 'Fisioterapia - Coluna',
        status: 'Aguardando',
        therapist: 'Dra. Juliana Ferreira',
        notes: 'Aguardando resultado de exames para definir próximo protocolo.'
      }
    ];

    setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    setSearching(true);
    // Simular busca
    setTimeout(() => {
      setSearching(false);
      showToast.success('Busca realizada com sucesso');
    }, 1000);
  };

  const handleViewRecord = (record: Record) => {
    showToast.info(`Visualizando prontuário de ${record.patientName}`);
  };

  const handleEditRecord = (record: Record) => {
    showToast.info(`Editando prontuário de ${record.patientName}`);
  };

  const handleViewPatientRecord = (record: Record) => {
    showToast.info(`Abrindo prontuário completo de ${record.patientName}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Tratamento':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Concluído':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Aguardando':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <FileText size={24} /> Todos os Prontuários
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow transition-colors"
          onClick={() => showToast.info('Funcionalidade de novo prontuário em desenvolvimento')}
        >
          <Plus size={18} /> Novo Prontuário
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlass size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar prontuários por paciente ou tratamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full border border-gray-200 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <MagnifyingGlass size={18} />
          {searching ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>

      {/* Lista de Prontuários */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Carregando prontuários...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhum prontuário encontrado para a busca.' : 'Nenhum prontuário encontrado.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 px-2 border-b border-gray-200">Paciente</th>
                <th className="py-2 px-2 border-b border-gray-200">Última Consulta</th>
                <th className="py-2 px-2 border-b border-gray-200">Próxima Consulta</th>
                <th className="py-2 px-2 border-b border-gray-200">Tratamento</th>
                <th className="py-2 px-2 border-b border-gray-200">Fisioterapeuta</th>
                <th className="py-2 px-2 border-b border-gray-200">Status</th>
                <th className="py-2 px-2 border-b border-gray-200 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, idx) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className={`py-4 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    <div className="font-bold text-base">{record.patientName}</div>
                    <div className="text-xs text-gray-500">ID: {record.patientId}</div>
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    {formatDate(record.lastVisit)}
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    {formatDate(record.nextVisit)}
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    <div className="max-w-xs truncate" title={record.treatment}>
                      {record.treatment}
                    </div>
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    {record.therapist}
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className={`py-2 px-2${idx !== 0 ? ' border-t border-gray-200' : ''}`}>
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 border-2 border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:border-blue-600 font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                        onClick={() => handleViewRecord(record)}
                        title="Visualizar"
                      >
                        <Eye size={12} /> Ver
                      </button>
                      <button
                        className="px-3 py-1 border-2 border-green-500 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:border-green-600 font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                        onClick={() => handleEditRecord(record)}
                        title="Editar"
                      >
                        <PencilSimple size={12} /> Editar
                      </button>
                      <button
                        className="px-3 py-1 border-2 border-purple-500 bg-purple-500 text-white rounded-lg hover:bg-purple-600 hover:border-purple-600 font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                        onClick={() => handleViewPatientRecord(record)}
                        title="Prontuário"
                      >
                        <FileText size={12} /> Prontuário
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 