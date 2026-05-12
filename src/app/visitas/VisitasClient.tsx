'use client';

import { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, UserX, Search, ChevronDown, ChevronRight, Calendar, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import VisualCalendar from '@/components/ui/VisualCalendar';

export default function VisitasClient({ initialVisitas }: { initialVisitas: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Grouping logic for the calendar dots
  const availableDates = useMemo(() => {
    return Array.from(new Set(initialVisitas?.map(v => v.fecha) || []));
  }, [initialVisitas]);

  // Set initial selected date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const sorted = [...availableDates].sort((a, b) => b.localeCompare(a));
      setSelectedDate(sorted[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return [];
    return initialVisitas?.filter(v => v.fecha === selectedDate && (
      !searchTerm || 
      v.nombre_apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.area_visita?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.dni_ce?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [initialVisitas, selectedDate, searchTerm]);

  const handleExport = () => {
    if (!filteredByDate || filteredByDate.length === 0) return;
    const headers = ['FECHA', 'NOMBRE', 'DOCUMENTO', 'EMPRESA', 'AREA', 'MOTIVO', 'SCTR'];
    const BOM = '\uFEFF';
    const csvRows = filteredByDate.map(v => [
      v.fecha, v.nombre_apellido, v.dni_ce, v.empresa_proviene,
      v.area_visita, v.motivo_visita, v.sctr_vigente ? 'VIGENTE' : 'VENCIDO'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visitas_${selectedDate}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full min-h-[600px] flex flex-col">
      {/* Search & Export Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-white/5 pb-4 px-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <UserCheck className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none uppercase">Visitas</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Control de Accesos</p>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-orange-500/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all shadow-lg shadow-orange-500/20"
            title="Exportar fecha seleccionada"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-full">
        {/* Left Sidebar: Visual Calendar */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
          <VisualCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableDates={availableDates}
            accentColor="#f97316"
          />
          
          <div className="mt-6 hidden md:block">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Registros de Hoy</span>
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Personas</span>
                <span className="text-xs text-white font-black">{filteredByDate.length}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: `${Math.min(filteredByDate.length * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Record List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Mostrando: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{filteredByDate.length} Visitas</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredByDate.map((v) => (
                  <Link 
                    key={v.id} 
                    href={`/visitas/${v.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${!v.pase_devuelto_salida ? 'bg-green-500/10' : 'bg-gray-500/10'} flex items-center justify-center border border-white/5`}>
                        <UserCheck className={`w-4 h-4 ${!v.pase_devuelto_salida ? 'text-green-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white leading-none uppercase truncate max-w-[120px]">{v.nombre_completo}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">{v.dni_ce}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Empresa</span>
                      <p className="text-[10px] text-gray-300 font-medium truncate uppercase">{v.empresa || 'PARTICULAR'}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Horario</span>
                        <span className="text-[10px] text-gray-400 font-mono">{v.hora_ingreso?.slice(0,5)} — {v.hora_salida?.slice(0,5) || '--:--'}</span>
                      </div>

                      <div className="hidden md:flex flex-col items-end min-w-[80px]">
                         <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${!v.pase_devuelto_salida ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {!v.pase_devuelto_salida ? 'ACTIVO' : 'FINALIZADO'}
                        </span>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredByDate.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UserX className="w-10 h-10 text-gray-700 opacity-20" />
              </div>
              <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin visitas para esta fecha</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
