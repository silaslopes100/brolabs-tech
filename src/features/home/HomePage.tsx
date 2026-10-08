/**
 * Arquivo: HomePage.tsx
 * Responsabilidade: página principal unificada com a narrativa institucional completa da BROLABS TECH.
 * Ordem das seções: Hero → Manifesto → Serviços → Projetos Destaque → Processo → Sobre → Contato.
 */

import React, { useState } from 'react';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Services } from './sections/Services';
import { FeaturedProjects } from './sections/FeaturedProjects';
import { Process } from './sections/Process';
import { About } from './sections/About';
import { Contact } from './sections/Contact';

export const HomePage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('Sistemas & SaaS');

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 01. Hero com Bento Grid [REF-B] e selo do frasco */}
      <Hero onSelectService={handleSelectService} />

      {/* 02. Faixa do Manifesto com animação marquee suave */}
      <Manifesto />

      {/* 03. Seção Serviços com Bento Grid [REF-A] e 6 cards com MediaCard */}
      <Services onSelectService={handleSelectService} />

      {/* 04. Projetos em Destaque (dinâmico da API; auto-oculta se vazio) */}
      <FeaturedProjects />

      {/* 05. Como Trabalhamos (Processo em 4 etapas com numerais verdes) */}
      <Process />

      {/* 06. Sobre nós / Fundadores (Silas Lopes e Marcos Sena) */}
      <About />

      {/* 07. Contato / CTA Final com formulário e LGPD */}
      <Contact initialService={selectedService} />
    </div>
  );
};
