'use client';

import { useState, useMemo } from 'react';
import { HardHat, Hammer, CheckCircle2, XCircle, Search, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

export default function ContratistasClient({ initialContratistas }: { initialContratistas: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContratistas = useMemo(() => {
    return initialContratistas?.filter((c) => {
      const search = searchTerm.toLowerCase();
      return (
        c.empresa_contratista?.toLowerCase().includes(search) ||
        c.trabajo_realizar?.toLowerCase().includes(search) ||
        c.area_trabajo?.toLowerCase().includes(search) ||
        c.ruc?.toLowerCase().includes(search)
      );
    });
  }, [initialContratistas, searchTerm]);

  const handleExport = () => {
    if (!filteredContratistas || filteredContratistas.length === 0) return;
    const headers = ['FECHA', 'EMPRESA', 'RUC', 'TRABAJO', 'AREA', 'AUTORIZA', 'SCTR'];
    const BOM = '\uFEFF';
    const csvRows = filteredContratistas.map(c => [
      c.fecha,
      c.empresa_contratista,
      c.ruc,
      c.trabajo_realizar,
      c.area_trabajo,
      c.autorizado_por,
      c.sctr_vigente ? 'VIGENTE' : 'VENCIDO'
    ].map(field => `"${field}"`).join(','));

    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contratistas_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
            <HardHat className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
            Contratistas y Mantenimiento
          </h2>
          <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold">Control de servicios externos</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por Empresa o RUC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="w-full md:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl text-[10px] font-black transition-all shadow-lg shadow-yellow-500/20 shrink-0 uppercase tracking-widest h-9"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredContratistas?.map((c) => (
          <Link 
            key={c.id} 
            href={`/contratistas/${c.id}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-yellow-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-start md:items-center gap-5 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <Hammer className="w-7 h-7 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-500 transition-colors uppercase">{c.empresa_contratista}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">RUC: {c.ruc}</span>
                </div>
                <p className="text-sm text-gray-400 font-medium">{c.trabajo_realizar}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
                    Área: {c.area_trabajo}
                  </span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
                    Autoriza: {c.autorizado_por}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-6 md:mt-0">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">SCTR Vigente</span>
                {c.sctr_vigente ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Fecha</span>
                <span className="text-white font-mono text-[11px] font-bold uppercase text-right">
                  {new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                </span>
                <span className="text-gray-500 font-mono text-[10px]">{c.fecha}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-500 transition-colors group-hover:text-black text-gray-500">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
        {(!filteredContratistas || filteredContratistas.length === 0) && (
          <div className="py-20 text-center flex flex-col items-center">
            <HardHat className="w-16 h-16 text-gray-800 mb-4 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin coincidencias encontradas</p>
          </div>
        )}
      </div>
    </main>
  );
}
