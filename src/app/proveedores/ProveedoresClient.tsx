'use client';

import { useState, useMemo, useEffect } from 'react';
import { Truck, CheckCircle2, XCircle, Search, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProveedoresClient({ initialProveedores }: { initialProveedores: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Auto-scroll to top when searching
  useEffect(() => {
    if (searchTerm || selectedDate) {
      window.scrollTo(0, 0);
    }
  }, [searchTerm, selectedDate]);

  const filteredProveedores = useMemo(() => {
    return initialProveedores?.filter((item) => {
      const matchesSearch = 
        item.empresa_proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.conductor?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = selectedDate ? item.fecha === selectedDate : true;

      return matchesSearch && matchesDate;
    });
  }, [initialProveedores, searchTerm, selectedDate]);

  const handleExport = () => {
    if (!filteredProveedores || filteredProveedores.length === 0) return;
    const headers = ['Fecha', 'Empresa', 'Placa', 'Conductor', 'SCTR', 'EPP'];
    const csvContent = [
      headers.join(','),
      ...filteredProveedores.map(item => [
        item.fecha,
        item.empresa_proveedor,
        item.placa,
        item.conductor,
        (item.sctr_salud && item.sctr_pension) ? 'OK' : 'X',
        item.epp_completo ? 'OK' : 'X'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `proveedores_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();
  };

  return (
    <main className="glass-panel rounded-2xl p-4 sm:p-6 overflow-hidden w-full">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-4 border-b border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Truck className="text-[#00d4ff] w-6 h-6 sm:w-8 sm:h-8" />
              Proveedores y Carga
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold">Control de mercadería pesada</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px] md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Placa o empresa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all"
              />
            </div>
            <button 
              onClick={handleExport}
              className="w-full md:w-auto px-4 py-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-xl text-[10px] font-black transition-all shadow-lg shadow-[#00d4ff]/20 shrink-0 uppercase tracking-widest h-9"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProveedores?.map((item) => (
          <Link 
            key={item.id} 
            href={`/proveedores/${item.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-[#00d4ff]/20 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00d4ff] transition-colors uppercase leading-tight tracking-tighter">
                    {item.empresa_proveedor}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">{item.placa}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${item.sctr_salud && item.sctr_pension ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_5px_rgba(34,197,94,0.3)]`} title="SCTR"></div>
                <div className={`w-2 h-2 rounded-full ${item.epp_completo ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_5px_rgba(34,197,94,0.3)]`} title="EPP"></div>
              </div>
            </div>

            <div className="py-3 border-y border-white/[0.03] mb-3">
              <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Conductor</span>
              <p className="text-[10px] text-gray-300 font-medium capitalize">{item.conductor?.toLowerCase()}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Horario</span>
                <span className="text-[10px] text-gray-400 font-mono">{item.hora_llegada?.slice(0,5)} — {item.hora_salida?.slice(0,5) || '--:--'}</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Fecha</span>
                <span className="text-[10px] text-[#00d4ff] font-mono font-black">{item.fecha}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
