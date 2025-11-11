'use client';

import { CheckCircle, Clock, ShieldCheck, TrendUp, Users, Lightning } from 'phosphor-react';

interface Benefit {
  icon: any;
  title: string;
  description: string;
}

const benefits = [
  {
    icon: Clock,
    title: 'Economize Tempo',
    description: 'Automatize processos manuais e foque no que realmente importa: cuidar dos seus pacientes.'
  },
  {
    icon: ShieldCheck,
    title: '100% Seguro',
    description: 'Dados protegidos e criptografados. Prontuários conforme regulamentações da área da saúde.'
  },
  {
    icon: TrendUp,
    title: 'Aumente sua Receita',
    description: 'Tenha controle total sobre suas finanças. Veja onde está ganhando e onde pode melhorar.'
  },
  {
    icon: Users,
    title: 'Escale sua Clínica',
    description: 'Gerencie equipes inteiras. Perfeito para clínicas em crescimento e redes de fisioterapia.'
  },
  {
    icon: Lightning,
    title: 'Interface Intuitiva',
    description: 'Design moderno e fácil de usar. Sem necessidade de treinamento extensivo.'
  },
  {
    icon: CheckCircle,
    title: 'Conformidade Total',
    description: 'Prontuário eletrônico digital (PEP) conforme todas as regulamentações brasileiras.'
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Por que escolher o{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              Leelo?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mais do que um software, uma solução completa para transformar sua prática clínica
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center mb-6">
                  <Icon size={32} className="text-white" weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              100%
            </div>
            <div className="text-gray-600 font-medium">Conformidade</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              24/7
            </div>
            <div className="text-gray-600 font-medium">Suporte</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              7 dias
            </div>
            <div className="text-gray-600 font-medium">Teste Grátis</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              0
            </div>
            <div className="text-gray-600 font-medium">Cartão Necessário</div>
          </div>
        </div>
      </div>
    </section>
  );
}

