import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

/**
 * Interface que define las propiedades que necesita la tarjeta.
 */
interface MetricCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  Icon: LucideIcon;
  colorTheme: 'blue' | 'purple' | 'green' | 'orange';
  href: string;
}

/**
 * Diccionarios de estilos basados en el colorTheme
 */
const colorStyles = {
  blue: {
    cardBg: 'bg-blue-50 dark:bg-[#00d4ff]/5',
    cardBorder: 'border-blue-200 dark:border-[#00d4ff]/20',
    hoverBorder: 'hover:border-[#00d4ff]/50',
    iconColor: 'text-[#00d4ff]'
  },
  purple: {
    cardBg: 'bg-purple-50 dark:bg-purple-500/5',
    cardBorder: 'border-purple-200 dark:border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/50',
    iconColor: 'text-purple-400'
  },
  green: {
    cardBg: 'bg-green-50 dark:bg-green-500/5',
    cardBorder: 'border-green-200 dark:border-green-500/20',
    hoverBorder: 'hover:border-green-500/50',
    iconColor: 'text-green-400'
  },
  orange: {
    cardBg: 'bg-orange-50 dark:bg-orange-500/5',
    cardBorder: 'border-orange-200 dark:border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/50',
    iconColor: 'text-orange-400'
  }
};

/**
 * MetricCard: Tarjeta de resumen de métricas — estilo tablero de apuntes.
 */
export default function MetricCard({ title, subtitle, value, Icon, colorTheme, href }: MetricCardProps) {
  const theme = colorStyles[colorTheme];

  return (
    <Link
      href={href}
      className={`block glass-panel ${theme.cardBg} ${theme.cardBorder} relative p-4 sm:p-6 rounded-2xl ${theme.hoverBorder} transition-all duration-300 active:scale-95 touch-manipulation cursor-pointer group flex flex-col justify-end text-center`}
      style={{
        minHeight: '165px',
        overflow: 'visible',
        paddingTop: '2.5rem',
      }}
    >
      {/* Clip Metálico — 100% inline styles para sobrevivir al purge de Tailwind */}
      <div
        style={{
          position: 'absolute',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '68px',
          height: '22px',
          background: 'linear-gradient(to bottom, #e5e7eb, #9ca3af)',
          borderRadius: '0 0 14px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.85)',
          zIndex: 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '5px',
        }}
      >
        {/* Argolla metálica del clip */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '4px solid #9ca3af',
            background: 'linear-gradient(135deg, #f3f4f6, #d1d5db)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        />
        {/* Barra sujetadora */}
        <div
          style={{
            width: '34px',
            height: '5px',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: '9999px',
          }}
        />
      </div>

      {/* Hoja de papel rayada — inline styles */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.32)',
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 26px, rgba(100,116,139,0.2) 27px)',
          boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.6)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Icono de fondo como marca de agua */}
      <Icon
        strokeWidth={1.5}
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 ${theme.iconColor} group-hover:scale-110 transition-transform duration-500`}
        style={{ opacity: 0.22, zIndex: 10, top: '58%' }}
      />

      {/* Contenido principal */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 20, marginTop: 'auto', paddingTop: '1.5rem' }}>
        <span className="text-3xl sm:text-4xl font-black font-mono text-black dark:text-white drop-shadow-sm mb-1">{value}</span>
        <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white leading-tight">{title}</h2>
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 ${theme.iconColor} drop-shadow-sm`}>{subtitle}</p>
      </div>
    </Link>
  );
}
