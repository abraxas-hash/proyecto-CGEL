'use client';

import { useState, useMemo, useEffect } from 'react';
import { HardHat, Hammer, Search, ChevronDown, ChevronRight, Download, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import VisualCalendar from '@/components/ui/VisualCalendar';

export default function ContratistasClient({ initialContratistas }: { initialContratistas: any[] }) {
  // Grouping logic for the calendar dots
  const availableDates = useMemo(() => {
    return Array.from(new Set(initialContratistas?.map(c => c.fecha) || []));
  }, [initialContratistas]);

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    if (availableDates.length > 0) {
      return [...availableDates].sort((a, b) => b.localeCompare(a))[0];
    }
    return null;
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return [];
    return initialContratistas?.filter(c => c.fecha === selectedDate && (
      !searchTerm || 
      c.empresa_contratista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trabajo_realizar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ruc?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [initialContratistas, selectedDate, searchTerm]);

  const handleExport = () => {
    if (!filteredByDate || filteredByDate.length === 0) return;
    const headers = ['FECHA', 'EMPRESA', 'RUC', 'TRABAJO', 'AREA', 'AUTORIZA', 'SCTR'];
    const BOM = '\uFEFF';
    const csvRows = filteredByDate.map(c => [
      c.fecha, c.empresa_contratista, c.ruc, c.trabajo_realizar,
      c.area_trabajo, c.autorizado_por, c.sctr_vigente ? 'VIGENTE' : 'VENCIDO'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contratistas_${selectedDate}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Search & Export Header (STAY FIXED) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-slate-700 pb-4 px-2 shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <HardHat className="text-yellow-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-none uppercase">Contratistas</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Personal Externo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar en la fecha..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar en la fecha"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500/50 transition-all"
            />
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all shadow-lg shadow-yellow-500/20"
            title="Exportar fecha seleccionada"
            aria-label="Exportar fecha seleccionada a CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar: Visual Calendar (STAY FIXED) */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-6 overflow-y-auto no-scrollbar">
          <VisualCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableDates={availableDates}
            accentColor="#eab308"
          />
          
          <div className="mt-6 hidden md:block">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Historial de Obras</span>
            <div className="bg-white/[0.02] rounded-xl p-3 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Total Empresas</span>
                <span className="text-xs text-slate-800 dark:text-white font-black">{filteredByDate.length}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: `${Math.min(filteredByDate.length * 8, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Record List (THE ONLY ONE SCROLLING) */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                  Mostrando: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{filteredByDate.length} Contratistas</span>
              </div>

              <div className="bg-white/[0.02] border border-slate-700 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredByDate.map((c) => (
                  <Link 
                    key={c.id} 
                    href={`/contratistas/${c.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${c.sctr_vigente ? 'bg-yellow-500/10' : 'bg-red-500/10'} flex items-center justify-center border border-slate-700`}>
                        <Hammer className={`w-4 h-4 ${c.sctr_vigente ? 'text-yellow-500' : 'text-red-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-none uppercase truncate max-w-[120px]">{c.empresa_contratista}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">RUC: {c.ruc}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Actividad</span>
                      <p className="text-[10px] text-slate-600 dark:text-gray-300 font-medium truncate italic line-clamp-1">{c.trabajo_realizar}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Área</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">{c.area_trabajo}</span>
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
            </div>
          )}

          {filteredByDate.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <HardHat className="w-10 h-10 text-gray-700 opacity-20" />
              </div>
              <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin registros para esta fecha</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
