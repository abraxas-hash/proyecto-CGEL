'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Truck, Search, ArrowRight, CheckCircle2, XCircle, ChevronDown, ChevronRight, HardHat, Calendar, Download } from 'lucide-react';
import Link from 'next/link';

import VisualCalendar from '@/components/ui/VisualCalendar';

export default function RepartidoresClient({ initialData }: { initialData: any[] }) {
  // Grouping logic for the calendar dots
  const availableDates = useMemo(() => {
    return Array.from(new Set(initialData?.map(row => row.fecha) || []));
  }, [initialData]);

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    if (availableDates.length > 0) {
      return [...availableDates].sort((a, b) => b.localeCompare(a))[0];
    }
    return null;
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return [];
    return initialData?.filter(row => row.fecha === selectedDate && (
      !searchTerm || 
      row.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.conductor_apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.empresa_abreviatura?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [initialData, selectedDate, searchTerm]);

  const handleExport = () => {
    if (!filteredByDate || filteredByDate.length === 0) return;
    const headers = ['FECHA', 'TURNO', 'EMPRESA', 'PLACA', 'CONDUCTOR', 'SCTR', 'EPP', 'ESTADO'];
    const BOM = '\uFEFF';
    const csvRows = filteredByDate.map(row => [
      row.fecha, row.turno, row.empresa_abreviatura, row.placa,
      row.conductor_apellido, row.sctr_ok ? 'OK' : 'PEND', row.epp_ok ? 'OK' : 'OBS',
      (!row.salida_1 || (row.entrada_2 && !row.salida_2)) ? 'PLANTA' : 'FINAL'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repartidores_${selectedDate}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Search & Export Header (STAY FIXED) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-white/5 pb-4 px-2 shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
            <Truck className="text-[#00d4ff] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none">REPARTIDORES</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Control diario</p>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="p-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-lg transition-all shadow-lg shadow-[#00d4ff]/20"
            title="Exportar fecha seleccionada"
            aria-label="Exportar fecha seleccionada a CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar: Visual Calendar (STAY FIXED) */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6 overflow-y-auto no-scrollbar">
          <VisualCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableDates={availableDates}
            accentColor="#00d4ff"
          />
          
          <div className="mt-6 hidden md:block">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Estadística del Día</span>
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Registros</span>
                <span className="text-xs text-white font-black">{filteredByDate.length}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-[#00d4ff] h-full" style={{ width: `${Math.min(filteredByDate.length * 5, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Record List (THE ONLY ONE SCROLLING) */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  Mostrando: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{filteredByDate.length} Registros</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredByDate.map((row) => {
                  const isEnPlanta = !row.salida_1 || (row.entrada_2 && !row.salida_2) || (row.entrada_3 && !row.salida_3);
                  const nCiclos = [row.entrada_1, row.entrada_2, row.entrada_3].filter(Boolean).length;
                  
                  return (
                    <Link 
                      key={row.id} 
                      href={`/repartidores/${row.id}`}
                      className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-[120px] sm:min-w-[150px]">
                        <div className={`w-8 h-8 rounded-lg ${isEnPlanta ? 'bg-cyan-500/10' : 'bg-gray-500/10'} flex items-center justify-center border border-white/5`}>
                          <Truck className={`w-4 h-4 ${isEnPlanta ? 'text-cyan-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-white leading-none uppercase">{row.empresa_abreviatura}</h4>
                          <p className="text-[9px] text-gray-500 font-mono mt-1">{row.placa}</p>
                        </div>
                      </div>

                      <div className="hidden sm:block flex-1 min-w-0">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Conductor</span>
                        <p className="text-[10px] text-gray-300 font-medium truncate capitalize">{row.conductor_apellido?.toLowerCase()}</p>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                         <div className="flex flex-col items-center">
                          <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Ciclos</span>
                          <div className="flex gap-1 items-center">
                            <span className="text-[10px] text-white font-bold">{nCiclos}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((n) => (
                                <div key={n} className={`w-1 h-1 rounded-full ${row[`entrada_${n}`] ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Docs</span>
                          <div className="flex gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${row.sctr_ok ? 'bg-green-500' : 'bg-red-500'}`} title="SCTR"></div>
                            <div className={`w-1.5 h-1.5 rounded-full ${row.epp_ok ? 'bg-green-500' : 'bg-red-500'}`} title="EPP"></div>
                          </div>
                        </div>

                        <div className="hidden md:flex flex-col items-end min-w-[80px]">
                          <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${isEnPlanta ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                            {isEnPlanta ? 'EN PLANTA' : 'FINALIZADO'}
                          </span>
                        </div>
                      </div>

                      <div className="ml-auto">
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
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
