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
    <div className="space-y-4">
      {/* Encabezado de sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <LineChart className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
              Analíticas Avanzadas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Embudo · Performance · Mix de seguridad · Mapa de calor
            </p>
          </div>
        </div>

        {/* Botón separado */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-400 hover:text-purple-300 text-xs font-bold uppercase tracking-widest transition-all duration-200"
        >
          <span>{isOpen ? 'Ocultar' : 'Ver gráficas'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Contenido expandible */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-6 space-y-8">
          <OperationalFunnel />
          <AnalyticsSection data={data} />
        </div>
      </div>
    </div>
  );
}
