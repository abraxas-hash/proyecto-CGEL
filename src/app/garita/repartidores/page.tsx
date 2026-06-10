'use client';

import React, { useState } from 'react';
import { Truck, ArrowLeft, Send, CheckCircle2, Camera, RefreshCw } from 'lucide-react';
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
  WJ:  'text-[#00d4ff]  border-[#00d4ff]/30  bg-[#00d4ff]/5',
  JC:  'text-purple-400 border-purple-400/30 bg-purple-400/5',
  TRJ: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  TF:  'text-green-400  border-green-400/30  bg-green-400/5',
  IND: 'text-gray-400   border-gray-400/30   bg-gray-400/5',
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

  // ─── Paso 1: selecciona vehículo ────────────────────────────────
  const handleSelectVehiculo = (v: VehiculoData) => {
    setVehiculo(v);
    setPlacaManual('');
    setEmpresaManual('');
    setConductorManual('');
    setStep(2);
  };

  const handleManualNext = () => {
    if (!placaManual || !empresaManual || !conductorManual) return;
    setVehiculo(null);
    setStep(2);
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
      const campoEntrada = numSalida === 1 ? 'entrada_1' : numSalida === 2 ? 'entrada_2' : 'entrada_2';

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
        <h2 className="text-2xl font-black text-white">¡Registrado!</h2>
        <p className="text-gray-400 text-sm">
          <span className="text-white font-bold">{placa}</span> — {conductor}
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
        className="w-10 h-10 rounded-xl neu-button flex items-center justify-center text-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center">
          <Truck className="text-[#00d4ff] w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white leading-tight">Repartidores</h2>
          <p className="text-[11px] text-[#00d4ff] font-bold uppercase tracking-wider mt-0.5">
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

        <div className="neu-flat p-4 rounded-2xl">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">
            Vehículos autorizados — Toca para registrar
          </div>
          <div className="grid grid-cols-3 gap-2">
            {VEHICULOS.map((v) => {
              const c = COLOR_MAP[v.empresa] ?? COLOR_MAP.IND;
              return (
                <button
                  key={v.placa}
                  type="button"
                  onClick={() => handleSelectVehiculo(v)}
                  className={`neu-button rounded-xl p-2.5 flex flex-col gap-0.5 text-left border transition-all active:scale-95 ${c}`}
                >
                  <span className="text-sm font-black tracking-wider">{v.placa}</span>
                  <span className="text-[9px] opacity-50 uppercase tracking-widest">{v.empresa}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingreso manual para vehículos no listados */}
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-3">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Vehículo no listado — Ingreso manual
          </div>
          <input
            type="text"
            placeholder="Placa (ej: ABC-123)"
            value={placaManual}
            onChange={(e) => setPlacaManual(e.target.value.toUpperCase())}
            className="w-full neu-input rounded-xl p-3 text-sm text-white font-bold uppercase tracking-widest focus:outline-none focus:border-[#00d4ff]/50"
          />
          <input
            type="text"
            placeholder="Empresa (ej: WJ, JC, TRJ)"
            value={empresaManual}
            onChange={(e) => setEmpresaManual(e.target.value.toUpperCase())}
            className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 uppercase"
          />
          <input
            type="text"
            placeholder="Apellido conductor"
            value={conductorManual}
            onChange={(e) => setConductorManual(e.target.value.toUpperCase())}
            className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 uppercase"
          />
          <button
            type="button"
            disabled={!placaManual || !empresaManual || !conductorManual}
            onClick={handleManualNext}
            className="w-full py-3 rounded-xl neu-button text-[#00d4ff] font-black uppercase text-xs tracking-widest disabled:opacity-30"
          >
            Continuar →
          </button>
        </div>
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
      <div className={`neu-flat p-4 rounded-2xl border ${COLOR_MAP[empresa] ?? COLOR_MAP.IND} flex items-center justify-between`}>
        <div>
          <p className="text-xl font-black text-white tracking-widest">{placa}</p>
          <p className="text-sm font-bold text-gray-300">{conductor}</p>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{empresa}</p>
        </div>
        <button
          type="button"
          onClick={() => { setVehiculo(null); setStep(1); }}
          className="neu-button p-3 rounded-xl text-gray-400 flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Cambiar
        </button>
      </div>

      {/* Número de salida */}
      <div className="neu-flat p-4 rounded-2xl">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">
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
                  ? 'neu-pressed text-[#00d4ff]'
                  : 'neu-button text-gray-500'
              }`}
            >
              <span className="text-2xl">{n}°</span>
              <span className="text-[10px] uppercase tracking-widest">Salida</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fotos */}
      <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
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
          className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 resize-none"
        />
      </div>

      {/* SCTR / EPP */}
      <div className="neu-flat p-4 rounded-2xl grid grid-cols-2 gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSctrOk(!sctrOk)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSctrOk(!sctrOk); } }}
          className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 ${sctrOk ? 'neu-pressed' : 'neu-button'}`}
        >
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SCTR Vigente</span>
          <span className={`text-xl font-black ${sctrOk ? 'text-[#00d4ff]' : 'text-red-500'}`}>{sctrOk ? '✓ OK' : '✗ NO'}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setEppOk(!eppOk)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setEppOk(!eppOk); } }}
          className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 ${eppOk ? 'neu-pressed' : 'neu-button'}`}
        >
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Usa EPP</span>
          <span className={`text-xl font-black ${eppOk ? 'text-[#00d4ff]' : 'text-red-500'}`}>{eppOk ? '✓ OK' : '✗ OBS'}</span>
        </div>
      </div>

      {/* Botón enviar */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="w-full py-5 bg-gradient-to-r from-[#0047AB] to-[#00d4ff] text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
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
