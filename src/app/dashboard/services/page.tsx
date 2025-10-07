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
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                {/* Header com status */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {service.description || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        service.active 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {service.active ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuIdx(openMenuIdx === index ? null : index)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <DotsThree size={18} className="text-gray-500" />
                        </button>
                        {openMenuIdx === index && (
                          <div
                            id={`menu-${index}`}
                            className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-[140px]"
                          >
                            <button
                              onClick={() => handleToggleStatus(service)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                            >
                              {service.active ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              onClick={() => handleDeleteService(service)}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer com informações */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock size={16} className="text-gray-400" />
                      <span className="font-medium">{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyDollar size={16} className="text-green-600" />
                      <span className="text-green-700 font-bold text-lg">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(service.price)}
                      </span>
                    </div>
                  </div>
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