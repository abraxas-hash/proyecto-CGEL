'use client';

import { useState, useMemo, useEffect } from 'react';
import { Flame, Search, ChevronDown, ChevronRight, Calendar, HardHat, Download, ArrowRight, History, X } from 'lucide-react';
import Link from 'next/link';
import { exportToExcel } from '@/lib/excelHelper';
import { FileText, Camera } from 'lucide-react';

import VisualCalendar from '@/components/ui/VisualCalendar';

export default function GasClient({ initialGas, fichasDiarias }: { initialGas: any[], fichasDiarias?: any[] }) {
  // Grouping logic for the calendar dots
  const availableDates = useMemo(() => {
    return Array.from(new Set(initialGas?.map(p => p.fecha) || []));
  }, [initialGas]);

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    if (availableDates.length > 0) {
      return [...availableDates].sort((a, b) => b.localeCompare(a))[0];
    }
    return null;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return [];
    return initialGas?.filter(p => p.fecha === selectedDate && (
      !searchTerm || 
      p.empresa_proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.conductor?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [initialGas, selectedDate, searchTerm]);

  const handleExport = () => {
    if (!filteredByDate || filteredByDate.length === 0) return;
    const exportData = filteredByDate.map(item => ({
      'Fecha': item.fecha,
      'Empresa': item.empresa_proveedor,
      'Placa': item.placa,
      'Conductor': item.conductor,
      'Llenos (Ingreso)': (() => { try { const o = typeof item.observaciones === 'string' ? JSON.parse(item.observaciones) : item.observaciones; return o?.detalles_gas?.llenos_ingreso || 0; } catch { return 0; } })(),
      'Vacíos (Salida)': (() => { try { const o = typeof item.observaciones === 'string' ? JSON.parse(item.observaciones) : item.observaciones; return o?.detalles_gas?.vacios_salida || 0; } catch { return 0; } })()
    }));
    exportToExcel(exportData, `Gas Montacarga_${selectedDate}`, 'Gas Montacarga');
  };

  const fichaForDate = useMemo(() => {
    if (!selectedDate || !fichasDiarias) return null;
    return fichasDiarias.find(f => {
      if (f.fecha !== selectedDate) return false;
      try {
        const obs = typeof f.observaciones === 'string' ? JSON.parse(f.observaciones) : f.observaciones;
        return obs && obs.tipo === 'Gas Montacarga';
      } catch {
        return false;
      }
    });
  }, [selectedDate, fichasDiarias]);

  const [showFichaModal, setShowFichaModal] = useState(false);

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Search & Export Header (STAY FIXED) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-slate-700 pb-4 px-2 shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Flame className="text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-none uppercase">Gas Montacarga</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Control de Intercambio</p>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-slate-800 dark:text-white focus:outline-none focus:border-orange-400/50 transition-all"
            />
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="p-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-all shadow-lg shadow-orange-500/20"
            title="Exportar fecha seleccionada"
            aria-label="Exportar fecha seleccionada a CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar: Visual Calendar (STAY FIXED) */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-slate-700 pb-24 md:pb-0 md:pr-6 overflow-y-auto no-scrollbar">
          <VisualCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableDates={availableDates}
            accentColor="#3b82f6"
          />
          
          <div className="mt-6 hidden md:block">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Calendario de Cargas</span>
            <div className="bg-white/[0.02] rounded-xl p-3 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Total Camiones</span>
                <span className="text-xs text-slate-800 dark:text-white font-black">{filteredByDate.length}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: `${Math.min(filteredByDate.length * 15, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Ficha Diaria Card */}
          <div className="mt-6">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Evidencia del Día</span>
            <div 
              onClick={() => fichaForDate && setShowFichaModal(true)}
              className={`${fichaForDate ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 cursor-pointer' : 'bg-slate-800/20 border-slate-700/50 cursor-not-allowed opacity-60'} border rounded-xl p-4 flex flex-col items-center justify-center transition-all group`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform ${fichaForDate ? 'bg-purple-500/20 group-hover:scale-110' : 'bg-slate-800'}`}>
                <FileText className={`w-6 h-6 ${fichaForDate ? 'text-purple-400' : 'text-slate-500'}`} />
              </div>
              <span className={`text-sm font-black uppercase ${fichaForDate ? 'text-purple-300' : 'text-slate-500'}`}>Ficha Diaria</span>
              <span className={`text-[10px] font-bold mt-1 uppercase flex items-center gap-1 ${fichaForDate ? 'text-purple-500' : 'text-slate-600'}`}>
                {fichaForDate ? <><Camera className="w-3 h-3" /> Ver Foto Físicas</> : 'Sin Evidencia'}
              </span>
            </div>
          </div>

        </aside>

        {/* Botón flotante FIJO en la parte inferior del contenedor móvil */}
        <div className="absolute bottom-4 left-2 right-2 md:hidden z-20 pointer-events-none">
          <button 
            type="button"
            onClick={() => setShowMobileList(true)}
            className="w-full py-4 bg-orange-600/90 border border-orange-400/50 text-white font-black tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(59,130,246,0.3)] backdrop-blur-xl pointer-events-auto"
          >
            <History className="w-5 h-5" />
            Ver Historial ({filteredByDate.length})
          </button>
        </div>

        {/* Right Content: Record List (THE ONLY ONE SCROLLING) */}
        {/* En móvil, se convierte en un bottom-sheet translúcido */}
        <div className={`
          flex-1 min-h-0 custom-scrollbar flex flex-col
          md:relative md:translate-y-0 md:bg-transparent md:p-0 md:border-none md:shadow-none md:z-auto md:h-auto md:overflow-y-auto md:pr-2
          ${showMobileList 
            ? 'fixed inset-x-0 bottom-0 h-[85vh] z-[100] bg-[#050505]/95 backdrop-blur-2xl p-4 sm:p-6 rounded-t-[2rem] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] border-t border-white/10 transition-transform duration-400 translate-y-0 overflow-hidden' 
            : 'fixed inset-x-0 bottom-0 h-[85vh] z-[100] bg-[#050505]/95 backdrop-blur-2xl p-4 sm:p-6 rounded-t-[2rem] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] border-t border-white/10 transition-transform duration-400 translate-y-[150%]'
          }
        `}>
          
          {/* Header Móvil del Botton Sheet */}
          <div className="md:hidden flex justify-between items-center mb-6 shrink-0 px-2">
            <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
               {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Sin Fecha'}
            </h3>
            <button 
              type="button"
              onClick={() => setShowMobileList(false)}
              className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {selectedDate && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="hidden md:flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                  Mostrando: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{filteredByDate.length} Gas Montacarga</span>
              </div>

              <div className="bg-white/[0.02] border border-slate-700 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredByDate.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/gas/${item.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${!item.hora_salida ? 'bg-orange-500/10' : 'bg-gray-500/10'} flex items-center justify-center border border-slate-700`}>
                        <Flame className={`w-4 h-4 ${!item.hora_salida ? 'text-orange-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-none uppercase truncate max-w-[120px]">{item.empresa_proveedor}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">{item.placa}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Conductor</span>
                      <p className="text-[10px] text-slate-600 dark:text-gray-300 font-medium truncate capitalize">{item.conductor?.toLowerCase()}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Llegada</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">{item.hora_llegada?.slice(0,5) || '--:--'}</span>
                      </div>
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Salida</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">{item.hora_salida?.slice(0,5) || '--:--'}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Balones</span>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-green-500" title="Llenos (Ingresan)">+{(() => {
                            try { const o = typeof item.observaciones === 'string' ? JSON.parse(item.observaciones) : item.observaciones; return o?.detalles_gas?.llenos_ingreso || 0; } catch { return 0; }
                          })()}</span>
                          <span className="text-[10px] font-bold text-red-500" title="Vacíos (Salen)">-{(() => {
                            try { const o = typeof item.observaciones === 'string' ? JSON.parse(item.observaciones) : item.observaciones; return o?.detalles_gas?.vacios_salida || 0; } catch { return 0; }
                          })()}</span>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end min-w-[80px]">
                         <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${!item.hora_salida ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {!item.hora_salida ? 'EN PLANTA' : 'FINALIZADO'}
                        </span>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
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
      </div>

      {showFichaModal && fichaForDate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700">
            <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Ficha Física: Gas Montacarga ({selectedDate})
              </h3>
              <button onClick={() => setShowFichaModal(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center">
              <img src={fichaForDate.url_foto} alt="Ficha Diaria" className="max-w-full rounded-xl shadow-lg border border-slate-700" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


