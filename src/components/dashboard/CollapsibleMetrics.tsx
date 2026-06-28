'use client';

import { useState } from 'react';
import { ChevronDown, BarChart3 } from 'lucide-react';
import { DashboardMetrics } from './DashboardMetrics';

interface Props {
  counts: {
    repartidores: number;
    visitas: number;
    proveedores: number;
    contratistas: number;
  };
}

export function CollapsibleMetrics({ counts }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const total = counts.repartidores + counts.visitas + counts.proveedores + counts.contratistas;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-black/20 backdrop-blur-sm overflow-hidden shadow-sm">
      {/* Header clicable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-white">Resumen de Accesos</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} registros totales · {counts.repartidores} repartidores · {counts.visitas} visitas · {counts.proveedores} proveedores · {counts.contratistas} contratistas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 hidden sm:block">
            {isOpen ? 'Ocultar' : 'Ver detalle'}
          </span>
          <div className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </button>

      {/* Contenido colapsable */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 pt-5">
          <DashboardMetrics counts={counts} />
        </div>
      </div>
    </div>
  );
}
