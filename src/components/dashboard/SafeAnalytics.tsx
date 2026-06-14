'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper seguro para AnalyticsSection.
 * Evita el error de SSR en Server Components al usar Recharts.
 */
const AnalyticsSection = dynamic(() => import('./AnalyticsSection'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-black/20 rounded-[32px] border border-slate-700 animate-pulse">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando Inteligencia Operativa...</p>
    </div>
  )
});

export default AnalyticsSection;
