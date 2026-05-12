'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Truck, Search, ArrowRight, CheckCircle2, XCircle, ChevronDown, ChevronRight, HardHat, Calendar, Download } from 'lucide-react';
import Link from 'next/link';

export default function RepartidoresClient({ initialData }: { initialData: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Grouping logic for the sidebar
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(initialData?.map(row => row.fecha) || []));
    return dates.sort((a, b) => b.localeCompare(a));
  }, [initialData]);

  // Set initial selected date
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

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
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full min-h-[600px] flex flex-col">
      {/* Search & Export Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-white/5 pb-4 px-2">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-lg transition-all shadow-lg shadow-[#00d4ff]/20"
            title="Exportar fecha seleccionada"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-full overflow-hidden">
        {/* Left Sidebar: Dates */}
        <aside className="w-full md:w-56 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar gap-2 pb-2 md:pb-0 md:pr-2 border-b md:border-b-0 md:border-r border-white/5">
          <span className="hidden md:block text-[9px] text-gray-600 font-black uppercase tracking-widest mb-3 px-2">Calendario de Auditorías</span>
          {uniqueDates.map(date => {
            const dateObj = new Date(date + 'T00:00:00');
            const isActive = selectedDate === date;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all shrink-0 md:shrink ${
                  isActive 
                  ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/20 shadow-[0_0_15px_rgba(0,212,255,0.05)]' 
                  : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.05]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isActive ? 'bg-[#00d4ff] border-[#00d4ff] text-black' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase leading-none ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">
                    {dateObj.toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Content: Record List */}
        <div className="flex-1 overflow-y-auto min-h-0">
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
