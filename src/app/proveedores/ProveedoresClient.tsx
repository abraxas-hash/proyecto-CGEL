'use client';

import { useState, useMemo, useEffect } from 'react';
import { Truck, Search, ChevronDown, ChevronRight, Calendar, HardHat, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import VisualCalendar from '@/components/ui/VisualCalendar';

export default function ProveedoresClient({ initialProveedores }: { initialProveedores: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Grouping logic for the calendar dots
  const availableDates = useMemo(() => {
    return Array.from(new Set(initialProveedores?.map(p => p.fecha) || []));
  }, [initialProveedores]);

  // Set initial selected date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const sorted = [...availableDates].sort((a, b) => b.localeCompare(a));
      setSelectedDate(sorted[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return [];
    return initialProveedores?.filter(p => p.fecha === selectedDate && (
      !searchTerm || 
      p.empresa_proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.conductor?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [initialProveedores, selectedDate, searchTerm]);

  const handleExport = () => {
    if (!filteredByDate || filteredByDate.length === 0) return;
    const headers = ['Fecha', 'Empresa', 'Placa', 'Conductor', 'SCTR', 'EPP'];
    const BOM = '\uFEFF';
    const csvRows = filteredByDate.map(item => [
      item.fecha, item.empresa_proveedor, item.placa, item.conductor,
      (item.sctr_salud && item.sctr_pension) ? 'OK' : 'X',
      item.epp_completo ? 'OK' : 'X'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `proveedores_${selectedDate}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full min-h-[600px] flex flex-col">
      {/* Search & Export Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2 border-b border-white/5 pb-4 px-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Truck className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none uppercase">Proveedores</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Carga Pesada</p>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-blue-400/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-black rounded-lg transition-all shadow-lg shadow-blue-500/20"
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
            accentColor="#3b82f6"
          />
          
          <div className="mt-6 hidden md:block">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest px-2 block mb-3">Calendario de Cargas</span>
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Camiones</span>
                <span className="text-xs text-white font-black">{filteredByDate.length}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${Math.min(filteredByDate.length * 15, 100)}%` }}></div>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  Mostrando: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{filteredByDate.length} Proveedores</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredByDate.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/proveedores/${item.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${!item.hora_salida ? 'bg-blue-500/10' : 'bg-gray-500/10'} flex items-center justify-center border border-white/5`}>
                        <Truck className={`w-4 h-4 ${!item.hora_salida ? 'text-blue-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white leading-none uppercase truncate max-w-[120px]">{item.empresa_proveedor}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">{item.placa}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Conductor</span>
                      <p className="text-[10px] text-gray-300 font-medium truncate capitalize">{item.conductor?.toLowerCase()}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Horario</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.hora_llegada?.slice(0,5)} — {item.hora_salida?.slice(0,5) || '--:--'}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-600 font-black uppercase mb-1">Docs</span>
                        <div className="flex gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${(item.sctr_salud && item.sctr_pension) ? 'bg-green-500' : 'bg-red-500'}`} title="SCTR"></div>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.epp_completo ? 'bg-green-500' : 'bg-red-500'}`} title="EPP"></div>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end min-w-[80px]">
                         <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${!item.hora_salida ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {!item.hora_salida ? 'EN PLANTA' : 'FINALIZADO'}
                        </span>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
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
  );
}
