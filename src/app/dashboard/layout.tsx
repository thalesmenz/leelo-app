'use client';

import SidebarMenu from './SidebarMenu';
import { Users, Bell, SignOut, User, List } from 'phosphor-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    router.push('/login');
  };


  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden hidden lg:block`}>
        <SidebarMenu onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <SidebarMenu onClose={() => setSidebarOpen(false)} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col h-screen">
        {/* Header global do dashboard */}
        <header className="flex items-center justify-between bg-white h-20 px-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Botão para abrir sidebar - só aparece quando sidebar está fechada */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Abrir Menu"
              >
                <List size={20} />
              </button>
            )}
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <span className="text-gray-500 text-sm">
                Bem-vindo de volta, {user?.name || 'Usuário'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
      
      {/* Overlay para fechar o sidebar em mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 