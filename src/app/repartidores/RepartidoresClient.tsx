'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Truck, Search, ArrowRight, CheckCircle2, XCircle, ChevronDown, ChevronRight, HardHat, Calendar, Download } from 'lucide-react';
import Link from 'next/link';

export default function RepartidoresClient({ initialData }: { initialData: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  // Auto-scroll to top on search
  useEffect(() => {
    if (searchTerm) {
      window.scrollTo(0, 0);
    }
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return initialData?.filter((row) => {
      const search = searchTerm.toLowerCase();
      return (
        row.placa?.toLowerCase().includes(search) ||
        row.conductor_apellido?.toLowerCase().includes(search) ||
        row.empresa_abreviatura?.toLowerCase().includes(search)
      );
    });
  }, [initialData, searchTerm]);

  // Grouping logic
  const groupedData = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredData?.forEach(row => {
      if (!groups[row.fecha]) groups[row.fecha] = [];
      groups[row.fecha].push(row);
    });
    // Sort by date descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredData]);

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
    if (!filteredData || filteredData.length === 0) return;
    const headers = ['FECHA', 'TURNO', 'EMPRESA', 'PLACA', 'CONDUCTOR', 'SCTR', 'EPP', 'ESTADO'];
    const BOM = '\uFEFF';
    const csvRows = filteredData.map(row => [
      row.fecha,
      row.turno,
      row.empresa_abreviatura,
      row.placa,
      row.conductor_apellido,
      row.sctr_ok ? 'OK' : 'PEND',
      row.epp_ok ? 'OK' : 'OBS',
      (!row.salida_1 || (row.entrada_2 && !row.salida_2)) ? 'PLANTA' : 'FINAL'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repartidores_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-2 sm:p-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2">
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
              placeholder="Placa o empresa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-lg transition-all shadow-lg shadow-[#00d4ff]/20"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-2 sm:px-0">
        {groupedData.map(([date, items]) => (
          <div key={date} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
            <button 
              onClick={() => toggleDate(date)}
              className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                  <Calendar className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tighter">
                    {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{items.length} Registros encontrados</p>
                </div>
              </div>
              {expandedDates[date] ? (
                <ChevronDown className="w-5 h-5 text-[#00d4ff]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
              )}
            </button>

            {expandedDates[date] && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                {items.map((row) => {
                  const isEnPlanta = !row.salida_1 || (row.entrada_2 && !row.salida_2) || (row.entrada_3 && !row.salida_3);
                  const nCiclos = [row.entrada_1, row.entrada_2, row.entrada_3].filter(Boolean).length;
                  
                  return (
                    <Link 
                      key={row.id} 
                      href={`/repartidores/${row.id}`}
                      className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-[#00d4ff]/20 transition-all duration-200 flex flex-col justify-between h-full relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                            <Truck className="w-4 h-4 text-[#00d4ff]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-[#00d4ff] transition-colors uppercase leading-tight">
                              {row.empresa_abreviatura}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{row.placa}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${isEnPlanta ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/5 border-blue-500/10 text-blue-500/60'}`}>
                          {isEnPlanta ? 'EN PLANTA' : 'FINALIZADO'}
                        </span>
                      </div>

                      <div className="py-3 border-y border-white/[0.03] mb-3">
                        <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Conductor</span>
                        <p className="text-[10px] text-gray-300 font-medium capitalize">{row.conductor_apellido?.toLowerCase()}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="flex flex-col items-center" title="SCTR">
                            <span className="text-[7px] text-gray-700 font-bold mb-0.5">SCTR</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${row.sctr_ok ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}></div>
                          </div>
                          <div className="flex flex-col items-center" title="EPP">
                            <span className="text-[7px] text-gray-700 font-bold mb-0.5">EPP</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${row.epp_ok ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <div className="flex gap-0.5">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className={`w-1 h-1 rounded-full ${row[`entrada_${n}`] ? 'bg-[#00d4ff]' : 'bg-white/10'}`}></div>
                            ))}
                          </div>
                          <span className="text-[9px] text-gray-500 font-black uppercase">{nCiclos} CICLOS</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3 h-3 text-[#00d4ff]" />
                      </div>
                    </Link>
                  );
                })}
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
