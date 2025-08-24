'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, PencilSimple, Clock, CurrencyDollar, DotsThree } from 'phosphor-react';
import ServiceCreateModal from '../../modules/services/ServiceCreateModal';
import { userServiceService } from '../../services/userServiceService';
import { showToast } from '../../utils/toast';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);

  const loadServices = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await userServiceService.getByUserId(userId);
        setServices(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setServices([]);
      }
    } catch (error) {
      setServices([]);
      showToast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenuIdx !== null) {
        const menuElement = document.getElementById(`menu-${openMenuIdx}`);
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuIdx(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIdx]);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  async function handleSaveService(data: any) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showToast.error('Usuário não identificado');
        return;
      }

      await userServiceService.create({
        ...data,
        user_id: userId,
        price: parseFloat(data.price)
      });

      showToast.success('Serviço criado com sucesso!');
      handleCloseModal();
      loadServices(); // Recarregar a lista
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao criar serviço');
    }
  }

  async function handleToggleStatus(service: any) {
    try {
      await userServiceService.toggleStatus(service.id);
      showToast.success('Status do serviço atualizado!');
      loadServices(); // Recarregar a lista
      setOpenMenuIdx(null);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao atualizar status');
    }
  }

  async function handleDeleteService(service: any) {
    try {
      await userServiceService.deleteById(service.id);
      showToast.success('Serviço removido com sucesso!');
      loadServices(); // Recarregar a lista
      setOpenMenuIdx(null);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao remover serviço');
    }
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span className="inline-block"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19.93 11H21a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 19.93V21a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 4.07 13H3a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 4.07V3a1 1 0 0 1 1-1Zm0 4a5 5 0 1 0 0 10A5 5 0 0 0 12 6Z" fill="#2563eb"/></svg></span>
              Serviços
            </h1>
            <span className="text-gray-500 text-sm">Gerencie os serviços oferecidos</span>
          </div>
          <button 
            onClick={handleOpenModal}
            className="bg-gradient-to-r flex items-center gap-2 from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400 text-white px-4 py-2 rounded font-semibold shadow transition-colors"
          >
            <Plus size={18} /> Adicionar Serviço
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">Carregando serviços...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500 mb-4">Nenhum serviço encontrado</div>
              <button 
                onClick={handleOpenModal}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Adicionar primeiro serviço
              </button>
            </div>
          ) : (
            services.map((service, index) => (
              <div key={service.id} className="bg-white rounded-xl border border-gray-200 shadow p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg text-gray-900">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuIdx(openMenuIdx === index ? null : index)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <DotsThree size={20} />
                      </button>
                      {openMenuIdx === index && (
                        <div
                          id={`menu-${index}`}
                          className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                        >
                          <button
                            onClick={() => handleToggleStatus(service)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            {service.active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => handleDeleteService(service)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm mb-2">{service.description || 'Sem descrição'}</div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock size={16} /> {service.duration} min
                  </span>
                  <span className="flex items-center gap-1 text-green-700 font-bold text-base">
                    <CurrencyDollar size={16} /> R$ {service.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ServiceCreateModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveService}
      />
    </div>
  );
} 