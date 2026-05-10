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
    <Link href={href} className={`block glass-panel p-4 sm:p-6 rounded-2xl ${theme.hoverBorder} transition-colors cursor-pointer group`}>
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        {/* Contenedor del ícono que reacciona al hover de la tarjeta principal (group-hover) */}
        <div className={`p-2 sm:p-3 rounded-lg ${theme.iconBg} ${theme.iconHoverBg} transition-colors`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.iconColor}`} />
        </div>
        <span className="text-xl sm:text-2xl font-bold font-mono text-white">{value}</span>
      </div>
      <h2 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h2>
      <p className="text-[10px] sm:text-sm text-gray-400 mt-1 leading-snug line-clamp-2 sm:line-clamp-1">{subtitle}</p>
    </Link>
  );
}
