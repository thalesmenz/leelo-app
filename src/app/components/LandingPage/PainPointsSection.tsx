'use client';

import { X, CheckCircle } from 'phosphor-react';

interface PainPoint {
  problem: string;
  solution: string;
  icon: string;
}

const painPoints: PainPoint[] = [
  {
    problem: 'Agenda desorganizada em planilhas e papel',
    solution: 'Agenda digital inteligente com calendário visual e verificação automática de conflitos',
    icon: '📅'
  },
  {
    problem: 'Prontuários em papel que se perdem ou ficam ilegíveis',
    solution: 'Prontuário eletrônico digital (PEP) 100% digital, seguro e conforme regulamentações',
    icon: '📋'
  },
  {
    problem: 'Controle financeiro manual em Excel ou papel',
    solution: 'Sistema financeiro completo com relatórios automáticos e gráficos em tempo real',
    icon: '💰'
  },
  {
    problem: 'Dificuldade para gerenciar equipe de fisioterapeutas',
    solution: 'Gestão completa de equipe com agenda compartilhada e visão consolidada (planos Plus/Enterprise)',
    icon: '👥'
  },
  {
    problem: 'Perda de tempo com processos manuais',
    solution: 'Automatize tudo e foque no que importa: cuidar dos seus pacientes',
    icon: '⏱️'
  },
  {
    problem: 'Dificuldade para acompanhar histórico de pacientes',
    solution: 'Histórico completo e organizado de todos os atendimentos e evoluções',
    icon: '📊'
  },
  {
    problem: 'Anamnese demorada e desorganizada',
    solution: 'Anamnese digital personalizada com questionários configuráveis',
    icon: '📝'
  },
  {
    problem: 'Sem visão clara do desempenho do negócio',
    solution: 'Dashboard com métricas em tempo real: receitas, pacientes, agendamentos e muito mais',
    icon: '📈'
  }
];

export default function PainPointsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
            <X size={20} className="text-red-600" weight="bold" />
            <span className="text-sm font-semibold text-red-700">Problemas que você NÃO precisa mais ter</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cansado de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              perder tempo e dinheiro
            </span>
            {' '}com gestão manual?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Se você se identifica com algum desses problemas, o Leelo foi feito para você
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                {/* Ícone do problema */}
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  {point.icon}
                </div>
                
                <div className="flex-1">
                  {/* Problema */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <X size={18} className="text-red-600" weight="bold" />
                      <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Problema</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{point.problem}</p>
                  </div>

                  {/* Solução */}
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={18} className="text-green-600" weight="fill" />
                      <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Solução Leelo</span>
                    </div>
                    <p className="text-gray-800 font-medium">{point.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Pare de perder tempo e dinheiro
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            O Leelo resolve todos esses problemas e muito mais. 
            Comece hoje mesmo e transforme sua prática clínica.
          </p>
          <a
            href="/plans"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold text-lg hover:from-green-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Resolver esses problemas agora
          </a>
        </div>
      </div>
    </section>
  );
}




