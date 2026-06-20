'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ArrowLeft, Send, CheckCircle2, Camera, RefreshCw, Clock, Loader2, Play, Square, X } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

// ─── Directorio de vehículos autorizados ──────────────────────────
const VEHICULOS = [
  { placa: 'ABJ-550', empresa: 'WJ',  conductor: 'PENALVA, MIGUEL' },
  { placa: 'C3O-189', empresa: 'WJ',  conductor: 'CAICEDO, JOSE' },
  { placa: 'D4M-601', empresa: 'WJ',  conductor: 'NUÑEZ, DANEY' },
  { placa: 'BJO-793', empresa: 'WJ',  conductor: 'NOLASCO, NICANOR' },
  { placa: 'BEM-738', empresa: 'WJ',  conductor: 'AQUINO, ALFREDO' },
  { placa: 'BNL-837', empresa: 'WJ',  conductor: 'FACHIN, ANGEL' },
  { placa: 'CNW-610', empresa: 'JC',  conductor: 'MARTINEZ, WILLY' },
  { placa: 'CNW-354', empresa: 'JC',  conductor: 'PEREZ, JAMES' },
  { placa: 'B2H-921', empresa: 'TRJ', conductor: 'PEREZ ORTIZ, JON' },
  { placa: 'BKS-909', empresa: 'TRJ', conductor: 'ARAUJO, LUIS' },
  { placa: 'BVR-727', empresa: 'TRJ', conductor: 'ESTEBAN, JHON' },
  { placa: 'BPV-927', empresa: 'TRJ', conductor: 'ESTRELLA, MARLON' },
  { placa: 'BVM-746', empresa: 'TRJ', conductor: 'VIVAR, JUSTIN' },
  { placa: 'BVW-789', empresa: 'TRJ', conductor: 'VASQUEZ, ALAN' },
  { placa: 'A2B-244', empresa: 'TRJ', conductor: 'JESUS (N.N)' },
  { placa: 'T&F-851', empresa: 'TF',  conductor: 'DEL CASTILLO, CARLOS' },
  { placa: '3X2-125', empresa: 'IND', conductor: 'VALENTIN, VICTOR' },
];

const COLOR_MAP: Record<string, string> = {
  WJ:  'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
  JC:  'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
  TRJ: 'text-orange-700 dark:text-orange-400 border-orange-500/30 bg-orange-500/5',
  TF:  'text-green-700 dark:text-green-400 border-green-500/30 bg-green-500/5',
  IND: 'text-slate-700 dark:text-gray-400 border-gray-500/30 bg-gray-500/5',
};

type VehiculoData = typeof VEHICULOS[number];

// ─── Pasos del formulario ──────────────────────────────────────────
type Step = 1 | 2 | 3;

