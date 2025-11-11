'use client';

import { useState, useEffect } from 'react';
import SidebarMenu from './SidebarMenu';
import { List, BellRinging } from 'phosphor-react';
import { UserMenu } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardSubscriptionModal from '../components/DashboardSubscriptionModal';
import { stripeService } from '../services/stripeService';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const { user, logout, logoutAllDevices } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsCheckingSubscription(true);
        const response = await stripeService.getSubscription();
        if (response.success && response.data) {
          const isActive = response.data.status === 'active' || response.data.status === 'trialing';
          setHasActiveSubscription(isActive);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:block">
        <SidebarMenu />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <SidebarMenu onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <List size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 hidden sm:block">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <BellRinging size={24} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <UserMenu
              userName={user?.name}
              userEmail={user?.email}
              onLogout={handleLogout}
              onLogoutAllDevices={handleLogoutAllDevices}
            />
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>

      {!isCheckingSubscription && <DashboardSubscriptionModal hasActiveSubscription={hasActiveSubscription === true} />}
    </div>
  );
}

