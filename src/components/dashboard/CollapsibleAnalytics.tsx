'use client';

import { useState } from 'react';
import { ChevronDown, LineChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import { OperationalFunnel } from './OperationalFunnel';

const AnalyticsSection = dynamic(() => import('./AnalyticsSection'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center animate-pulse">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
        Cargando gráficas...
      </p>
    </div>
  )
});

interface Props {
  data: {
    distribution: { name: string; value: number }[];
    hourly: { hour: string; total: number }[];
    weekly: { day: string; total: number }[];
    counts: {
      repartidores: number;
      visitas: number;
      proveedores: number;
      contratistas: number;
    };
  };
}

export function CollapsibleAnalytics({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-black/20 backdrop-blur-sm overflow-hidden shadow-sm">
      {/* Header clicable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <LineChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-white">Analíticas Avanzadas</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Embudo de operaciones · Performance operativo · Mix de seguridad · Mapa de calor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 hidden sm:block">
            {isOpen ? 'Ocultar' : 'Ver gráficas'}
          </span>
          <div className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </button>

      {/* Contenido colapsable */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-8">
          <OperationalFunnel />
          <AnalyticsSection data={data} />
        </div>
      </div>
    </div>
  );
}
