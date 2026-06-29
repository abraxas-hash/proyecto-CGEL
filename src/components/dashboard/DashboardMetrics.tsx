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

  useEffect(() => {
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

  return (
    <>
      <div id="tour-metrics" className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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

        <div onClick={(e) => { e.preventDefault(); openModal('contratistas'); }}>
          <MetricCard 
            title="Contratistas" 
            subtitle="Inventario y personal"
            value={counts.contratistas}
            Icon={Wrench}
            colorTheme="orange"
            href="/contratistas"
          />
        </div>

        <div onClick={(e) => { e.preventDefault(); openModal('gas'); }}>
          <MetricCard 
            title="Gas Montacarga" 
            subtitle={`${gasData.llenos} ING / ${gasData.vacios} SAL`}
            value={gasData.count}
            Icon={Flame}
            colorTheme="orange"
            href="/garita/proveedores/gas"
          />
        </div>


      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">
                {activeModal === 'ficha' ? 'Ficha Diaria' : `Detalle del Día: ${activeModal}`}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
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
                <p className="text-center text-slate-500 py-8">No hay registros para hoy.</p>
              ) : (
                <ul className="flex flex-col gap-3">
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
                      <li key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-sm flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            {item.nombre_empresa || item.nombre_completo || item.empresa || 'Registro #' + item.id}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase">{item.motivo || item.tipo_carga || item.placa || ''}</p>
                        </div>
                        <EditableTime 
                          id={item.id}
                          table={tableName}
                          column={timeColumn}
                          initialTime={initialTime}
                          onSuccess={() => openModal(activeModal)}
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
    </>
  );
}
