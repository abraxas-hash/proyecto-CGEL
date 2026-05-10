import { createAdminClient } from '@/lib/supabaseClient';
import Header from '@/components/layout/Header';
import { CheckCircle2, XCircle, Search, Filter, Truck, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; 

export default async function RepartidoresPage() {
  const supabase = createAdminClient();
  
  const { data: repartidores, error } = await supabase
    .from('registro_diario_repartidores')
    .select('*')
    .order('fecha', { ascending: false })
    .order('entrada_1', { ascending: false });

  if (error) {
    console.error('Error fetching Supabase:', error);
    return (
      <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">
        <h2 className="text-red-500 font-bold mb-4">Error cargando datos de Supabase</h2>
        <pre className="bg-red-950/50 text-red-200 p-4 rounded-xl overflow-auto text-sm border border-red-500/20">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />

      <main className="glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Truck className="text-[#00d4ff] w-8 h-8" />
              Repartidores Fijos
            </h2>
            <p className="text-gray-400 text-sm mt-1">Control diario de ciclos de carga y distribución</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Placa, Conductor o Empresa..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-all shadow-inner"
              />
            </div>
            <button className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors" title="Filtros avanzados">
              <Filter className="w-5 h-5" />
            </button>
            <button className="px-4 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-xl text-sm font-black transition-all shadow-lg shadow-[#00d4ff]/20">
              EXPORTAR
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase font-mono text-[10px] tracking-widest">
              <tr>
                <th className="px-4 py-4 rounded-tl-xl border-b border-white/10">Fecha / Turno</th>
                <th className="px-4 py-4 border-b border-white/10">Transporte & Placa</th>
                <th className="px-4 py-4 border-b border-white/10">Conductor</th>
                <th className="px-4 py-4 border-b border-white/10 text-center">Ciclos</th>
                <th className="px-4 py-4 border-b border-white/10">Seguridad</th>
                <th className="px-4 py-4 border-b border-white/10">Estado</th>
                <th className="px-4 py-4 rounded-tr-xl border-b border-white/10 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {repartidores?.map((row) => {
                const isEnPlanta = !row.salida_1 || (row.entrada_2 && !row.salida_2) || (row.entrada_3 && !row.salida_3);
                const nCiclos = [row.entrada_1, row.entrada_2, row.entrada_3].filter(Boolean).length;
                
                return (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-mono font-bold uppercase text-[11px]">
                          {new Date(row.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                        </span>
                        <span className="text-gray-400 font-mono text-[10px]">{row.fecha}</span>
                        <span className="text-[9px] text-[#00d4ff] uppercase font-black mt-1">{row.turno}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                          <Truck className="w-4 h-4 text-[#00d4ff]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{row.empresa_abreviatura}</span>
                          <span className="text-xs font-mono text-[#00d4ff]">{row.placa}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white font-medium capitalize">
                      {row.conductor_apellido?.toLowerCase()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3].map((n) => {
                          const hasCycle = row[`entrada_${n}`];
                          return (
                            <div 
                              key={n} 
                              className={`w-2 h-2 rounded-full ${hasCycle ? 'bg-[#00d4ff]' : 'bg-white/10'}`}
                              title={hasCycle ? `Ciclo ${n} registrado` : `Sin ciclo ${n}`}
                            ></div>
                          );
                        })}
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1 block uppercase font-bold">{nCiclos} Ciclos</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-0.5" title="SCTR">
                          <span className="text-[8px] text-gray-600 font-bold uppercase">SCTR</span>
                          {row.sctr_ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="flex flex-col items-center gap-0.5" title="EPP">
                          <span className="text-[8px] text-gray-600 font-bold uppercase">EPP</span>
                          {row.epp_ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        isEnPlanta 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {isEnPlanta ? (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            EN PLANTA
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            FINALIZADO
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link 
                        href={`/repartidores/${row.id}`} 
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-[#00d4ff]/20 text-gray-400 hover:text-[#00d4ff] rounded-lg text-xs font-bold transition-all border border-transparent hover:border-[#00d4ff]/30"
                      >
                        AUDITAR <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {(!repartidores || repartidores.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Truck className="w-12 h-12 opacity-10" />
                      <p className="uppercase tracking-[0.2em] font-black text-xs">No hay registros de repartidores para mostrar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
