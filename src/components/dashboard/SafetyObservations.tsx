'use client';

import { AlertTriangle, ShieldAlert, Construction, MoveRight, HardHat } from 'lucide-react';

export default function SafetyObservations() {
  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      
      {/* Tarjeta de Resumen de Riesgos */}
      <div className="col-span-2 glass-panel rounded-2xl p-4 sm:p-6 bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
              <HardHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-orange-900 dark:text-white">Estado General de Riesgos (Matriz IPERC)</h2>
              <p className="text-[10px] sm:text-xs text-orange-800/70 dark:text-gray-400 mt-0.5">Total: 16 observaciones detectadas por el Sistema</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 md:mt-0">
            <div className="px-2 sm:px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-[8px] sm:text-[9px] font-black border border-red-500/20">2 CRÍTICOS MÁXIMOS</div>
            <div className="px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[8px] sm:text-[9px] font-black border border-orange-500/20">10 CRÍTICOS / ALTOS</div>
            <div className="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-[8px] sm:text-[9px] font-black border border-yellow-500/20">4 MEDIOS-ALTOS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
