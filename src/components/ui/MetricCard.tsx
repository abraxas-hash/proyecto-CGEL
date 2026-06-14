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
    accent: 'border-cyan-500 dark:border-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  },
  purple: {
    accent: 'border-purple-500 dark:border-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  green: {
    accent: 'border-emerald-500 dark:border-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  orange: {
    accent: 'border-amber-500 dark:border-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400'
  }
};

/**
 * MetricCard: Tarjeta de resumen de métricas — estilo monocromático oscuro funcional.
 */
export default function MetricCard({ title, subtitle, value, Icon, colorTheme, href }: MetricCardProps) {
  const theme = colorStyles[colorTheme];

  return (
    <Link
      href={href}
      className={`block relative overflow-hidden bg-white dark:bg-[#161b27] border border-gray-200 dark:border-white/[0.08] p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 touch-manipulation cursor-pointer group flex flex-col min-h-[140px]`}
    >
      {/* Acento semántico (borde superior) */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] border-t-2 ${theme.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] ${theme.iconColor}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <span className="text-3xl sm:text-4xl font-black font-mono text-gray-900 dark:text-white drop-shadow-sm">{value}</span>
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-2 ${theme.iconColor}`}>{subtitle}</p>
      </div>
      
      {/* Icono de fondo como marca de agua sutil */}
      <Icon
        strokeWidth={1}
        className={`absolute -bottom-6 -right-6 w-32 h-32 ${theme.iconColor} opacity-[0.04] dark:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0`}
      />
    </Link>
  );
}

