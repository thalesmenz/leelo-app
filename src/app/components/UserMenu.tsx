import { useState } from 'react';
import { User, SignOut } from 'phosphor-react';

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  onLogoutAllDevices: () => void;
}

export const UserMenu = ({ userName, userEmail, onLogout, onLogoutAllDevices }: UserMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className="hidden md:block text-sm font-medium">{userName}</span>
          <User size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <SignOut size={16} />
              Sair
            </button>
            
            <button
              onClick={onLogoutAllDevices}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              Sair de todos os dispositivos
            </button>
          </div>
        )}
      </div>
      
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};




