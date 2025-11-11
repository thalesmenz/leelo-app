'use client';

import { House, Calendar, Users, CurrencyDollar, Gear, ClipboardText, UserPlus, X } from 'phosphor-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

function SidebarLink({ href, icon, children, active, onNavigate }: { href: string, icon: React.ReactNode, children: React.ReactNode, active: boolean, onNavigate?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onNavigate}
      className={`flex items-center px-4 py-2 rounded font-medium gap-3 text-gray-700 hover:bg-gray-100 transition ${active ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      {children}
    </Link>
  );
}

export default function SidebarMenu({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Verifica se o usuário é um subusuário
  const isSubuser = user?.is_subuser;

  // Fecha a sidebar no mobile quando navegar
  const handleNavigate = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col h-full lg:min-h-screen">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white font-bold text-lg mr-2">L</div>
          <span className="font-bold text-xl text-gray-800">Leelo</span>
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Fechar Menu"
          >
            <X size={24} />
          </button>
        ) : (
          <div className="lg:hidden w-10 h-10" />
        )}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <SidebarLink href="/dashboard" icon={<House size={24} weight="fill" />} active={pathname === '/dashboard'} onNavigate={handleNavigate}>Dashboard</SidebarLink>
        <SidebarLink href="/dashboard/agenda" icon={<Calendar size={24} />} active={pathname === '/dashboard/agenda'} onNavigate={handleNavigate}>Agenda</SidebarLink>
        <SidebarLink href="/dashboard/patients" icon={<Users size={24} />} active={pathname === '/dashboard/patients'} onNavigate={handleNavigate}>Pacientes</SidebarLink>
        <SidebarLink href="/dashboard/records" icon={<ClipboardText size={24} />} active={pathname === '/dashboard/records'} onNavigate={handleNavigate}>Prontuários</SidebarLink>
        <SidebarLink href="/dashboard/services" icon={<Gear size={24} />} active={pathname === '/dashboard/services'} onNavigate={handleNavigate}>Serviços</SidebarLink>
        <SidebarLink href="/dashboard/finance" icon={<CurrencyDollar size={24} />} active={pathname === '/dashboard/finance'} onNavigate={handleNavigate}>Financeiro</SidebarLink>
        
        {/* Apenas usuários principais podem acessar o módulo de fisioterapeutas */}
        {!isSubuser && (
          <SidebarLink href="/dashboard/subusers" icon={<UserPlus size={24} />} active={pathname === '/dashboard/subusers'} onNavigate={handleNavigate}>Fisioterapeutas</SidebarLink>
        )}
      </nav>
    </aside>
  );
} 