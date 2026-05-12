'use client';

import { useState, useMemo, useEffect } from 'react';
import { HardHat, Hammer, Search, ChevronDown, ChevronRight, Download, Calendar, ArrowRight } from 'lucide-react';
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
              <div className="bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300 divide-y divide-white/5">
                {items.map((c) => (
                  <Link 
                    key={c.id} 
                    href={`/contratistas/${c.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    {/* Icon & Empresa */}
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${c.sctr_vigente ? 'bg-yellow-500/10' : 'bg-red-500/10'} flex items-center justify-center border border-white/5`}>
                        <Hammer className={`w-4 h-4 ${c.sctr_vigente ? 'text-yellow-500' : 'text-red-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white leading-none uppercase truncate max-w-[120px]">{c.empresa_contratista}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">RUC: {c.ruc}</p>
                      </div>
                    </div>

                    {/* Trabajo - Hidden on small screens */}
                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Actividad</span>
                      <p className="text-[10px] text-gray-300 font-medium truncate italic line-clamp-1">{c.trabajo_realizar}</p>
                    </div>

                    {/* Area & SCTR */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Área</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{c.area_trabajo}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">SCTR</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.sctr_vigente ? 'bg-green-500' : 'bg-red-500'}`} title="SCTR"></div>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all" />
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
