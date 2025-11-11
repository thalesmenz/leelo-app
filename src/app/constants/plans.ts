import { Calendar, FileText, CurrencyDollar, ClipboardText, ChartLine, Envelope, Users, Gear, ShieldCheck, ChartBar } from 'phosphor-react';

export interface PlanFeature {
  icon: any;
  text: string;
}

export interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  price_monthly: string;
  price_yearly: string;
  description: string;
  recommended: boolean;
  features: PlanFeature[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    name: 'Individual',
    monthlyPrice: 99,
    yearlyPrice: 990,
    price_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY || '',
    price_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_YEARLY || '',
    description: 'Para fisioterapeutas autônomos',
    recommended: false,
    features: [
      { icon: Calendar, text: 'Agenda inteligente com calendário visual' },
      { icon: Users, text: 'Cadastro e gestão completa de pacientes' },
      { icon: FileText, text: 'Prontuário eletrônico digital (PEP)' },
      { icon: ClipboardText, text: 'Anamnese digital personalizada' },
      { icon: Gear, text: 'Gestão de serviços e tratamentos' },
      { icon: ChartLine, text: 'Controle financeiro completo' },
      { icon: CurrencyDollar, text: 'Contas a receber e pagar' },
      { icon: FileText, text: 'Transações e relatórios financeiros' },
      { icon: ChartBar, text: 'Dashboard com métricas em tempo real' },
      { icon: Envelope, text: 'Suporte técnico especializado' },
    ],
    cta: 'Começar agora',
  },
  {
    name: 'Plus',
    monthlyPrice: 147,
    yearlyPrice: 1470,
    price_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_MONTHLY || '',
    price_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_YEARLY || '',
    description: 'Para clínicas em crescimento',
    recommended: true,
    features: [
      { icon: Calendar, text: 'Agenda inteligente com calendário visual' },
      { icon: Users, text: 'Cadastro e gestão completa de pacientes' },
      { icon: FileText, text: 'Prontuário eletrônico digital (PEP)' },
      { icon: ClipboardText, text: 'Anamnese digital personalizada' },
      { icon: Gear, text: 'Gestão de serviços e tratamentos' },
      { icon: ChartLine, text: 'Controle financeiro completo' },
      { icon: CurrencyDollar, text: 'Contas a receber e pagar' },
      { icon: FileText, text: 'Transações e relatórios financeiros' },
      { icon: ChartBar, text: 'Dashboard com métricas em tempo real' },
      { icon: Envelope, text: 'Suporte técnico especializado' },
      { icon: Users, text: 'Gerenciamento de equipe de fisioterapeutas' },
      { icon: ChartLine, text: 'Visão consolidada de relatórios financeiros' },
      { icon: CurrencyDollar, text: 'Controle financeiro por fisioterapeuta' },
      { icon: Calendar, text: 'Agenda compartilhada entre membros da equipe' },
      { icon: ChartBar, text: 'Dashboard consolidado com métricas da equipe' },
      { icon: ShieldCheck, text: 'Suporte prioritário e dedicado' },
    ],
    cta: 'Começar agora',
  },
];

export const ENTERPRISE_PLAN = {
  name: 'Enterprise',
  monthlyPrice: 299,
  yearlyPrice: 2990,
  description: 'Ideal para clínicas grandes, redes e franquias que precisam de flexibilidade total.',
};


