'use client';

import { AlertTriangle, ShieldAlert, Construction, MoveRight, HardHat } from 'lucide-react';

export default function SafetyObservations() {
  const criticalObservations = [
    {
      id: 'OBS-13',
      title: 'Intersección Hombre-Máquina',
      description: 'Clientes civiles cruzan radio de acción de montacargas sin EPP.',
      risk: 'CRÍTICO MÁXIMO',
      action: 'Segregación física y vigía mandatorio.',
      icon: Construction
    },
    {
      id: 'OBS-14',
      title: 'Obstrucción de Vías de Emergencia',
      description: 'Estibas bloquean rutas de evacuación e INDECI.',
      risk: 'CRÍTICO MÁXIMO',
      action: 'Liberación inmediata de línea amarilla.',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      {criticalObservations.map((obs) => (
        <div key={obs.id} className="relative overflow-hidden group bg-red-950/20 border border-red-500/30 rounded-2xl p-4 sm:p-6 transition-all hover:bg-red-900/30 flex flex-col">
          <div className="absolute -right-4 -top-4 sm:-right-8 sm:-top-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <obs.icon className="w-16 h-16 sm:w-32 sm:h-32 text-red-500" />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-2 sm:mb-4 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <span className="text-[8px] sm:text-[10px] font-black text-red-400 uppercase tracking-widest sm:tracking-[0.3em] truncate">{obs.id}</span>
              </div>
              <span className="self-start xl:self-auto px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-[7px] sm:text-[8px] font-black rounded uppercase animate-pulse shrink-0">
                {obs.risk}
              </span>
            </div>

            <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2 leading-tight line-clamp-2 sm:line-clamp-none">{obs.title}</h3>
            <p className="text-[10px] sm:text-sm text-red-200/60 mb-3 sm:mb-4 leading-snug sm:leading-relaxed flex-1 line-clamp-3 sm:line-clamp-none">
              {obs.description}
            </p>

            <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-500/10 rounded-xl border border-red-500/10 mt-auto">
              <MoveRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-[8px] sm:text-[10px] font-bold text-red-300 uppercase tracking-wider leading-tight">
                Acción: {obs.action}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Tarjeta de Resumen de Riesgos */}
      <div className="col-span-2 glass-panel rounded-2xl p-4 sm:p-6 bg-orange-500/5 border-orange-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
              <HardHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white font-bold leading-tight">Estado General de Riesgos (Matriz IPERC)</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Total: 16 observaciones detectadas por CGEL Security</p>
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
