'use client';

import SidebarMenu from './SidebarMenu';
import { Users, Bell, SignOut, User } from 'phosphor-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, logoutAllDevices } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
  };

  const handleNewAppointment = () => {
    router.push('/dashboard/agenda');
  };

  const handleAddPatient = () => {
    router.push('/dashboard/patients');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarMenu />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header global do dashboard */}
        <header className="flex items-center justify-between bg-white h-20 px-8 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <span className="text-gray-500 text-sm">
              Bem-vindo de volta, {user?.name || 'Usuário'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNewAppointment}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400 text-white px-4 py-2 rounded font-semibold shadow transition-colors"
            >
              Novo Agendamento
            </button>
            <button 
              onClick={handleAddPatient}
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded font-semibold"
            >
              Adicionar Paciente
            </button>
          
            
            {/* Menu do usuário */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                <User size={16} />
              </button>

              {/* Dropdown do usuário */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <SignOut size={16} />
                    Sair
                  </button>
                  
                  <button
                    onClick={handleLogoutAllDevices}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Users size={16} />
                    Sair de todos os dispositivos
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {children}
      </div>
      
      {/* Overlay para fechar o menu quando clicar fora */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
} 