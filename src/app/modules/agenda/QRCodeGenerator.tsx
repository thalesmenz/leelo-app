'use client';

import React, { useState } from 'react';
import { QrCode, Download, Share } from 'phosphor-react';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
}

export default function QRCodeGenerator({ url, title = 'Agenda Pública' }: QRCodeGeneratorProps) {
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    // Usar uma API externa para gerar QR Code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    // Criar um link de download
    const link = document.createElement('a');
    link.href = qrApiUrl;
    link.download = `${title}-QRCode.png`;
    link.click();
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Acesse minha agenda para agendar uma consulta:',
          url: url
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <QrCode size={20} />
          {showQR ? 'Ocultar' : 'Mostrar'} QR Code
        </button>
        
        {showQR && (
          <>
            <button
              onClick={generateQRCode}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              Baixar QR Code
            </button>
            
            <button
              onClick={shareQRCode}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Share size={20} />
              Compartilhar
            </button>
          </>
        )}
      </div>

      {showQR && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">QR Code da Agenda</h4>
            <p className="text-sm text-gray-600">
              Compartilhe este QR Code para que clientes possam acessar sua agenda diretamente
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 inline-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
              alt="QR Code da Agenda"
              className="w-48 h-48"
            />
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Escaneie com a câmera do seu celular</p>
            <p>ou compartilhe o link diretamente</p>
          </div>
        </div>
      )}
    </div>
  );
}






