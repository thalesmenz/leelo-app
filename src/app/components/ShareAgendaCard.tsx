'use client';

import { useState } from 'react';
import { Calendar, Copy, Check, Share, Users } from 'phosphor-react';

interface ShareAgendaCardProps {
  userId: string;
  className?: string;
  variant?: 'compact' | 'full';
}

export default function ShareAgendaCard({ userId, className = '', variant = 'full' }: ShareAgendaCardProps) {
  const [copied, setCopied] = useState(false);
  
  const agendaUrl = `${window.location.origin}/agenda/${userId}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(agendaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = agendaUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Agende sua consulta',
          text: 'Clique no link para agendar sua consulta online:',
          url: agendaUrl,
        });
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Olá! Agende sua consulta online através deste link: ${agendaUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">Agenda Pública</h4>
            <p className="text-xs text-gray-500">Compartilhe com seus pacientes</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={agendaUrl}
            readOnly
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono"
          />
          <button
            onClick={handleCopyLink}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Share size={14} />
            Compartilhar
          </button>
          
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
          >
            <Users size={14} />
            WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Calendar size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Compartilhar Agenda Pública</h3>
          <p className="text-sm text-gray-600">Seus pacientes podem agendar consultas online através deste link</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Link da Agenda:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={agendaUrl}
            readOnly
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Share size={18} />
          Compartilhar
        </button>
        
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Users size={18} />
          WhatsApp
        </button>
      </div>
    </div>
  );
}


