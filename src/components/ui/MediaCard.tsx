/**
 * Arquivo: MediaCard.tsx
 * Responsabilidade: card de mídia com vinheta escura, gradiente de contraste AA, filme grain e imagem discreta de fallback.
 * Dados: Seção 7 do briefing técnico
 * Como editar: ajuste a opacidade da vinheta ou do gradiente inferior conforme o contraste do conteúdo.
 */

import React, { useState } from 'react';
import { Card, CardProps } from './Card';

interface MediaCardProps extends Omit<CardProps, 'children'> {
  imageSrc?: string;
  imageAlt?: string;
  fallbackImageSrc?: string;
  fallbackVideoSrc?: string;
  priority?: boolean;
  aspectRatio?: 'auto' | '16/9' | '4/5' | '1/1' | '21/9';
  children: React.ReactNode;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  imageSrc,
  imageAlt = 'Mídia BROLABS TECH',
  fallbackImageSrc,
  fallbackVideoSrc,
  priority = false,
  aspectRatio = 'auto',
  children,
  className = '',
  ...cardProps
}) => {
  const [imageError, setImageError] = useState(false);

  const aspectStyle =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : '';

  return (
    <Card
      className={`group ${aspectStyle} ${className}`}
      hoverEffect
      {...cardProps}
    >
      {/* ===== [SEÇÃO: TRATAMENTO DE IMAGEM E FALLBACK] ===== */}
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center filter grayscale-[30%] contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D2D2D]/40 via-[#161616] to-[#080808]">
          {fallbackVideoSrc && (
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={fallbackVideoSrc} type="video/mp4" />
            </video>
          )}
          {fallbackImageSrc && (
            <img
              src={fallbackImageSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
            />
          )}
          <div className="absolute inset-0 pattern-dots opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(202,240,0,0.06),transparent_60%)]" />
        </div>
      )}

      {/* ===== [SEÇÃO: VINHETA PRETA NAS BORDAS] ===== */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(8, 8, 8, 0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ===== [SEÇÃO: GRADIENTE INFERIOR PARA CONTRASTE AA] ===== */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.65) 45%, rgba(8, 8, 8, 0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ===== [SEÇÃO: GRAIN / FILM NOISE OVERLAY] ===== */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-15 opacity-[0.035] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* ===== [SEÇÃO: CONTEÚDO DO CARD] ===== */}
      <div className="relative z-20 w-full h-full p-6 sm:p-8 flex flex-col justify-end">
        {children}
      </div>
    </Card>
  );
};
