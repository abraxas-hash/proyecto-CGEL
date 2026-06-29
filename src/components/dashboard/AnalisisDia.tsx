'use client';

import React, { useState, useEffect } from 'react';
import { Users, Package, Flame, Truck, AlertTriangle, CheckCircle2, Camera, Activity, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import EditableTime from '@/components/ui/EditableTime';

export function AnalisisDia() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    visitasCount: 0,
    proveedoresCount: 0,
    gasLlenos: 0,
    gasVacios: 0,
    alquileres: 0,
    ocurrencias: [] as any[]
  });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate]);

  async function fetchDashboard() {
    setLoading(true);
    try {
      // 1. Visitas
      const { data: visitas } = await supabase
        .from('registro_visitas')
        .select('*')
        .eq('fecha', selectedDate);

      // 2. Proveedores (incluye Gas y Alquiler)
      const { data: proveedores } = await supabase
        .from('registro_proveedores_carga')
        .select('*')
        .eq('fecha', selectedDate);

      // 3. Ocurrencias
      const { data: ocurrenciasData } = await supabase
        .from('cuaderno_ocurrencias')
        .select('*')
        .gte('created_at', `${selectedDate}T00:00:00.000Z`)
        .order('created_at', { ascending: false });

      let provs = 0;
      let gLlenos = 0;
      let gVacios = 0;
      let alq = 0;

      if (proveedores) {
        proveedores.forEach(p => {
          if (p.tipo_carga === 'GAS MONTACARGA') {
            try {
              const obs = typeof p.observaciones === 'string' ? JSON.parse(p.observaciones) : p.observaciones;
              if (obs && obs.detalles_gas) {
                gLlenos += (parseInt(obs.detalles_gas.llenos_ingreso) || 0);
                gVacios += (parseInt(obs.detalles_gas.vacios_salida) || 0);
              }
            } catch(e) { }
          } else if (p.tipo_carga === 'ALQUILER MONTACARGA') {
            alq += 1;
          } else {
            provs += 1;
          }
        });
      }

      setData({
        visitasCount: visitas ? visitas.length : 0,
        proveedoresCount: provs,
        gasLlenos: gLlenos,
        gasVacios: gVacios,
        alquileres: alq,
        ocurrencias: ocurrenciasData || []
      });

    } catch (err) {
      console.error("Error fetching summary data", err);
    } finally {
      setLoading(false);
    }
  }

  const openDetailsModal = async (type: string) => {
    setActiveModal(type);
    
    try {
      let result;
      if (type === 'visitas') {
        result = await supabase.from('registro_visitas').select('*').eq('fecha', selectedDate);
      } else if (type === 'proveedores') {
        result = await supabase.from('registro_proveedores_carga').select('*').eq('fecha', selectedDate).neq('tipo_carga', 'GAS MONTACARGA');
      } else if (type === 'gas') {
        result = await supabase.from('registro_proveedores_carga').select('*').eq('fecha', selectedDate).eq('tipo_carga', 'GAS MONTACARGA');
      }
      if (result && result.data) setModalData(result.data);
    } catch(e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[20vh] animate-pulse gap-4 text-emerald-500">
        <Activity className="w-12 h-12" />
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Analizando datos del día...</p>
      </div>
    );
  }

  // Convert selectedDate to local display
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300 pb-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resumen Analítico</p>
          <p className="text-slate-800 dark:text-white font-bold capitalize">{dateStr}</p>
        </div>
        <div>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-black/20 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* METRIC CARDS (Sin fondo, tamaño reducido) */}
      <div className="grid grid-cols-3 gap-2">
        
        {/* Visitas */}
        <div 
          onClick={() => openDetailsModal('visitas')}
          className="cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-xl flex flex-col items-center justify-center text-center relative group"
        >
          <span className="text-xl font-black text-slate-800 dark:text-white drop-shadow-md z-10">{data.visitasCount}</span>
          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mt-0.5 z-10">Visitas Reg.</span>
        </div>

        {/* Proveedores */}
        <div 
          onClick={() => openDetailsModal('proveedores')}
          className="cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-xl flex flex-col items-center justify-center text-center relative group"
        >
          <span className="text-xl font-black text-slate-800 dark:text-white drop-shadow-md z-10">{data.proveedoresCount}</span>
          <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest mt-0.5 z-10">Proveedores C/D</span>
        </div>

        {/* Gas */}
        <div 
          onClick={() => openDetailsModal('gas')}
          className="cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-xl flex flex-col justify-center items-center relative group"
        >
          <div className="flex gap-3 z-10 items-center">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-slate-800 dark:text-white">{data.gasLlenos}</span>
              <span className="text-[8px] text-slate-500 font-bold">LLENOS</span>
            </div>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-slate-800 dark:text-white">{data.gasVacios}</span>
              <span className="text-[8px] text-slate-500 font-bold">VACÍOS</span>
            </div>
          </div>
          <span className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mt-1 z-10">
            Gas Montacarga
          </span>
        </div>
      </div>

      {/* OCURRENCIAS DEL DIA */}
      <div className="mt-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Ocurrencias Anotadas Hoy ({data.ocurrencias.length})
        </h3>

        {data.ocurrencias.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-200 dark:border-slate-800 bg-black/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No se han registrado novedades relevantes el día de hoy.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.ocurrencias.map((oc) => {
              const time = new Date(oc.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={oc.id} className="glass-panel p-4 rounded-2xl border-l-4 border-l-amber-500 bg-black/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">{time}</span>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded uppercase">
                      TURNO {oc.turno}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed">{oc.novedades}</p>
                  
                  {oc.estado_equipos && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Equipos:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">{oc.estado_equipos}</p>
                    </div>
                  )}
                  {oc.foto_url && (
                    <a href={oc.foto_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-sky-500 hover:text-sky-600 uppercase tracking-widest bg-sky-500/10 px-2 py-1 rounded">
                      <Camera className="w-3 h-3" /> Ver Evidencia Adjunta
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-700">
            <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                Detalle del Día: {activeModal}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {modalData.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No hay registros para hoy.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {modalData.map((item, idx) => {
                    let tableName = '';
                    let timeColumn = '';
                    let initialTime = '';

                    if (activeModal === 'visitas') {
                      tableName = 'registro_visitas';
                      timeColumn = 'hora_ingreso';
                      initialTime = item.hora_ingreso;
                    } else if (activeModal === 'proveedores' || activeModal === 'gas') {
                      tableName = 'registro_proveedores_carga';
                      timeColumn = 'hora_llegada';
                      initialTime = item.hora_llegada;
                    }

                    return (
                      <li key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-sm flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">
                            {item.nombre_empresa || item.nombre_completo || item.empresa || 'Registro #' + item.id}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase">{item.motivo || item.tipo_carga || item.placa || ''}</p>
                        </div>
                        <EditableTime 
                          id={item.id}
                          table={tableName}
                          column={timeColumn}
                          initialTime={initialTime}
                          onSuccess={() => openDetailsModal(activeModal)}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
