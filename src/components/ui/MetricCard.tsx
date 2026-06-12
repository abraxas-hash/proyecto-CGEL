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
    hoverBorder: 'hover:border-[#00d4ff]/50',
    iconBg: 'bg-[#00d4ff]/10',
    iconHoverBg: 'group-hover:bg-[#00d4ff]/20',
    iconColor: 'text-[#00d4ff]'
  },
  purple: {
    hoverBorder: 'hover:border-purple-500/50',
    iconBg: 'bg-purple-500/10',
    iconHoverBg: 'group-hover:bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  green: {
    hoverBorder: 'hover:border-green-500/50',
    iconBg: 'bg-green-500/10',
    iconHoverBg: 'group-hover:bg-green-500/20',
    iconColor: 'text-green-400'
  },
  orange: {
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
    <Link href={href} className={`block glass-panel relative overflow-hidden p-4 sm:p-6 rounded-2xl ${theme.hoverBorder} transition-transform active:scale-95 touch-manipulation cursor-pointer group min-h-32 flex flex-col justify-end text-center`}>
      {/* Huge Background Icon */}
      <Icon 
        strokeWidth={1.5}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 ${theme.iconColor} opacity-[0.15] dark:opacity-[0.10] group-hover:scale-110 transition-transform duration-500`} 
      />
      
      {/* Foreground Content */}
      <div className="relative z-10 mt-auto pt-8 flex flex-col items-center">
        <span className="text-3xl sm:text-4xl font-black font-mono text-black dark:text-white drop-shadow-sm mb-2">{value}</span>
        <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white leading-tight">{title}</h2>
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 ${theme.iconColor} drop-shadow-sm`}>{subtitle}</p>
      </div>
    </Link>
  );
}
