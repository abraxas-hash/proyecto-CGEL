'use client';

import { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, UserX, Search, ArrowRight, X, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function VisitasClient({ initialVisitas }: { initialVisitas: any[] }) {
  const [refreshKey] = useState(() => Math.random().toString(36).substring(7));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Auto-scroll to top on search
  useEffect(() => {
    if (searchTerm || selectedDate) {
      window.scrollTo(0, 0);
    }
  }, [searchTerm, selectedDate]);

  const filteredVisitas = useMemo(() => {
    return initialVisitas?.filter((v) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        v.nombre_completo?.toLowerCase().includes(search) ||
        v.dni_ce?.toLowerCase().includes(search) ||
        v.empresa?.toLowerCase().includes(search) ||
        v.referencia_visita?.toLowerCase().includes(search);
      
      const matchesDate = selectedDate ? v.fecha === selectedDate : true;

      return matchesSearch && matchesDate;
    });
  }, [initialVisitas, searchTerm, selectedDate]);

  const handleExport = () => {
    if (!filteredVisitas || filteredVisitas.length === 0) return;
    const headers = ['FECHA', 'DNI', 'NOMBRE', 'EMPRESA', 'INGRESO', 'SALIDA', 'REFERENCIA', 'ESTADO'];
    const BOM = '\uFEFF';
    const csvRows = filteredVisitas.map(v => [
      v.fecha,
      v.dni_ce,
      v.nombre_completo,
      v.empresa || 'PARTICULAR',
      v.hora_ingreso?.slice(0,5),
      v.hora_salida?.slice(0,5) || '---',
      v.referencia_visita,
      v.pase_devuelto_salida ? 'FINALIZADO' : 'EN PLANTA'
    ].map(field => `"${field}"`).join(','));

    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visitas_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <main key={refreshKey} className="glass-panel rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-4 border-b border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Users className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
              Gestión de Visitas
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold">Registro de ingreso peatonal</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px] md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por DNI o Nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-green-400/50 transition-all"
              />
            </div>
            <button 
              onClick={handleExport}
              className="w-full md:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-xl text-[10px] font-black transition-all shadow-lg shadow-green-500/20 shrink-0 uppercase tracking-widest h-9"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVisitas?.map((v) => (
          <Link 
            key={v.id} 
            href={`/visitas/${v.id}`}
            className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-green-400/20 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <UserCheck className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors capitalize leading-tight">
                    {v.nombre_completo?.toLowerCase()}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">DNI: {v.dni_ce}</p>
                </div>
              </div>
              <span className={`text-[8px] px-2 py-0.5 rounded-md font-black border ${v.pase_devuelto_salida ? 'bg-blue-500/5 border-blue-500/10 text-blue-500/60' : 'bg-orange-500/10 border-orange-500/20 text-orange-400 animate-pulse'}`}>
                {v.pase_devuelto_salida ? 'FINALIZADO' : 'ACTIVO'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.03] mb-3">
              <div>
                <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Empresa</span>
                <span className="text-[10px] text-gray-300 font-bold truncate block">{v.empresa || 'PARTICULAR'}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Horario</span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {v.hora_ingreso?.slice(0,5)} — {v.hora_salida?.slice(0,5) || '--:--'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{v.fecha}</span>
              </div>
              <div className="text-[9px] text-gray-400 font-medium truncate max-w-[120px] text-right italic opacity-60">
                {v.referencia_visita}
              </div>
            </div>
          </Link>
        ))}
        {(!filteredVisitas || filteredVisitas.length === 0) && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <UserX className="w-12 h-12 text-gray-700 mb-4 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Sin coincidencias encontradas</p>
          </div>
        )}
      </div>
    </main>
  );
}
