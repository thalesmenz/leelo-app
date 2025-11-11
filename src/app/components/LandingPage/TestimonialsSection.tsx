'use client';

import { Star, Quotes } from 'phosphor-react';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Dr. Maria Silva',
    role: 'Fisioterapeuta Autônoma',
    location: 'São Paulo, SP',
    content: 'O Leelo transformou completamente minha prática. Antes eu perdia horas organizando agenda e prontuários em papel. Agora tudo está digitalizado e organizado. O controle financeiro me ajudou a aumentar minha receita em 30%!',
    rating: 5
  },
  {
    name: 'Dr. Carlos Mendes',
    role: 'Diretor Clínico',
    location: 'Rio de Janeiro, RJ',
    content: 'Temos 5 fisioterapeutas na clínica e o Leelo facilitou demais a gestão. A agenda compartilhada e os relatórios consolidados são incríveis. Finalmente conseguimos ver o desempenho de toda a equipe em um só lugar.',
    rating: 5
  },
  {
    name: 'Dra. Ana Paula Costa',
    role: 'Fisioterapeuta e Proprietária',
    location: 'Belo Horizonte, MG',
    content: 'O prontuário eletrônico digital é perfeito! Está 100% conforme as regulamentações e eu não preciso mais me preocupar com papel. O sistema de anamnese personalizada é um diferencial incrível.',
    rating: 5
  },
  {
    name: 'Dr. João Santos',
    role: 'Fisioterapeuta',
    location: 'Curitiba, PR',
    content: 'A interface é muito intuitiva. Em menos de 1 hora já estava usando tudo. O dashboard financeiro me deu uma visão clara de onde estava ganhando e onde podia melhorar. Recomendo para todos!',
    rating: 5
  },
  {
    name: 'Dra. Fernanda Oliveira',
    role: 'Fisioterapeuta Autônoma',
    location: 'Porto Alegre, RS',
    content: 'Economizei tanto tempo que consegui aumentar o número de pacientes. O sistema de agendamento evita conflitos e a agenda compartilhada via QR Code é genial. Vale muito a pena!',
    rating: 5
  },
  {
    name: 'Dr. Roberto Alves',
    role: 'Proprietário de Clínica',
    location: 'Brasília, DF',
    content: 'Implementamos o Leelo em toda a rede e os resultados foram impressionantes. A gestão de equipe ficou muito mais fácil e os relatórios consolidados nos ajudam a tomar decisões estratégicas.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6">
            <Star size={20} className="text-green-600" weight="fill" />
            <span className="text-sm font-semibold text-green-700">O que nossos clientes dizem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Fisioterapeutas que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              transformaram suas clínicas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como o Leelo está ajudando profissionais a crescerem e se organizarem melhor
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quotes size={48} className="text-blue-500" weight="fill" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400" weight="fill" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Fisioterapeutas Ativos</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 font-medium">Avaliação Média</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
                98%
              </div>
              <div className="text-gray-600 font-medium">Recomendariam</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
                30%
              </div>
              <div className="text-gray-600 font-medium">Aumento Médio de Receita</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




