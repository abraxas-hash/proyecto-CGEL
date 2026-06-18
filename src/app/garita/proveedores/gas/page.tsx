'use client';

import React, { useState } from 'react';
import { Flame, ArrowLeft, Send, CheckCircle2, Truck } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

export default function GasMontacargaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [empresa, setEmpresa] = useState('');
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [dni, setDni] = useState('');
  
  // Gas specific state
  const [balonesLlenos, setBalonesLlenos] = useState<number | ''>('');
  const [balonesVacios, setBalonesVacios] = useState<number | ''>('');

  // Evidencias
  const [boletaFile, setBoletaFile] = useState<File | null>(null);
  const [balonesFile, setBalonesFile] = useState<File | null>(null);

  // Alquiler Montacarga Extra
  const [registroAlquiler, setRegistroAlquiler] = useState(false);
  const [horaEntradaMontacarga, setHoraEntradaMontacarga] = useState('');
  const [horaSalidaMontacarga, setHoraSalidaMontacarga] = useState('');
  const [fotoMontacargaFile, setFotoMontacargaFile] = useState<File | null>(null);

  const [isSearchingDni, setIsSearchingDni] = useState(false);

  const handleDniBlur = async () => {
    if (!dni || dni.length < 8) return;
    setIsSearchingDni(true);
    try {
      const { data, error } = await supabase
        .from('registro_proveedores_carga')
        .select('conductor_nombre, empresa, placa')
        .eq('dni', dni)
        .order('fecha', { ascending: false })
        .limit(1)
        .single();
        
      if (data && !error) {
        if (!conductor) setConductor(data.conductor_nombre || '');
        if (!empresa) setEmpresa(data.empresa || '');
        if (!placa) setPlaca(data.placa || '');
      }
    } catch (err) {
      // Ignorar errores silentes
    } finally {
      setIsSearchingDni(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa || !placa || !conductor || balonesLlenos === '' || balonesVacios === '') return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 

      let boletaUrl = null;
      let balonesUrl = null;

      let fotoMontacargaUrl = null;

      if (boletaFile) {
        boletaUrl = await uploadEvidence('proveedores', boletaFile);
      }
      if (balonesFile) {
        balonesUrl = await uploadEvidence('proveedores', balonesFile);
      }
      if (registroAlquiler && fotoMontacargaFile) {
        fotoMontacargaUrl = await uploadEvidence('proveedores', fotoMontacargaFile);
      }

      // Estructuramos los datos del gas dentro de las observaciones
      const observacionesPayload = JSON.stringify({
        texto: `Ingreso de Gas Montacarga. Llenos: ${balonesLlenos}. Vacíos: ${balonesVacios}.${registroAlquiler ? ` [ALQUILER MONTACARGA REGISTRADO]` : ''}`,
        detalles_gas: {
          llenos_ingreso: balonesLlenos,
          vacios_salida: balonesVacios
        },
        alquiler_montacarga: registroAlquiler ? {
          hora_entrada: horaEntradaMontacarga,
          hora_salida: horaSalidaMontacarga
        } : null,
        fotos: {
          guias: boletaUrl || null,
          estiba: balonesUrl || null,
          montacarga_alquilado: fotoMontacargaUrl || null
        }
      });

      const { error } = await supabase
        .from('registro_proveedores_carga')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora_llegada: timeString,
          empresa: empresa.toUpperCase(),
          placa: placa.toUpperCase(),
          conductor_nombre: conductor.toUpperCase(),
          dni: dni,
          tipo_carga: 'GAS MONTACARGA',
          sctr_ok: true, // Asumido para proveedores rutinarios, o se puede ocultar
          epp_ok: true,
          observaciones: observacionesPayload
        });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Error enviando registro:', err);
      setSubmitError(err.message || 'Error al guardar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4 px-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Gas Registrado!</h2>
        <p className="text-slate-500 text-sm">
          Se han registrado <strong className="text-slate-800 dark:text-white">{balonesLlenos} balones llenos</strong> y el retiro de <strong className="text-slate-800 dark:text-white">{balonesVacios} balones vacíos</strong>.
        </p>
        <p className="text-[10px] text-green-400 font-black uppercase tracking-widest mt-2">Base de datos actualizada</p>
        <button
          onClick={() => router.push('/garita')}
          className="mt-6 glass-panel px-6 py-3 rounded-xl font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Volver a Garita
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header unificado (mismo estilo que Almacén y Garita) */}
      <div className="flex items-center gap-4 mt-2 mb-2">
        <Link href="/garita" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Gas Montacarga</h2>
            <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">Control de Proveedores</p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Conductor y Vehículo */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
            <Truck className="w-3 h-3" /> Datos del Transporte
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">DNI del Conductor</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  onBlur={handleDniBlur}
                  placeholder="Ingrese DNI..."
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400"
                />
                {isSearchingDni && (
                  <div className="absolute right-3 top-3.5">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={conductor}
                onChange={(e) => setConductor(e.target.value)}
                placeholder="Nombre del Conductor..."
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Empresa Proveedora</label>
              <input
                type="text"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ej. ZETA GAS, LLAMAGAS..."
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Placa del Vehículo</label>
              <input
                type="text"
                required
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Ej. ABC-123"
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 uppercase"
              />
            </div>
          </div>
        </div>

        {/* Registro de Intercambio */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-500" /> Intercambio de Balones
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Llenos (Ingresan)</label>
              <input
                type="number"
                min="0"
                required
                value={balonesLlenos}
                onChange={(e) => setBalonesLlenos(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
                className="w-full bg-green-500/10 text-green-700 dark:text-green-400 font-bold border-none rounded-xl px-4 py-3 text-center text-lg focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Vacíos (Salen)</label>
              <input
                type="number"
                min="0"
                required
                value={balonesVacios}
                onChange={(e) => setBalonesVacios(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
                className="w-full bg-red-500/10 text-red-700 dark:text-red-400 font-bold border-none rounded-xl px-4 py-3 text-center text-lg focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Evidencias Fotográficas */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Evidencias Fotográficas</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="Foto de Boleta / Guía"
              onImageChange={setBoletaFile}
            />
            <ImageUpload
              label="Foto de los Balones"
              onImageChange={setBalonesFile}
            />
          </div>
        </div>

        {/* ALQUILER DE MONTACARGA (OPCIONAL) */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border-2 border-dashed border-sky-500/30">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={registroAlquiler}
              onChange={(e) => setRegistroAlquiler(e.target.checked)}
              className="w-5 h-5 rounded border-slate-400 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-black uppercase tracking-widest">
              + Registrar Alquiler Montacarga (Carretes Pesados)
            </span>
          </label>

          {registroAlquiler && (
            <div className="flex flex-col gap-4 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Hora Entrada</label>
                  <input
                    type="time"
                    required={registroAlquiler}
                    value={horaEntradaMontacarga}
                    onChange={(e) => setHoraEntradaMontacarga(e.target.value)}
                    className="w-full bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Hora Salida</label>
                  <input
                    type="time"
                    required={registroAlquiler}
                    value={horaSalidaMontacarga}
                    onChange={(e) => setHoraSalidaMontacarga(e.target.value)}
                    className="w-full bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload
                  label="Foto del Montacarga Alquilado"
                  onImageChange={setFotoMontacargaFile}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/20"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Registrar Gas Montacarga</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