export default function RepartidoresForm() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Registros de hoy
  const [todaysRecords, setTodaysRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [updatingTime, setUpdatingTime] = useState(false);

  // Datos del vehículo seleccionado
  const [vehiculo, setVehiculo] = useState<VehiculoData | null>(null);
  const [placaManual, setPlacaManual] = useState('');
  const [empresaManual, setEmpresaManual] = useState('');
  const [conductorManual, setConductorManual] = useState('');

  // Datos del registro
  const [numSalida, setNumSalida] = useState<1 | 2 | 3>(1);
  const [sctrOk, setSctrOk] = useState(true);
  const [eppOk, setEppOk] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [guiaFile, setGuiaFile] = useState<File | null>(null);
  const [estibaFile, setEstibaFile] = useState<File | null>(null);

  // Valores efectivos (puede ser del directorio o ingresado a mano)
  const placa     = vehiculo ? vehiculo.placa     : placaManual;
  const empresa   = vehiculo ? vehiculo.empresa   : empresaManual;
  const conductor = vehiculo ? vehiculo.conductor : conductorManual;

  // ─── Obtener registros del día ────────────────────────────────
  const fetchTodaysRecords = async () => {
    setIsLoadingRecords(true);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    const { data, error } = await supabase
      .from('registro_diario_repartidores')
      .select('*')
      .eq('fecha', today);
    if (!error && data) {
      setTodaysRecords(data);
    }
    setIsLoadingRecords(false);
  };

  useEffect(() => {
    fetchTodaysRecords();
  }, []);

  // ─── Paso 1: selecciona vehículo ────────────────────────────────
  const handleSelectVehiculo = (v: VehiculoData) => {
    setVehiculo(v);
    setPlacaManual('');
    setEmpresaManual('');
    setConductorManual('');
    setShowTimeModal(true);
  };

  const handleManualNext = () => {
    if (!placaManual || !empresaManual || !conductorManual) return;
    setVehiculo(null);
    setShowTimeModal(true);
  };

  // ─── Botones de Tiempos ─────────────────────────────────────────
  const handleMarkTime = async (columna: 'hora_llegada' | 'hora_inicio_carga' | 'hora_fin_carga') => {
    if (!placa || !empresa || !conductor) return;
    setUpdatingTime(true);

    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeStr = formatter.format(now);
      const today = now.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });

      const existingRecord = todaysRecords.find(r => r.placa === placa);

      if (existingRecord) {
        // Update
        const { error } = await supabase
          .from('registro_diario_repartidores')
          .update({ [columna]: timeStr })
          .eq('id', existingRecord.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('registro_diario_repartidores')
          .insert({
            fecha: today,
            turno: 'DIURNO',
            empresa_abreviatura: empresa.toUpperCase(),
            placa: placa.toUpperCase(),
            conductor_apellido: conductor.toUpperCase(),
            [columna]: timeStr
          });
        if (error) throw error;
      }
      await fetchTodaysRecords();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el tiempo.');
    } finally {
      setUpdatingTime(false);
    }
  };

  // ─── Envío final ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!placa || !empresa || !conductor) return;
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const today   = now.toISOString().split('T')[0];

      let guiaUrl   = guiaFile   ? await uploadEvidence('repartidores', guiaFile)   : null;
      let estibaUrl = estibaFile ? await uploadEvidence('repartidores', estibaFile) : null;

      const obsPayload = (observaciones || guiaUrl || estibaUrl) ? JSON.stringify({
        texto: observaciones,
        salida: numSalida,
        fotos: { guias: guiaUrl, estiba: estibaUrl }
      }) : null;

      // Determinar campo de entrada según número de salida
      const campoEntrada = numSalida === 1 ? 'entrada_1' : numSalida === 2 ? 'entrada_2' : 'entrada_3';
      const existingRecord = todaysRecords.find(r => r.placa === placa);

      if (existingRecord) {
        const { error } = await supabase
          .from('registro_diario_repartidores')
          .update({
            sctr_ok: sctrOk,
            epp_ok: eppOk,
            [campoEntrada]: timeStr,
            observaciones: obsPayload,
          })
          .eq('id', existingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('registro_diario_repartidores')
          .insert({
            fecha:              today,
            turno:              'DIURNO',
            empresa_abreviatura: empresa.toUpperCase(),
            placa:              placa.toUpperCase(),
            conductor_apellido: conductor.toUpperCase(),
            sctr_ok:            sctrOk,
            epp_ok:             eppOk,
            [campoEntrada]:     timeStr,
            observaciones:      obsPayload,
          });
        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => router.push('/garita'), 2500);

    } catch (err) {
      console.error(err);
      alert('Error al guardar. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Pantalla de éxito ───────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Registrado!</h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">
          <span className="text-slate-800 dark:text-white font-bold">{placa}</span> — {conductor}
        </p>
        <p className="text-green-400 font-bold text-xs uppercase tracking-widest">
          Salida N°{numSalida} guardada correctamente
        </p>
      </div>
    );
  }

  // ─── Header compartido ───────────────────────────────────────────
  const Header = () => (
    <div className="flex items-center gap-4 mb-2">
      <button
        type="button"
        onClick={() => step === 2 ? setStep(1) : router.push('/garita')}
        className="w-10 h-10 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-center text-slate-800 dark:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <Truck className="text-slate-800 dark:text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Repartidores</h2>
          <p className="text-[11px] text-slate-800 dark:text-white font-bold uppercase tracking-wider mt-0.5">
            {step === 1 ? 'Paso 1 · Selecciona el vehículo' : 'Paso 2 · Número de salida y fotos'}
          </p>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // PASO 1: Selección de vehículo
  // ═══════════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="flex flex-col gap-6">
        <Header />

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex justify-between items-end mb-3">
            <div className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">
              Vehículos autorizados — Toca para registrar
            </div>
            <button onClick={fetchTodaysRecords} className="p-1 text-slate-500 hover:text-white" title="Actualizar">
              <RefreshCw className={`w-4 h-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {VEHICULOS.map((v) => {
              const c = COLOR_MAP[v.empresa] ?? COLOR_MAP.IND;
              const record = todaysRecords.find(r => r.placa === v.placa);
              const hasActivity = !!record;
              const isFinished = record && (record.entrada_1 || record.entrada_2 || record.entrada_3);
              
              let statusColor = "bg-black/5 dark:bg-white/5";
              if (isFinished) statusColor = "bg-green-500/10 border-green-500/30";
              else if (hasActivity) statusColor = "bg-cyan-500/10 border-cyan-500/30";

              return (
                <button
                  key={v.placa}
                  type="button"
                  onClick={() => handleSelectVehiculo(v)}
                  className={`glass-panel hover:opacity-80 cursor-pointer rounded-xl p-2.5 flex flex-col gap-0.5 text-left border transition-all active:scale-95 ${c} ${statusColor}`}
                >
                  <span className="text-sm font-black tracking-wider flex items-center justify-between w-full">
                    {v.placa}
                    {hasActivity && !isFinished && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                    {isFinished && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{v.empresa}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingreso manual para vehículos no listados */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
          <div className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">
            Vehículo no listado — Ingreso manual
          </div>
          <input
            type="text"
            placeholder="Placa (ej: ABC-123)"
            value={placaManual}
            onChange={(e) => setPlacaManual(e.target.value.toUpperCase())}
            className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white font-bold uppercase tracking-widest focus:outline-none focus:border-slate-500"
          />
          <input
            type="text"
            placeholder="Empresa (ej: WJ, JC, TRJ)"
            value={empresaManual}
            onChange={(e) => setEmpresaManual(e.target.value.toUpperCase())}
            className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-slate-500 uppercase"
          />
          <input
            type="text"
            placeholder="Apellido conductor"
            value={conductorManual}
            onChange={(e) => setConductorManual(e.target.value.toUpperCase())}
            className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-slate-500 uppercase"
          />
          <button
            type="button"
            disabled={!placaManual || !empresaManual || !conductorManual}
            onClick={handleManualNext}
            className="w-full py-3 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-slate-800 dark:text-white font-black uppercase text-xs tracking-widest disabled:opacity-30"
          >
            Continuar →
          </button>
        </div>

        {/* Modal Flotante de Opciones de Tiempo */}
        {showTimeModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#111] border border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-8">
              <button onClick={() => setShowTimeModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-xl font-black text-white">{placa}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{empresa} — {conductor}</p>
              </div>

              {(() => {
                const record = todaysRecords.find(r => r.placa === placa);
                return (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleMarkTime('hora_llegada')}
                      disabled={updatingTime || !!record?.hora_llegada}
                      className={`flex items-center justify-between p-4 rounded-xl border font-bold uppercase text-sm transition-all ${record?.hora_llegada ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" /> Llegada
                      </div>
                      {record?.hora_llegada ? <span>{record.hora_llegada}</span> : updatingTime ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Marcar</span>}
                    </button>

                    <button 
                      onClick={() => handleMarkTime('hora_inicio_carga')}
                      disabled={updatingTime || !!record?.hora_inicio_carga || !record?.hora_llegada}
                      className={`flex items-center justify-between p-4 rounded-xl border font-bold uppercase text-sm transition-all ${record?.hora_inicio_carga ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 cursor-default' : !record?.hora_llegada ? 'opacity-30 cursor-not-allowed border-transparent text-gray-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Play className="w-5 h-5" /> Inicio Carga
                      </div>
                      {record?.hora_inicio_carga ? <span>{record.hora_inicio_carga}</span> : <span>Marcar</span>}
                    </button>

                    <button 
                      onClick={() => handleMarkTime('hora_fin_carga')}
                      disabled={updatingTime || !!record?.hora_fin_carga || !record?.hora_inicio_carga}
                      className={`flex items-center justify-between p-4 rounded-xl border font-bold uppercase text-sm transition-all ${record?.hora_fin_carga ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 cursor-default' : !record?.hora_inicio_carga ? 'opacity-30 cursor-not-allowed border-transparent text-gray-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Square className="w-5 h-5" /> Fin Carga
                      </div>
                      {record?.hora_fin_carga ? <span>{record.hora_fin_carga}</span> : <span>Marcar</span>}
                    </button>

                    <div className="h-px w-full bg-white/10 my-2"></div>

                    <button 
                      onClick={() => { setShowTimeModal(false); setStep(2); }}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#00d4ff] text-black font-black uppercase text-xs tracking-widest hover:bg-[#00d4ff]/80 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    >
                      <Camera className="w-4 h-4" /> Registrar Salida y Fotos
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PASO 2: Número de salida + fotos + confirmación
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-5 pb-8">
      <Header />

      {/* Resumen del vehículo seleccionado */}
      <div className={`glass-panel p-4 rounded-2xl border ${COLOR_MAP[empresa] ?? COLOR_MAP.IND} flex items-center justify-between`}>
        <div>
          <p className="text-xl font-black text-slate-800 dark:text-white tracking-widest">{placa}</p>
          <p className="text-sm font-bold text-slate-600 dark:text-gray-300">{conductor}</p>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{empresa}</p>
        </div>
        <button
          type="button"
          onClick={() => { setVehiculo(null); setStep(1); }}
          className="glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer p-3 rounded-xl text-slate-500 dark:text-gray-400 flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Cambiar
        </button>
      </div>

      {/* Número de salida */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-3">
          ¿Es la 1ra, 2da o 3ra salida del día?
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNumSalida(n)}
              className={`py-4 rounded-xl flex flex-col items-center gap-1 transition-all font-black text-sm ${
                numSalida === n
                  ? 'neumorphic-inset bg-black/5 dark:bg-white/5 text-slate-800 dark:text-white'
                  : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-slate-300 font-black'
              }`}
            >
              <span className="text-2xl">{n}°</span>
              <span className="text-[10px] uppercase tracking-widest">Salida</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fotos */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">
          <Camera className="w-4 h-4" /> Evidencias fotográficas
        </div>
        <ImageUpload
          label="📋 Foto de Guía de Remisión"
          onImageChange={setGuiaFile}
        />
        <ImageUpload
          label="📦 Foto de Estiba / Carga"
          onImageChange={setEstibaFile}
        />
        <textarea
          placeholder="Observaciones (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={2}
          className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-slate-500 resize-none"
        />
      </div>

      {/* SCTR / EPP */}
      <div className="glass-panel p-4 rounded-2xl grid grid-cols-2 gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSctrOk(!sctrOk)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSctrOk(!sctrOk); } }}
          className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-500 ${sctrOk ? 'neumorphic-inset bg-black/5 dark:bg-white/5' : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'}`}
        >
          <span className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">SCTR Vigente</span>
          <span className={`text-xl font-black ${sctrOk ? 'text-slate-800 dark:text-white' : 'text-red-500'}`}>{sctrOk ? '✓ OK' : '✗ NO'}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setEppOk(!eppOk)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setEppOk(!eppOk); } }}
          className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-500 ${eppOk ? 'neumorphic-inset bg-black/5 dark:bg-white/5' : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'}`}
        >
          <span className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">Usa EPP</span>
          <span className={`text-xl font-black ${eppOk ? 'text-slate-800 dark:text-white' : 'text-red-500'}`}>{eppOk ? '✓ OK' : '✗ OBS'}</span>
        </div>
      </div>

      {/* Botón enviar */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="w-full py-5 bg-gradient-to-r from-[#0047AB] to-[#00d4ff] text-slate-800 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          'GUARDANDO...'
        ) : (
          <>
            <Send className="w-4 h-4" />
            REGISTRAR {numSalida}° SALIDA — {placa}
          </>
        )}
      </button>
    </div>
  );
}
