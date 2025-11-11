'use client';

import { Calendar, Users, FileText, ClipboardText, Gear, ChartLine, CurrencyDollar, ChartBar, Envelope, ShieldCheck, UserPlus, QrCode } from 'phosphor-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Calendário visual interativo com verificação automática de conflitos. Compartilhe sua agenda com QR Code.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Users,
    title: 'Gestão de Pacientes',
    description: 'Cadastro completo com histórico de atendimentos, planos de tratamento personalizados e estatísticas.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: FileText,
    title: 'Prontuário Eletrônico (PEP)',
    description: 'Prontuário digital conforme regulamentações da área da saúde. Totalmente seguro e organizado.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: ClipboardText,
    title: 'Anamnese Digital',
    description: 'Crie questionários personalizados de anamnese. Configure conforme sua prática clínica.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: Gear,
    title: 'Gestão de Serviços',
    description: 'Cadastre serviços, defina duração e valores. Associe aos pacientes facilmente.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: ChartLine,
    title: 'Controle Financeiro',
    description: 'Contas a receber e pagar, transações, relatórios e gráficos de desempenho em tempo real.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: ChartBar,
    title: 'Dashboard Inteligente',
    description: 'Métricas e indicadores importantes em um só lugar. Receitas, pacientes, agendamentos e muito mais.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: UserPlus,
    title: 'Gestão de Equipe',
    description: 'Gerencie múltiplos fisioterapeutas, agenda compartilhada e visão consolidada.',
    color: 'from-pink-500 to-pink-600'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tudo que você precisa em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              uma única plataforma
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramentas desenvolvidas especialmente para fisioterapeutas. Simples, completo e eficiente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA no final */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            E muito mais recursos para transformar sua prática clínica
          </p>
          <a
            href="/plans"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold text-lg hover:from-green-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos os planos
          </a>
        </div>
      </div>
    </section>
  );
}




