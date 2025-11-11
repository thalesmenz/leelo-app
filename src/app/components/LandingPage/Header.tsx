'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { List, X } from 'phosphor-react';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white font-bold text-lg mr-2">
              L
            </div>
            <span className="font-bold text-xl text-gray-900">Leelo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Planos
            </a>
      
            <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold hover:from-green-400 hover:to-blue-500 transition-all shadow-lg"
            >
              Criar conta
            </Link>
  
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#pricing" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </a>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Criar conta
              </Link>
              {isAuthenticated && (
                <Link
                  href="/plans"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user?.name || 'Minha Conta'}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

