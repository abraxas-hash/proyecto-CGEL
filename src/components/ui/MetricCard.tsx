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
    iconBg: 'bg-[#00d4ff]/10',
    iconHoverBg: 'group-hover:bg-[#00d4ff]/20',
    iconColor: 'text-[#00d4ff]'
  },
  purple: {
    cardBg: 'bg-purple-50 dark:bg-purple-500/5',
    cardBorder: 'border-purple-200 dark:border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/50',
    iconBg: 'bg-purple-500/10',
    iconHoverBg: 'group-hover:bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  green: {
    cardBg: 'bg-green-50 dark:bg-green-500/5',
    cardBorder: 'border-green-200 dark:border-green-500/20',
    hoverBorder: 'hover:border-green-500/50',
    iconBg: 'bg-green-500/10',
    iconHoverBg: 'group-hover:bg-green-500/20',
    iconColor: 'text-green-400'
  },
  orange: {
    cardBg: 'bg-orange-50 dark:bg-orange-500/5',
    cardBorder: 'border-orange-200 dark:border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/50',
    iconBg: 'bg-orange-500/10',
    iconHoverBg: 'group-hover:bg-orange-500/20',
    iconColor: 'text-orange-400'
  }
};

/**
 * MetricCard: Tarjeta de resumen de métricas.
 */
export default function MetricCard({ title, subtitle, value, Icon, colorTheme, href }: MetricCardProps) {
  const theme = colorStyles[colorTheme];

  return (
    <Link 
      href={href} 
      className={`block glass-panel ${theme.cardBg} ${theme.cardBorder} relative overflow-hidden p-4 sm:p-6 rounded-2xl ${theme.hoverBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 touch-manipulation cursor-pointer group min-h-[160px] flex flex-col justify-end text-center pt-8`}
    >
      {/* Clip Metálico Neumórfico */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 rounded-b-xl shadow-[0_4px_10px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] z-30 flex justify-center items-end pb-1.5">
        <div className="w-8 h-1.5 bg-black/10 dark:bg-black/40 rounded-full shadow-inner"></div>
        <div className="absolute -top-3 w-4 h-4 rounded-full border-4 border-gray-300 dark:border-gray-700 bg-transparent"></div>
      </div>

      {/* Capa de Papel Rayado */}
      <div 
        className="absolute inset-x-2 top-4 bottom-2 sm:inset-x-3 sm:top-5 sm:bottom-3 z-0 rounded-xl bg-white/40 dark:bg-[#0a0f18]/40 shadow-sm pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(100,116,139,0.15) 28px)',
        }}
      ></div>

      {/* Huge Background Icon */}
      <Icon 
        strokeWidth={1.5}
        className={`absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 ${theme.iconColor} opacity-[0.25] dark:opacity-[0.15] group-hover:scale-110 transition-transform duration-500 z-10`} 
      />
      
      {/* Foreground Content */}
      <div className="relative z-20 mt-auto pt-8 flex flex-col items-center">
        <span className="text-3xl sm:text-4xl font-black font-mono text-black dark:text-white drop-shadow-sm mb-1">{value}</span>
        <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white leading-tight">{title}</h2>
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 ${theme.iconColor} drop-shadow-sm`}>{subtitle}</p>
      </div>
    </Link>
  );
}
