'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ArrowLeft, Send, CheckCircle2, Truck, Plus, Clock, Camera, History } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

// --- MAIN PAGE COMPONENT ---
export default function GasMontacargaPage() {
  const [activeTab, setActiveTab] = useState<'GAS' | 'ALQUILER'>('GAS');

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER GLOBAL */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/garita"
          className="w-10 h-10 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-center text-slate-800 dark:text-white"
          aria-label="Volver al menú de garita"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center">
            {activeTab === 'GAS' ? (
              <Flame className="text-orange-500 w-6 h-6" />
            ) : (
              <Truck className="text-sky-500 w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
              {activeTab === 'GAS' ? 'Gas Montacarga' : 'Alquiler Montacarga'}
            </h2>
            <p className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${activeTab === 'GAS' ? 'text-orange-500' : 'text-sky-500'}`}>
              {activeTab === 'GAS' ? 'Cambio de Balones' : 'Carretes Pesados'}
            </p>
          </div>
        </div>
      </div>

      {/* TABS BUTTONS */}
      <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('GAS')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'GAS'
              ? 'bg-white dark:bg-slate-800 shadow-sm text-orange-500'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Intercambio de Gas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ALQUILER')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'ALQUILER'
              ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Alquiler Montacarga
        </button>
      </div>

      {/* RENDER CONTENT BASED ON TAB */}
      {activeTab === 'GAS' ? <GasFormTab /> : <AlquilerTab />}
    </div>
  );
}


// ==========================================
// TAB 1: GAS MONTACARGA
// ==========================================
function GasFormTab() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [empresa, setEmpresa] = useState('');
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [dni, setDni] = useState('');
  const [balonesLlenos, setBalonesLlenos] = useState<number | ''>('');
  const [balonesVacios, setBalonesVacios] = useState<number | ''>('');
  const [boletaFile, setBoletaFile] = useState<File | null>(null);
  const [balonesFile, setBalonesFile] = useState<File | null>(null);
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

      if (boletaFile) boletaUrl = await uploadEvidence('proveedores', boletaFile);
      if (balonesFile) balonesUrl = await uploadEvidence('proveedores', balonesFile);

      const observacionesPayload = JSON.stringify({
        texto: `Ingreso de Gas Montacarga. Balones Llenos Ingresados: ${balonesLlenos}. Balones Vacíos Retirados: ${balonesVacios}.`,
        detalles_gas: {
          llenos_ingreso: balonesLlenos,
          vacios_salida: balonesVacios
        },
        fotos: {
          guias: boletaUrl || null,
          estiba: balonesUrl || null
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
          sctr_ok: true,
          epp_ok: true,
          observaciones: observacionesPayload
        });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push('/garita'), 2000);
    } catch (err: any) {
      console.error('Error enviando registro:', err);
      setSubmitError(err.message || 'Error al guardar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4 px-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Gas Registrado!</h2>
        <p className="text-slate-500 dark:text-gray-400">El reporte de intercambio fue guardado correctamente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8 animate-in fade-in duration-300">
      {/* Datos del Conductor */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Datos del Proveedor</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest flex items-center gap-2 mb-2">
              DNI
              {isSearchingDni && <span className="text-blue-500 animate-pulse text-[9px]">Buscando...</span>}
            </label>
            <input 
              required
              type="number" 
              placeholder="Ej: 71234567"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onBlur={handleDniBlur}
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">
              Nombre del Conductor
            </label>
            <input 
              required
              type="text" 
              placeholder="Ej: JUAN PEREZ"
              value={conductor}
              onChange={(e) => setConductor(e.target.value.toUpperCase())}
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">
              Empresa
            </label>
            <input 
              required
              type="text" 
              placeholder="Ej: ZETA GAS"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">
              Placa de Vehículo
            </label>
            <input 
              required
              type="text" 
              placeholder="Ej: ABC-123"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Control de Intercambio Numérico */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Intercambio de Balones</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center bg-green-500/10 p-4 rounded-xl border border-green-500/20">
            <label className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest mb-2 text-center">
              Llenos (Ingresan)
            </label>
            <input 
              required
              type="number" 
              placeholder="0"
              min="0"
              value={balonesLlenos}
              onChange={(e) => setBalonesLlenos(parseInt(e.target.value) || '')}
              className="w-full max-w-[120px] text-center text-3xl font-black bg-transparent border-none rounded-xl py-2 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-green-700 dark:text-green-300 placeholder:text-green-700/30"
            />
          </div>
          <div className="flex flex-col items-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <label className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-widest mb-2 text-center">
              Vacíos (Salen)
            </label>
            <input 
              required
              type="number" 
              placeholder="0"
              min="0"
              value={balonesVacios}
              onChange={(e) => setBalonesVacios(parseInt(e.target.value) || '')}
              className="w-full max-w-[120px] text-center text-3xl font-black bg-transparent border-none rounded-xl py-2 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-red-700 dark:text-red-300 placeholder:text-red-700/30"
            />
          </div>
        </div>
      </div>

      {/* Evidencias Fotográficas */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Evidencias Fotográficas</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload label="Foto de Boleta / Guía" onImageChange={setBoletaFile} />
          <ImageUpload label="Foto de los Balones" onImageChange={setBalonesFile} />
        </div>
      </div>

      {/* Botón Guardar */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 disabled:opacity-50 mt-4"
      >
        {isSubmitting ? (
          <span className="animate-pulse">Guardando reporte...</span>
        ) : (
          <>
            <Send className="w-5 h-5" /> Registrar Intercambio
          </>
        )}
      </button>

      {submitError && (
        <p className="text-xs text-red-500 text-center font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
          {submitError}
        </p>
      )}
    </form>
  );
}


// ==========================================
// TAB 2: ALQUILER DE MONTACARGA
// ==========================================
function AlquilerTab() {
  const router = useRouter();
  
  // State for Lists
  const [enProgreso, setEnProgreso] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Views: 'LIST' | 'NEW' | 'COMPLETE'
  const [view, setView] = useState<'LIST' | 'NEW' | 'COMPLETE'>('LIST');
  const [selectedRental, setSelectedRental] = useState<any | null>(null);

  // Form State for NEW
  const [dni, setDni] = useState('');
  const [conductor, setConductor] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [placa, setPlaca] = useState('');
  const [fotoEntrada, setFotoEntrada] = useState<File | null>(null);
  const [isSearchingDni, setIsSearchingDni] = useState(false);

  // Form State for COMPLETE
  const [fotoTrabajando, setFotoTrabajando] = useState<File | null>(null);
  const [fotoSalida, setFotoSalida] = useState<File | null>(null);
  const [horaSalida, setHoraSalida] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Open Rentals
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registro_proveedores_carga')
        .select('*')
        .eq('tipo_carga', 'ALQUILER MONTACARGA')
        .order('fecha', { ascending: false })
        .order('hora_llegada', { ascending: false })
        .limit(30);

      if (data && !error) {
        // Filtrar aquellos donde observaciones.estado === 'EN_PROGRESO'
        const activos = data.filter(r => {
          if (!r.observaciones) return false;
          try {
            const obs = typeof r.observaciones === 'string' ? JSON.parse(r.observaciones) : r.observaciones;
            return obs.estado === 'EN_PROGRESO';
          } catch(e) { return false; }
        });
        setEnProgreso(activos);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

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
    } catch (err) { } finally { setIsSearchingDni(false); }
  };

  const handleStartRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !conductor || !empresa || !fotoEntrada) return alert("Falta foto de entrada o datos básicos.");
    setIsSubmitting(true);
    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 

      let entradaUrl = await uploadEvidence('proveedores', fotoEntrada);

      const observacionesPayload = {
        estado: 'EN_PROGRESO',
        texto: 'Alquiler de montacarga en curso.',
        fotos: { entrada: entradaUrl }
      };

      const { error } = await supabase
        .from('registro_proveedores_carga')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora_llegada: timeString,
          empresa: empresa.toUpperCase(),
          placa: placa.toUpperCase(),
          conductor_nombre: conductor.toUpperCase(),
          dni: dni,
          tipo_carga: 'ALQUILER MONTACARGA',
          sctr_ok: true,
          epp_ok: true,
          observaciones: JSON.stringify(observacionesPayload)
        });

      if (error) throw error;
      
      // Reset and go to list
      setDni(''); setConductor(''); setEmpresa(''); setPlaca(''); setFotoEntrada(null);
      setView('LIST');
      fetchRentals();
    } catch(err) {
      console.error(err);
      alert("Error al guardar alquiler.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental || !fotoTrabajando || !fotoSalida || !horaSalida) {
      return alert("Faltan las fotos o la hora de salida.");
    }
    setIsSubmitting(true);
    try {
      let trajUrl = await uploadEvidence('proveedores', fotoTrabajando);
      let salUrl = await uploadEvidence('proveedores', fotoSalida);

      // Extract existing photos
      let existingObs = typeof selectedRental.observaciones === 'string' 
        ? JSON.parse(selectedRental.observaciones) 
        : selectedRental.observaciones;

      const newPayload = {
        ...existingObs,
        estado: 'COMPLETADO',
        hora_salida_registrada: horaSalida,
        texto: `Alquiler finalizado a las ${horaSalida}.`,
        fotos: {
          ...existingObs.fotos,
          trabajando: trajUrl,
          salida: salUrl
        }
      };

      const { error } = await supabase
        .from('registro_proveedores_carga')
        .update({ observaciones: JSON.stringify(newPayload) })
        .eq('id', selectedRental.id);

      if (error) throw error;
      
      setView('LIST');
      setSelectedRental(null);
      setFotoTrabajando(null);
      setFotoSalida(null);
      setHoraSalida('');
      fetchRentals();
    } catch(err) {
      console.error(err);
      alert("Error completando el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- RENDERS ---
  if (view === 'NEW') {
    return (
      <form onSubmit={handleStartRental} className="flex flex-col gap-5 pb-8 animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 mb-2">
          <button type="button" onClick={() => setView('LIST')} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-black text-slate-800 dark:text-white">Registrar Ingreso (Paso 1)</h3>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border border-sky-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">DNI / Brevete</label>
              <input 
                required type="number" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} onBlur={handleDniBlur}
                className="w-full bg-sky-500/10 text-sky-800 dark:text-sky-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Conductor</label>
              <input 
                required type="text" placeholder="Nombre completo" value={conductor} onChange={(e) => setConductor(e.target.value.toUpperCase())}
                className="w-full bg-sky-500/10 text-sky-800 dark:text-sky-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Empresa de Alquiler</label>
              <input 
                required type="text" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
                className="w-full bg-sky-500/10 text-sky-800 dark:text-sky-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Placa del Montacarga</label>
              <input 
                required type="text" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                className="w-full bg-sky-500/10 text-sky-800 dark:text-sky-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border border-sky-500/20">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Foto Inicial</p>
          <ImageUpload label="Tomar foto del ingreso" onImageChange={setFotoEntrada} />
        </div>

        <button
          type="submit" disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Abriendo Ticket...' : 'Guardar Ingreso'}
        </button>
      </form>
    );
  }

  if (view === 'COMPLETE' && selectedRental) {
    return (
      <form onSubmit={handleCompleteRental} className="flex flex-col gap-5 pb-8 animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 mb-2">
          <button type="button" onClick={() => setView('LIST')} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-black text-slate-800 dark:text-white">Cerrar Alquiler (Paso 2)</h3>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20">
          <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-1">Empresa</p>
          <p className="font-bold text-slate-800 dark:text-white mb-3">{selectedRental.empresa}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-1">Hora Llegada</p>
              <p className="font-bold text-slate-800 dark:text-white">{selectedRental.hora_llegada}</p>
            </div>
            <div>
              <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-1">Conductor</p>
              <p className="font-bold text-slate-800 dark:text-white truncate max-w-[150px]">{selectedRental.conductor_nombre}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border border-sky-500/20">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Hora Salida Oficial</label>
            <input
              type="time" required value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 border border-sky-500/20">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Fotos de Cierre</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload label="1. Foto Realizando Trabajo" onImageChange={setFotoTrabajando} />
            <ImageUpload label="2. Foto de Salida" onImageChange={setFotoSalida} />
          </div>
        </div>

        <button
          type="submit" disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Cerrando Alquiler...' : 'Completar Alquiler'}
        </button>
      </form>
    );
  }

  // DEFAULT VIEW: LIST
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-12">
      <button
        onClick={() => setView('NEW')}
        className="glass-panel p-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-dashed border-sky-500 text-sky-600 dark:text-sky-400 font-black uppercase tracking-widest hover:bg-sky-500/10 transition-colors"
      >
        <Plus className="w-5 h-5" /> Registrar Entrada de Montacarga
      </button>

      <div className="mt-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" /> Alquileres en Curso ({enProgreso.length})
        </h3>
        
        {loading ? (
          <div className="text-center p-6 text-slate-400 animate-pulse text-sm">Buscando alquileres activos...</div>
        ) : enProgreso.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No hay montacargas alquilados operando ahora mismo.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {enProgreso.map(rental => (
              <div 
                key={rental.id}
                onClick={() => { setSelectedRental(rental); setView('COMPLETE'); }}
                className="glass-panel p-4 rounded-2xl border-l-4 border-l-sky-500 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-800 dark:text-white truncate pr-4">{rental.empresa}</h4>
                  <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] px-2 py-1 rounded-md font-black">ACTIVO</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <p><span className="font-bold text-slate-800 dark:text-slate-200">Placa:</span> {rental.placa}</p>
                  <p><span className="font-bold text-slate-800 dark:text-slate-200">Hora Ingreso:</span> {rental.hora_llegada}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-sky-500 font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Completar Registro <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
