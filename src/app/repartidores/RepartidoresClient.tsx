'use client';

import React, { useState, useMemo } from 'react';
import { Truck, Search, Filter, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function RepartidoresClient({ initialData }: { initialData: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-scroll to top on search
  React.useEffect(() => {
    if (searchTerm) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) return;
    
    // Professional CSV Export with UTF-8 BOM for Excel Compatibility
    const headers = [
      'FECHA', 
      'DIA',
      'TURNO', 
      'EMPRESA', 
      'PLACA', 
      'CONDUCTOR', 
      'CICLOS_TOTAL', 
      'SCTR', 
      'EPP', 
      'ESTADO_PLANTA'
    ];
    
    const BOM = '\uFEFF';
    const csvRows = filteredData.map(row => {
      const dia = new Date(row.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
      const nCiclos = [row.entrada_1, row.entrada_2, row.entrada_3].filter(Boolean).length;
      const sctr = row.sctr_ok ? 'CUMPLE' : 'PENDIENTE';
      const epp = row.epp_ok ? 'COMPLETO' : 'OBSERVADO';
      const enPlanta = (!row.salida_1 || (row.entrada_2 && !row.salida_2)) ? 'DENTRO' : 'SALIDA';
      
      return [
        row.fecha,
        dia,
        row.turno,
        row.empresa_abreviatura,
        row.placa,
        row.conductor_apellido,
        nCiclos,
        sctr,
        epp,
        enPlanta
      ].map(field => `"${field}"`).join(',');
    });

    const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `repartidores_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="glass-panel rounded-2xl p-4 sm:p-6 overflow-hidden w-full">
      <div className="sticky top-[68px] sm:top-[88px] z-30 bg-[#0a0a0a]/95 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-4 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Truck className="text-[#00d4ff] w-6 h-6 sm:w-8 sm:h-8" />
              Repartidores Fijos
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold">Control diario de ciclos</p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 w-full md:w-auto md:flex md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar placa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all"
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

      <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-[10px] sm:text-sm text-gray-300 min-w-[700px]">
          <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[9px] tracking-widest">
            <tr>
              <th className="px-4 py-4 border-b border-white/10">Fecha / Turno</th>
              <th className="px-4 py-4 border-b border-white/10">Transporte & Placa</th>
              <th className="px-4 py-4 border-b border-white/10">Conductor</th>
              <th className="px-4 py-4 border-b border-white/10 text-center">Ciclos</th>
              <th className="px-4 py-4 border-b border-white/10">Seguridad</th>
              <th className="px-4 py-4 border-b border-white/10">Estado</th>
              <th className="px-4 py-4 border-b border-white/10 text-right">Ficha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData?.map((row) => {
              const isEnPlanta = !row.salida_1 || (row.entrada_2 && !row.salida_2) || (row.entrada_3 && !row.salida_3);
              const nCiclos = [row.entrada_1, row.entrada_2, row.entrada_3].filter(Boolean).length;
              
              return (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-mono font-bold uppercase text-[10px]">
                        {new Date(row.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}
                      </span>
                      <span className="text-gray-500 font-mono text-[9px]">{row.fecha}</span>
                      <span className="text-[8px] text-[#00d4ff] uppercase font-black mt-1">{row.turno}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                        <Truck className="w-4 h-4 text-[#00d4ff]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xs">{row.empresa_abreviatura}</span>
                        <span className="text-[10px] font-mono text-[#00d4ff]">{row.placa}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white font-medium capitalize text-xs">
                    {row.conductor_apellido?.toLowerCase()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map((n) => {
                        const hasCycle = row[`entrada_${n}`];
                        return (
                          <div 
                            key={n} 
                            className={`w-1.5 h-1.5 rounded-full ${hasCycle ? 'bg-[#00d4ff]' : 'bg-white/10'}`}
                          ></div>
                        );
                      })}
                    </div>
                    <span className="text-[8px] text-gray-500 mt-1 block uppercase font-bold">{nCiclos} Ciclos</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center gap-0.5" title="SCTR">
                        <span className="text-[7px] text-gray-600 font-bold uppercase">SCTR</span>
                        {row.sctr_ok ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title="EPP">
                        <span className="text-[7px] text-gray-600 font-bold uppercase">EPP</span>
                        {row.epp_ok ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border ${
                      isEnPlanta 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {isEnPlanta ? 'PLANTA' : 'FINAL'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link 
                      href={`/repartidores/${row.id}`} 
                      className="p-1.5 bg-white/5 hover:bg-[#00d4ff]/20 text-gray-400 hover:text-[#00d4ff] rounded-lg transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
