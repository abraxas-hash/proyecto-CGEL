'use client';

import { useState, useMemo, useEffect } from 'react';
import { HardHat, Hammer, CheckCircle2, XCircle, Search, ChevronRight, X, Download, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function ContratistasClient({ initialContratistas }: { initialContratistas: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-scroll to top when searching
  useEffect(() => {
    if (searchTerm) {
      window.scrollTo(0, 0);
    }
  }, [searchTerm]);

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
    <main className="soft-hud-panel p-4 sm:p-8 w-full border border-white/5 relative overflow-hidden group">
      {/* Decorative Gradient Spheres */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00d4ff]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#00d4ff]/20 transition-all duration-1000"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-1000"></div>

      <div className="sticky top-0 z-30 bg-[#0a0a0a]/40 backdrop-blur-2xl -mx-4 sm:-mx-8 px-4 sm:px-8 py-6 mb-6 border-b border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl cgel-gradient flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <HardHat className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter cgel-glow-cyan">
                CONTRATISTAS
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Gestión de Personal Externo</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar contratista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#151515]/50 neumorph-inset border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30 transition-all"
              />
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 text-sm font-bold transition-all soft-button"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-widest font-black">Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        {filteredContratistas?.map((c) => (
          <Link 
            key={c.id} 
            href={`/contratistas/${c.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.06] hover:border-[#00d4ff]/30 transition-all duration-500 shadow-xl overflow-hidden"
          >
            {/* Hover Accent Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#00d4ff]/10 group-hover:border-[#00d4ff]/20 transition-all duration-500">
                <Hammer className="w-8 h-8 text-gray-500 group-hover:text-[#00d4ff] group-hover:scale-110 transition-all duration-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-white group-hover:text-[#00d4ff] transition-colors uppercase tracking-tighter leading-tight">{c.empresa_contratista}</h3>
                  <div className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                    <span className="text-[9px] text-gray-500 font-mono tracking-widest">RUC: {c.ruc}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium line-clamp-1">{c.trabajo_realizar}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Área: {c.area_trabajo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.5)]"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Autoriza: {c.autorizado_por}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10 mt-8 md:mt-0 relative z-10 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest opacity-60">SCTR Vigente</span>
                {c.sctr_vigente ? (
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest opacity-60">Registro Diario</span>
                <span className="text-white font-mono text-sm font-bold uppercase tracking-tight">
                  {new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                </span>
                <span className="text-[#00d4ff] font-mono text-xs font-black tracking-[0.2em]">{c.fecha}</span>
              </div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-500 group-hover:text-black text-gray-500">
                <ChevronRight className="w-8 h-8" />
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
