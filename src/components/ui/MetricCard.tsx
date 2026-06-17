import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  Icon: LucideIcon;
  colorTheme: 'blue' | 'purple' | 'green' | 'orange';
  href: string;
}

const colorStyles = {
  blue: {
    iconColor: 'text-blue-500 dark:text-blue-400',
    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-300',
    borderColor: '!border-blue-500/40 dark:!border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.4)] dark:shadow-[0_0_20px_rgba(96,165,250,0.4)]'
  },
  purple: {
    iconColor: 'text-purple-500',
    hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    borderColor: '!border-purple-500/40 dark:!border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)] dark:shadow-[0_0_20px_rgba(192,132,252,0.4)]'
  },
  green: {
    iconColor: 'text-emerald-500',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    borderColor: '!border-emerald-500/40 dark:!border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:shadow-[0_0_20px_rgba(52,211,153,0.4)]'
  },
  orange: {
    iconColor: 'text-amber-500',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    borderColor: '!border-amber-500/40 dark:!border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.4)] dark:shadow-[0_0_20px_rgba(251,191,36,0.4)]'
  }
};

export default function MetricCard({ title, subtitle, value, Icon, colorTheme, href }: MetricCardProps) {
  const theme = colorStyles[colorTheme];

  return (
    <Link
      href={href}
      className={`glass-panel block relative p-4 sm:p-6 transition-all duration-300 group flex flex-col justify-end text-center active:scale-95 touch-manipulation hover:-translate-y-1 ${theme.borderColor}`}
      style={{
        minHeight: '165px',
        overflow: 'visible',
      }}
    >
      {/* Clip Metálico */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-[68px] h-[22px] rounded-b-[14px] z-30 flex justify-center items-end pb-[5px]"
        style={{
          background: 'linear-gradient(to bottom, #9ca3af, #4b5563)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
        }}
      >
        {/* Argolla metálica del clip */}
        <div
          className="absolute -top-3 w-5 h-5 rounded-full border-4 border-[#4b5563]"
          style={{
            background: 'linear-gradient(135deg, #d1d5db, #6b7280)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}
        />
        {/* Barra sujetadora */}
        <div className="w-[34px] h-[5px] bg-black/40 rounded-full" />
      </div>

      {/* Hoja de papel hundida con Neumorfismo (Inset) */}
      <div
        className="neumorphic-inset absolute inset-1 rounded-[16px] z-0 pointer-events-none overflow-hidden"
      >
        {/* Líneas del papel */}
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 26px, #64748b 27px)',
          }}
        />
        {/* Margen rojo tenue (Opcional para dar más realismo de cuaderno) */}
        <div className="absolute top-0 bottom-0 left-6 w-px bg-red-400/20 dark:bg-red-500/10" />
      </div>

      {/* Icono de fondo como marca de agua en alto relieve */}
      <Icon
        strokeWidth={2.5}
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 ${theme.iconColor} transition-all duration-500 opacity-40 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[2px_4px_4px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:opacity-60`}
        style={{ zIndex: 10, top: '55%' }}
      />

      {/* Contenido principal (sobre el papel) */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 20, marginTop: 'auto', paddingTop: '2.5rem' }}>
        <span className="text-4xl sm:text-5xl font-black font-mono text-slate-800 dark:text-slate-200 mb-1 tracking-tighter drop-shadow-sm">
          {value}
        </span>
        <h2 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 leading-tight">
          {title}
        </h2>
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 ${theme.iconColor}`}>
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

