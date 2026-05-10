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
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {criticalObservations.map((obs) => (
        <div key={obs.id} className="relative overflow-hidden group bg-red-950/20 border border-red-500/30 rounded-2xl p-6 transition-all hover:bg-red-900/30">
          <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <obs.icon className="w-32 h-32 text-red-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">{obs.id}</span>
              </div>
              <span className="px-2 py-1 bg-red-500 text-white text-[8px] font-black rounded uppercase animate-pulse">
                {obs.risk}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{obs.title}</h3>
            <p className="text-sm text-red-200/60 mb-4 leading-relaxed">
              {obs.description}
            </p>

            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/10">
              <MoveRight className="w-4 h-4 text-red-400" />
              <p className="text-[10px] font-bold text-red-300 uppercase tracking-wider">
                Acción: {obs.action}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Tarjeta de Resumen de Riesgos */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 bg-orange-500/5 border-orange-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <HardHat className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-bold">Estado General de Riesgos (Matriz IPERC)</h4>
              <p className="text-xs text-gray-400">Total: 16 observaciones detectadas por CGEL Security</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-[9px] font-black border border-red-500/20">2 CRÍTICOS MÁXIMOS</div>
            <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[9px] font-black border border-orange-500/20">10 CRÍTICOS / ALTOS</div>
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-[9px] font-black border border-yellow-500/20">4 MEDIOS-ALTOS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
