'use client';

import { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, UserX, Search, ChevronDown, ChevronRight, Calendar, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VisitasClient({ initialVisitas }: { initialVisitas: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  // Auto-scroll to top on search
  useEffect(() => {
    if (searchTerm) {
      window.scrollTo(0, 0);
    }
  }, [searchTerm]);

  const filteredVisitas = useMemo(() => {
    return initialVisitas?.filter((v) => {
      const search = searchTerm.toLowerCase();
      return (
        v.nombre_completo?.toLowerCase().includes(search) ||
        v.dni_ce?.toLowerCase().includes(search) ||
        v.empresa?.toLowerCase().includes(search) ||
        v.referencia_visita?.toLowerCase().includes(search)
      );
    });
  }, [initialVisitas, searchTerm]);

  // Grouping logic
  const groupedData = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredVisitas?.forEach(v => {
      if (!groups[v.fecha]) groups[v.fecha] = [];
      groups[v.fecha].push(v);
    });
    // Sort by date descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredVisitas]);

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
    if (!filteredVisitas || filteredVisitas.length === 0) return;
    const headers = ['FECHA', 'DNI', 'NOMBRE', 'EMPRESA', 'INGRESO', 'SALIDA', 'REFERENCIA', 'ESTADO'];
    const BOM = '\uFEFF';
    const csvRows = filteredVisitas.map(v => [
      v.fecha, v.dni_ce, v.nombre_completo, v.empresa || 'PARTICULAR',
      v.hora_ingreso?.slice(0,5), v.hora_salida?.slice(0,5) || '---',
      v.referencia_visita, v.pase_devuelto_salida ? 'FINALIZADO' : 'EN PLANTA'
    ].map(field => `"${field}"`).join(','));
    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visitas_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <Users className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none uppercase">Visitas</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Registro peatonal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="DNI o Nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-green-400/50 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="p-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-all shadow-lg shadow-green-500/20"
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
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tighter">
                    {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{items.length} Visitas registradas</p>
                </div>
              </div>
              {expandedDates[date] ? (
                <ChevronDown className="w-5 h-5 text-green-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
              )}
            </button>

            {expandedDates[date] && (
              <div className="bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300 divide-y divide-white/5">
                {items.map((v) => (
                  <Link 
                    key={v.id} 
                    href={`/visitas/${v.id}`}
                    className="group flex items-center gap-4 p-3 hover:bg-white/[0.03] transition-all"
                  >
                    {/* Icon & Name */}
                    <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[200px]">
                      <div className={`w-8 h-8 rounded-lg ${!v.pase_devuelto_salida ? 'bg-green-500/10' : 'bg-gray-500/10'} flex items-center justify-center border border-white/5`}>
                        <UserCheck className={`w-4 h-4 ${!v.pase_devuelto_salida ? 'text-green-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white leading-none uppercase truncate max-w-[120px]">{v.nombre_completo}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">{v.dni_ce}</p>
                      </div>
                    </div>

                    {/* Empresa - Hidden on small screens */}
                    <div className="hidden sm:block flex-1 min-w-0">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Empresa</span>
                      <p className="text-[10px] text-gray-300 font-medium truncate uppercase">{v.empresa || 'PARTICULAR'}</p>
                    </div>

                    {/* Time & Status */}
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
            )}
          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <UserX className="w-12 h-12 text-gray-700 mb-4 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin coincidencias encontradas</p>
          </div>
        )}
      </div>
    </main>
  );
}
