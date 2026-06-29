'use client';

import dynamic from 'next/dynamic';
import { OperationalFunnel } from '@/components/dashboard/OperationalFunnel';
import { LineChart } from 'lucide-react';

const AnalyticsSection = dynamic(() => import('@/components/dashboard/AnalyticsSection'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center animate-pulse">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
        Cargando gráficas...
      </p>
    </div>
  ),
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

export default function AnaliticaClient({ data }: Props) {
  return (
    <div className="space-y-8">
      {/* Título de sección */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <LineChart className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest text-slate-800 dark:text-white">
            Analíticas Avanzadas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Inteligencia operativa · Flujos · Distribución · Tendencias
          </p>
        </div>
      </div>

      {/* Embudo de operaciones */}
      <OperationalFunnel />

      {/* Gráficas analíticas */}
      <AnalyticsSection data={data} />
    </div>
  );
}
