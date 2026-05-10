'use client';

import { useState, useMemo } from 'react';
import { Truck, CheckCircle2, XCircle, Search, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProveedoresClient({ initialProveedores }: { initialProveedores: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
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
            className="px-4 py-2 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-xl text-[10px] font-black transition-all shadow-lg shadow-[#00d4ff]/20 shrink-0 uppercase tracking-widest"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Fecha / Hora</th>
              <th className="px-4 py-4 font-semibold">Empresa / Proveedor</th>
              <th className="px-4 py-4 font-semibold">Placa</th>
              <th className="px-4 py-4 font-semibold">Conductor</th>
              <th className="px-4 py-4 font-semibold">Estado SCTR / EPP</th>
              <th className="px-4 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProveedores?.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[11px] uppercase">
                      {new Date(item.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                    </span>
                    <span className="text-gray-400 font-mono text-[10px]">{item.fecha}</span>
                    <span className="text-gray-500 text-[10px] font-mono mt-1">{item.hora_llegada?.slice(0,5)} - {item.hora_salida?.slice(0,5) || '--:--'}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Truck className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-white font-semibold">{item.empresa_proveedor}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-white border border-white/10 group-hover:border-[#00d4ff]/30 transition-colors">
                    {item.placa}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-300 text-sm capitalize">{item.conductor?.toLowerCase()}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5" title="SCTR">
                      {item.sctr_salud && item.sctr_pension ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-[10px] text-gray-500 font-bold uppercase">SCTR</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="EPP">
                      {item.epp_completo ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-[10px] text-gray-500 font-bold uppercase">EPP</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <Link 
                    href={`/proveedores/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00d4ff] hover:text-white transition-colors bg-[#00d4ff]/10 hover:bg-[#00d4ff] px-3 py-1.5 rounded-full border border-[#00d4ff]/30"
                  >
                    AUDITAR FICHA
                  </Link>
                </td>
              </tr>
            ))}
            {(!filteredProveedores || filteredProveedores.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
