'use client';

import { useState, useEffect } from 'react';
import { Monitor } from 'phosphor-react';

export default function DesktopOnly({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Verifica na montagem
    checkWidth();

    // Adiciona listener para mudanças de tamanho
    window.addEventListener('resize', checkWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Não renderiza nada até montar (evita mismatch no SSR)
  if (!mounted) {
    return null;
  }

  // Se não for desktop, mostra a tela de "apenas desktop"
  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Monitor size={40} className="text-white" weight="duotone" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Versão Desktop Apenas
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Esta aplicação foi projetada para funcionar em computadores desktop. 
            Por favor, acesse através de um dispositivo com tela maior.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Requisito mínimo:</strong> Largura de tela de 1024px ou superior
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">
              📱 Em breve teremos um app mobile disponível!
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            Largura atual: <span className="font-mono font-semibold text-gray-700">{typeof window !== 'undefined' ? window.innerWidth : 0}px</span>
          </div>
        </div>
      </div>
    );
  }

  // Se for desktop, renderiza o conteúdo normalmente
  return <>{children}</>;
}
