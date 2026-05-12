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
    <main className="glass-panel rounded-2xl p-4 sm:p-6 w-full relative overflow-hidden">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-4 border-b border-white/[0.05] shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <HardHat className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                CONTRATISTAS
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Gestión de Personal Externo</p>
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
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl text-xs font-black transition-all shadow-lg shadow-yellow-500/10 uppercase tracking-widest"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredContratistas?.map((c) => (
          <Link 
            key={c.id} 
            href={`/contratistas/${c.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-yellow-500/20 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <Hammer className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors uppercase leading-tight tracking-tighter">
                    {c.empresa_contratista}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">RUC: {c.ruc}</p>
                </div>
              </div>
              <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${c.sctr_vigente ? 'bg-green-500/5 border-green-500/10 text-green-500/60' : 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'}`}>
                {c.sctr_vigente ? 'SCTR OK' : 'SIN SCTR'}
              </span>
            </div>

            <div className="py-3 border-y border-white/[0.03] mb-3">
              <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Trabajo</span>
              <p className="text-[10px] text-gray-300 font-medium line-clamp-1 italic">{c.trabajo_realizar}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Área</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{c.area_trabajo}</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Fecha</span>
                <span className="text-[10px] text-yellow-500 font-mono font-black">{c.fecha}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
