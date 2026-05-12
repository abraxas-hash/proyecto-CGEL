'use client';

import { useState, useMemo, useEffect } from 'react';
import { HardHat, Hammer, Search, ChevronDown, ChevronRight, Download, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ContratistasClient({ initialContratistas }: { initialContratistas: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

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

  // Grouping logic
  const groupedData = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredContratistas?.forEach(c => {
      if (!groups[c.fecha]) groups[c.fecha] = [];
      groups[c.fecha].push(c);
    });
    // Sort by date descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredContratistas]);

  // Auto-expand first group if searching
  useEffect(() => {
    if (searchTerm && groupedData.length > 0) {
      setExpandedDates({ [groupedData[0][0]]: true });
    }
  }, [searchTerm, groupedData]);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const handleExport = () => {
    if (!filteredContratistas || filteredContratistas.length === 0) return;
    const headers = ['FECHA', 'EMPRESA', 'RUC', 'TRABAJO', 'AREA', 'AUTORIZA', 'SCTR'];
    const BOM = '\uFEFF';
    const csvRows = filteredContratistas.map(c => [
      c.fecha, c.empresa_contratista, c.ruc, c.trabajo_realizar,
      c.area_trabajo, c.autorizado_por, c.sctr_vigente ? 'VIGENTE' : 'VENCIDO'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contratistas_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-4 sm:p-6 w-full relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <HardHat className="text-yellow-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none uppercase">Contratistas</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Personal Externo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar contratista..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-yellow-500/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all shadow-lg shadow-yellow-500/20"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {groupedData.map(([date, items]) => (
          <div key={date} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
            <button 
              onClick={() => toggleDate(date)}
              className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tighter">
                    {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{items.length} Contratistas hoy</p>
                </div>
              </div>
              {expandedDates[date] ? (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
              )}
            </button>

            {expandedDates[date] && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                {items.map((c) => (
                  <Link 
                    key={c.id} 
                    href={`/contratistas/${c.id}`}
                    className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-yellow-500/20 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full shadow-lg shadow-black/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                          <Hammer className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors uppercase leading-tight tracking-tighter">
                            {c.empresa_contratista}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-mono tracking-tighter">RUC: {c.ruc}</p>
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
                      <ArrowRight className="w-3 h-3 text-yellow-500/40 group-hover:text-yellow-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <HardHat className="w-16 h-16 text-gray-800 mb-4 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin coincidencias encontradas</p>
          </div>
        )}
      </div>
    </main>
  );
}
