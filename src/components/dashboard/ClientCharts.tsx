'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper para cargar los gráficos de Recharts sin SSR.
 * Esto es necesario porque Recharts utiliza APIs del navegador 
 * que no están disponibles durante el renderizado estático de Next.js.
 */
const DashboardCharts = dynamic(() => import('./DashboardCharts'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-white/[0.02] rounded-3xl border border-slate-700 animate-pulse">
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Cargando Inteligencia Operativa...</p>
    </div>
  )
});

export default DashboardCharts;
