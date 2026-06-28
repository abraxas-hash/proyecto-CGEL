'use client';

import React, { useState, useEffect } from 'react';
import { Package, ArrowLeft, Send, CheckCircle2, LogOut, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';
import { FichaDiariaForm } from '@/components/garita/FichaDiariaForm';

export default function ProveedoresForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [empresa, setEmpresa] = useState('');
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [dni, setDni] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');
  const [sctrOk, setSctrOk] = useState(true);
  const [eppOk, setEppOk] = useState(true);
  const [observacionesTexto, setObservacionesTexto] = useState('');
  
  // Evidencias
  const [guiaFile, setGuiaFile] = useState<File | null>(null);
  const [estibaFile, setEstibaFile] = useState<File | null>(null);
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [existingDniUrl, setExistingDniUrl] = useState<string | null>(null);
  const [isSearchingDni, setIsSearchingDni] = useState(false);



  const [activeTab, setActiveTab] = useState<'activos' | 'nuevo' | 'ficha'>('activos');
  const [todaysRecords, setTodaysRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTodaysRecords = async () => {
    setIsLoadingRecords(true);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    const { data, error } = await supabase
      .from('registro_proveedores_carga')
      .select('*')
      .eq('fecha', today)
      .order('hora_llegada', { ascending: false });
    
    if (!error && data) {
      setTodaysRecords(data);
    }
    setIsLoadingRecords(false);
  };

  useEffect(() => {
    fetchTodaysRecords();
  }, []);

  const handleMarcarSalida = async (id: string) => {
    if (!confirm('¿Seguro que deseas marcar la salida de este proveedor?')) return;
    setIsUpdatingStatus(true);
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeStr = formatter.format(now);

      const { error } = await supabase
        .from('registro_proveedores_carga')
        .update({ hora_salida: timeStr })
        .eq('id', id);

      if (error) throw error;
      await fetchTodaysRecords();
    } catch (err) {
      alert('Error al marcar salida.');
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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
        // Search in observaciones for DNI photo
        try {
          const { data: latestObs } = await supabase
            .from('registro_proveedores_carga')
            .select('observaciones')
            .eq('dni', dni)
            .not('observaciones', 'is', null)
            .order('fecha', { ascending: false })
            .limit(1)
            .single();
          if (latestObs && latestObs.observaciones) {
            const obs = typeof latestObs.observaciones === 'string' ? JSON.parse(latestObs.observaciones) : latestObs.observaciones;
            if (obs?.fotos?.dni) {
              setExistingDniUrl(obs.fotos.dni);
            }
          }
        } catch(e) {}
      }
    } catch (err) {
      // Ignorar errores silentes
    } finally {
      setIsSearchingDni(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa || !placa || !conductor) return;
    setSubmitError(null);
    
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 

      let guiaUrl = null;
      let estibaUrl = null;
      let dniUrl = existingDniUrl;

      if (guiaFile) {
        guiaUrl = await uploadEvidence('proveedores', guiaFile);
      }
      if (estibaFile) {
        estibaUrl = await uploadEvidence('proveedores', estibaFile);
      }
      if (dniFile) {
        dniUrl = await uploadEvidence('proveedores', dniFile);
      }

      let observacionesPayload = null;
      if (observacionesTexto || guiaUrl || estibaUrl || dniUrl) {
        observacionesPayload = JSON.stringify({
          texto: observacionesTexto,
          fotos: {
            guias: guiaUrl || null,
            estiba: estibaUrl || null,
            dni: dniUrl || null
          }
        });
      }

      const { error } = await supabase
        .from('registro_proveedores_carga')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora_llegada: timeString,
          empresa: empresa.toUpperCase(),
          placa: placa.toUpperCase(),
          conductor_nombre: conductor.toUpperCase(),
          dni: dni,
          tipo_carga: tipoCarga.toUpperCase(),
          sctr_ok: sctrOk,
          epp_ok: eppOk,
          observaciones: observacionesPayload
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveTab('activos');
        fetchTodaysRecords();
        // Limpiar form
        setEmpresa(''); setPlaca(''); setConductor(''); setDni(''); setTipoCarga(''); setExistingDniUrl(null); setDniFile(null);
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting:', error);
      const msg = error?.message || error?.details || JSON.stringify(error);
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Proveedor Registrado!</h2>
        <p className="text-slate-500 dark:text-gray-400">El ingreso a zona de carga ha sido guardado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
            <Package className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Proveedores</h2>
            <p className="text-[11px] text-green-400 font-bold uppercase tracking-wider mt-0.5">Control de Carga</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-2">
          <button 
            onClick={() => setActiveTab('activos')}
            className={`flex-1 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'activos' ? 'bg-white dark:bg-slate-800 shadow text-green-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Activos
            <span className="bg-green-500/10 text-green-500 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px]">
              {todaysRecords.filter(r => !r.hora_salida).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('ficha')}
            className={`flex-1 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'ficha' ? 'bg-white dark:bg-slate-800 shadow text-green-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Ficha
          </button>
          <button
            onClick={() => setActiveTab('nuevo')}
            className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'nuevo' ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'text-slate-500 hover:bg-white/5'}`}
          >
            + Nuevo
          </button>
      </div>

      {activeTab === 'activos' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Proveedores Hoy</h3>
            <button onClick={fetchTodaysRecords} className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-full" title="Actualizar">
              <RefreshCw className={`w-4 h-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {todaysRecords.filter(r => !r.hora_salida).length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 border border-dashed border-white/10">
              No hay proveedores en patio.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysRecords.filter(r => !r.hora_salida).map(record => (
                <div key={record.id} className="glass-panel p-4 rounded-2xl border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white leading-tight">{record.empresa}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Placa: {record.placa}</p>
                    </div>
                    <div className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 text-green-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-mono font-bold">{record.hora_llegada}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarcarSalida(record.id)}
                    disabled={isUpdatingStatus}
                    className="w-full mt-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" /> Marcar Salida
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Proveedores Retirados</h3>
            <div className="flex flex-col gap-2">
              {todaysRecords.filter(r => r.hora_salida).map(record => (
                <div key={record.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center opacity-60">
                  <div className="truncate pr-4">
                    <h4 className="text-sm font-bold text-white truncate">{record.empresa}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{record.placa}</p>
                  </div>
                  <div className="text-xs font-mono text-gray-400 whitespace-nowrap">
                    {record.hora_llegada} - {record.hora_salida}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ficha' && (
        <FichaDiariaForm tipoFicha="PROVEEDORES" />
      )}

      {activeTab === 'nuevo' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-empresa" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Empresa de Transporte</label>
            <input 
              id="input-empresa"
              required
              type="text" 
              placeholder="Ej: TRANSPORTES SAC"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-placa" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Placa de la Unidad</label>
            <input 
              id="input-placa"
              required
              type="text" 
              placeholder="Ej: T4K-987"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-4 text-xl font-black text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase text-center tracking-widest"
            />
          </div>
          
          <div>
            <label htmlFor="input-tipocarga" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Tipo de Carga</label>
            <input 
              id="input-tipocarga"
              required
              type="text" 
              placeholder="Ej: BOBINAS DE CABLE, MERCADERÍA"
              value={tipoCarga}
              onChange={(e) => setTipoCarga(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-conductor" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Nombre del Conductor</label>
            <input 
              id="input-conductor"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={conductor}
              onChange={(e) => setConductor(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-dni" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest flex items-center gap-2 mb-2">
              DNI del Conductor
              {isSearchingDni && <span className="text-blue-500 animate-pulse text-[9px]">Buscando...</span>}
            </label>
            <input 
              id="input-dni"
              required
              type="number" 
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onBlur={handleDniBlur}
              className={`w-full neumorphic-inset bg-white/50 dark:bg-black/20 border ${isSearchingDni ? 'border-blue-400' : 'border-slate-400/30 dark:border-white/10'} rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 transition-colors`}
            />
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          {existingDniUrl && !dniFile ? (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex flex-col gap-2 relative">
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Foto de DNI recuperada
              </span>
              <img src={existingDniUrl} alt="DNI guardado" className="h-24 w-auto rounded object-cover shadow" />
              <button type="button" onClick={() => setExistingDniUrl(null)} className="absolute top-2 right-2 text-xs bg-white/10 hover:bg-white/20 p-1 px-2 rounded font-bold text-white">Actualizar</button>
            </div>
          ) : (
            <ImageUpload 
              label="Foto del DNI del Conductor" 
              onImageChange={setDniFile} 
            />
          )}

          <ImageUpload 
            label="Foto de Guía de Remisión" 
            onImageChange={setGuiaFile} 
          />
          
          <ImageUpload 
            label="Foto de Estiba / Carga" 
            onImageChange={setEstibaFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas sobre el estado de la carga..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 resize-none"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl grid grid-cols-2 gap-4">
          <div 
            role="button"
            tabIndex={0}
            onClick={() => setSctrOk(!sctrOk)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setSctrOk(!sctrOk);
              }
            }}
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D97736]/50 ${sctrOk ? 'neumorphic-inset bg-black/5 dark:bg-white/5' : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'}`}
          >
            <span className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">SCTR</span>
            <span className={`text-lg font-black ${sctrOk ? 'text-green-500' : 'text-red-500'}`}>{sctrOk ? 'VIGENTE' : 'VENCIDO'}</span>
          </div>
          
          <div 
            role="button"
            tabIndex={0}
            onClick={() => setEppOk(!eppOk)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setEppOk(!eppOk);
              }
            }}
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D97736]/50 ${eppOk ? 'neumorphic-inset bg-black/5 dark:bg-white/5' : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'}`}
          >
            <span className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest">Botas y EPP</span>
            <span className={`text-lg font-black ${eppOk ? 'text-green-500' : 'text-red-500'}`}>{eppOk ? 'OK' : 'OBS'}</span>
          </div>
        </div>

        {/* Error visible en pantalla */}
        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold break-all">
            ⚠ Error: {submitError}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting || !empresa || !placa || !conductor}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-400 text-slate-800 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
      )}
    </div>
  );
}
