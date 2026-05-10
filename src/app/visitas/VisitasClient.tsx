'use client';

import { useState, useMemo } from 'react';
import { Users, UserCheck, UserX, Search, ArrowRight, X, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function VisitasClient({ initialVisitas }: { initialVisitas: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

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

  return (
    <main className="glass-panel rounded-2xl p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
            <Users className="text-green-400 w-8 h-8" />
            Gestión de Visitas
          </h2>
          <p className="text-gray-400 text-sm mt-1">Registro de ingreso peatonal y administrativo</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Nombre, DNI o Empresa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-green-400/50 transition-all shadow-inner placeholder:text-gray-600"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-green-400/50 transition-all [color-scheme:dark]"
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVisitas?.map((v) => (
          <Link 
            key={v.id} 
            href={`/visitas/${v.id}`}
            className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-green-400/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3">
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-green-400 transition-colors capitalize">{v.nombre_completo?.toLowerCase()}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-green-400 font-bold uppercase">
                    {new Date(v.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">{v.fecha}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">DNI: {v.dni_ce}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Empresa</span>
                <span className="text-gray-300 font-medium truncate ml-4 text-right">{v.empresa || 'PARTICULAR'}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>Ingreso: {v.hora_ingreso?.slice(0,5)}</span>
                <span>Salida: {v.hora_salida?.slice(0,5) || '---'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 pt-4">
              <div className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-gray-400 border border-white/5 uppercase truncate max-w-[150px]">
                {v.referencia_visita}
              </div>
              <span className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-black border ${v.pase_devuelto_salida ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                {v.pase_devuelto_salida ? 'FINALIZADO' : 'EN PLANTA'}
              </span>
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
