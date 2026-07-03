'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, Wrench, Flame, X, Activity, FileText, ImageIcon } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import { supabase } from '@/lib/supabaseClient';
import EditableTime from '@/components/ui/EditableTime';

interface Props {
  counts: {
    repartidores: number;
    visitas: number;
    proveedores: number;
    contratistas: number;
  };
}

export function DashboardMetrics({ counts }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [gasData, setGasData] = useState({ llenos: 0, vacios: 0, count: 0 });
  const [fichas, setFichas] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserRole(profile.rol);
        }
      }
    }
    loadUser();

    // Fetch gas data for today
    async function fetchGas() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('registro_proveedores_carga')
        .select('observaciones')
        .eq('fecha', today)
        .eq('tipo_carga', 'GAS MONTACARGA');
      
      let gLlenos = 0;
      let gVacios = 0;
      if (data) {
        data.forEach(p => {
          try {
            const obs = typeof p.observaciones === 'string' ? JSON.parse(p.observaciones) : p.observaciones;
            if (obs && obs.detalles_gas) {
              gLlenos += (parseInt(obs.detalles_gas.llenos_ingreso) || 0);
              gVacios += (parseInt(obs.detalles_gas.vacios_salida) || 0);
            }
          } catch(e) {}
        });
        setGasData({ llenos: gLlenos, vacios: gVacios, count: data.length });
      }
    }

    async function fetchFicha() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('fichas_diarias')
        .select('*')
        .eq('fecha', today)
        .order('created_at', { ascending: false });
      if (data) {
        setFichas(data);
      }
    }

    fetchGas();
    fetchFicha();
  }, []);

  const openModal = async (type: string) => {
    setActiveModal(type);
    setLoading(true);
    setModalData([]);
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      let result;
      if (type === 'repartidores') {
        result = await supabase.from('registro_diario_repartidores').select('*').eq('fecha', today);
      } else if (type === 'visitas') {
        result = await supabase.from('registro_visitas').select('*').eq('fecha', today);
      } else if (type === 'proveedores') {
        result = await supabase.from('registro_proveedores_carga').select('*').eq('fecha', today).neq('tipo_carga', 'GAS MONTACARGA');
      } else if (type === 'contratistas') {
        result = await supabase.from('registro_contratistas').select('*').eq('fecha', today);
      } else if (type === 'gas') {
        result = await supabase.from('registro_proveedores_carga').select('*').eq('fecha', today).eq('tipo_carga', 'GAS MONTACARGA');
      }
      if (result && result.data) setModalData(result.data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (userRole === 'ssoma') {
    return null;
  }

  return (
    <>
      <div id="tour-metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div onClick={(e) => { e.preventDefault(); openModal('repartidores'); }}>
          <MetricCard 
            title="Repartidores" 
            subtitle="Control diario de rutas"
            value={counts.repartidores}
            Icon={Truck}
            colorTheme="blue"
            href="/repartidores"
          />
        </div>

        <div onClick={(e) => { e.preventDefault(); openModal('visitas'); }}>
          <MetricCard 
            title="Visitas Reg." 
            subtitle="Pases de seguridad"
            value={counts.visitas}
            Icon={Users}
            colorTheme="purple"
            href="/visitas"
          />
        </div>

        <div onClick={(e) => { e.preventDefault(); openModal('proveedores'); }}>
          <MetricCard 
            title="Proveedores C/D" 
            subtitle="Guías y materiales"
            value={counts.proveedores}
            Icon={ShieldCheck}
            colorTheme="green"
            href="/proveedores"
          />
        </div>



        <div onClick={(e) => { e.preventDefault(); openModal('gas'); }}>
          <MetricCard 
            title="Gas Montacargas" 
            subtitle={`${gasData.llenos} ING / ${gasData.vacios} SAL`}
            value={gasData.count}
            Icon={Flame}
            colorTheme="orange"
            href="/gas"
          />
        </div>


      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            {/* Header Premium */}
            <div className="px-6 py-5 bg-slate-50/80 dark:bg-white/[0.02] flex justify-between items-center border-b border-slate-200 dark:border-white/10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 shadow-inner">
                  <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm leading-tight">
                    {activeModal === 'ficha' ? 'Ficha Diaria' : `Detalle: ${activeModal}`}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-0.5">Reporte del Día</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2.5 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm relative z-10"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {activeModal === 'ficha' ? (
                fichas.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No se han subido fichas hoy.</p>
                ) : (
                  <div className="flex flex-col gap-6 items-center">
                    {fichas.map((f, i) => {
                      let tipo = 'GENERAL';
                      try {
                        const obs = typeof f.observaciones === 'string' ? JSON.parse(f.observaciones) : f.observaciones;
                        if (obs && obs.tipo) tipo = obs.tipo;
                      } catch(e) {}
                      return (
                        <div key={i} className="w-full flex flex-col items-center gap-2">
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{tipo} - {f.turno}</h4>
                          <img src={f.url_foto} alt={`Ficha ${tipo}`} className="max-w-full rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" />
                        </div>
                      )
                    })}
                  </div>
                )
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <Activity className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Cargando registros...</p>
                </div>
              ) : modalData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center relative shadow-inner border border-white/5">
                      <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-3 tracking-tight">Sin Registros</h4>
                  <p className="text-center text-slate-500 dark:text-slate-400 text-sm max-w-[280px] leading-relaxed">No se encontraron movimientos registrados en esta categoría para el día de hoy.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {modalData.map((item, idx) => {
                    let tableName = '';
                    let timeColumn = '';
                    let initialTime = '';

                    if (activeModal === 'repartidores') {
                      tableName = 'registro_diario_repartidores';
                      timeColumn = 'hora_llegada';
                      initialTime = item.hora_llegada || new Date(item.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    } else if (activeModal === 'visitas') {
                      tableName = 'registro_visitas';
                      timeColumn = 'hora_ingreso';
                      initialTime = item.hora_ingreso;
                    } else if (activeModal === 'proveedores' || activeModal === 'gas') {
                      tableName = 'registro_proveedores_carga';
                      timeColumn = 'hora_llegada';
                      initialTime = item.hora_llegada;
                    } else if (activeModal === 'contratistas') {
                      tableName = 'registro_contratistas';
                      timeColumn = 'hora_inicio';
                      initialTime = item.hora_inicio;
                    }

                    return (
                      <li 
                        key={idx} 
                        className="p-4 bg-white dark:bg-white/[0.02] hover:dark:bg-white/[0.04] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-black/20 flex items-center justify-center border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors shadow-inner">
                            <FileText className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-white text-sm tracking-tight">
                              {item.nombre_empresa || item.nombre_completo || item.empresa || 'Registro #' + item.id}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mt-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                              {item.motivo || item.tipo_carga || item.placa || 'Detalle no especificado'}
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-black/40 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 w-full sm:w-auto shadow-inner">
                          <EditableTime 
                            id={item.id}
                            table={tableName}
                            column={timeColumn}
                            initialTime={initialTime}
                            onSuccess={() => openModal(activeModal)}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
