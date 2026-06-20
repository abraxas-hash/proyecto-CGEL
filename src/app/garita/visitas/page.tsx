'use client';

import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, Send, CheckCircle2, LogOut, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

export default function VisitasForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [motivo, setMotivo] = useState('');
  const [autorizadoPor, setAutorizadoPor] = useState('');
  const [eppOk, setEppOk] = useState(true);
  const [observacionesTexto, setObservacionesTexto] = useState('');
  const [dniFile, setDniFile] = useState<File | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const [activeTab, setActiveTab] = useState<'activos' | 'nuevo'>('activos');
  const [todaysRecords, setTodaysRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTodaysRecords = async () => {
    setIsLoadingRecords(true);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    const { data, error } = await supabase
      .from('registro_visitas')
      .select('*')
      .eq('fecha', today)
      .order('hora_ingreso', { ascending: false });
    
    if (!error && data) {
      setTodaysRecords(data);
    }
    setIsLoadingRecords(false);
  };

  useEffect(() => {
    fetchTodaysRecords();
  }, []);

  const handleMarcarSalida = async (id: string) => {
    if (!confirm('¿Seguro que deseas marcar la salida de esta visita?')) return;
    setIsUpdatingStatus(true);
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeStr = formatter.format(now);

      const { error } = await supabase
        .from('registro_visitas')
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
        .from('registro_visitas')
        .select('visitante_nombre, empresa')
        .eq('dni', dni)
        .order('fecha', { ascending: false })
        .limit(1)
        .single();
        
      if (data && !error) {
        if (!nombre) setNombre(data.visitante_nombre || '');
        if (!empresa && data.empresa !== 'PARTICULAR') setEmpresa(data.empresa || '');
      }
    } catch (err) {
      // Ignorar errores silentes si no se encuentra
    } finally {
      setIsSearchingDni(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !nombre || !motivo) return;
    
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 
      
      let dniUrl = null;
      if (dniFile) {
        dniUrl = await uploadEvidence('visitas', dniFile);
      }
      
      let observacionesPayload = null;
      if (observacionesTexto || dniUrl) {
        observacionesPayload = JSON.stringify({
          texto: observacionesTexto,
          fotos: {
            dni: dniUrl || null
          }
        });
      }

      const { error } = await supabase
        .from('registro_visitas')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora_ingreso: timeString,
          dni: dni,
          visitante_nombre: nombre.toUpperCase(),
          empresa: empresa.toUpperCase() || 'PARTICULAR',
          motivo: motivo.toUpperCase(),
          autorizado_por: autorizadoPor.toUpperCase(),
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
        setDni(''); setNombre(''); setEmpresa(''); setMotivo(''); setAutorizadoPor('');
      }, 2000);

    } catch (error) {
      console.error('Error submitting:', error);
      alert('Hubo un error al guardar. Verifica los datos.');
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
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Visita Registrada!</h2>
        <p className="text-slate-500 dark:text-gray-400">El ingreso ha sido guardado exitosamente.</p>
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
            <Users className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Visitas</h2>
            <p className="text-[11px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Control de Clientes / Otros</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-2">
        <button
          onClick={() => setActiveTab('activos')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'activos' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-slate-500 hover:bg-white/5'}`}
        >
          En Planta
        </button>
        <button
          onClick={() => setActiveTab('nuevo')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'nuevo' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-slate-500 hover:bg-white/5'}`}
        >
          + Nuevo
        </button>
      </div>
      
      {activeTab === 'activos' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Visitas Hoy</h3>
            <button onClick={fetchTodaysRecords} className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-full" title="Actualizar">
              <RefreshCw className={`w-4 h-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {todaysRecords.filter(r => !r.hora_salida).length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 border border-dashed border-white/10">
              No hay visitas activas en planta.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysRecords.filter(r => !r.hora_salida).map(record => (
                <div key={record.id} className="glass-panel p-4 rounded-2xl border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white leading-tight">{record.visitante_nombre}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{record.empresa}</p>
                    </div>
                    <div className="bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 text-purple-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-mono font-bold">{record.hora_ingreso}</span>
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Visitas Terminadas</h3>
            <div className="flex flex-col gap-2">
              {todaysRecords.filter(r => r.hora_salida).map(record => (
                <div key={record.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center opacity-60">
                  <div className="truncate pr-4">
                    <h4 className="text-sm font-bold text-white truncate">{record.visitante_nombre}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{record.empresa}</p>
                  </div>
                  <div className="text-xs font-mono text-gray-400 whitespace-nowrap">
                    {record.hora_ingreso} - {record.hora_salida}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nuevo' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-dni" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest flex items-center gap-2 mb-2">
              DNI / Carnet Ext.
              {isSearchingDni && <span className="text-blue-500 animate-pulse text-[9px]">Buscando...</span>}
            </label>
            <input 
              id="input-dni"
              required
              type="number" 
              placeholder="Ej: 71234567"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onBlur={handleDniBlur}
              className={`w-full neumorphic-inset bg-white/50 dark:bg-black/20 border ${isSearchingDni ? 'border-blue-400' : 'border-slate-400/30 dark:border-white/10'} rounded-xl p-4 text-xl font-black text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all`}
            />
          </div>

          <div>
            <label htmlFor="input-nombre" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Nombre Completo</label>
            <input 
              id="input-nombre"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="input-empresa" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Empresa (Opcional)</label>
            <input 
              id="input-empresa"
              type="text" 
              placeholder="Ej: Particular"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-motivo" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Motivo de Visita</label>
            <input 
              id="input-motivo"
              required
              type="text" 
              placeholder="Ej: Reunión comercial, Recojo, etc."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="input-autorizado" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Autorizado Por</label>
            <input 
              id="input-autorizado"
              type="text" 
              placeholder="Nombre del personal interno"
              value={autorizadoPor}
              onChange={(e) => setAutorizadoPor(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <ImageUpload 
            label="Foto del DNI / Documento" 
            onImageChange={setDniFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas adicionales..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
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
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D97736]/50 ${eppOk ? 'neumorphic-out bg-white/5' : 'neumorphic-in bg-red-500/10 border border-red-500/20'}`}
          >
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest">Equipos de Protección (Si ingresa a nave)</span>
            <span className={`text-lg font-black ${eppOk ? 'text-purple-500' : 'text-red-500'}`}>{eppOk ? 'CON EPP' : 'SIN EPP'}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !dni || !nombre || !motivo}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-slate-800 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
      )}
    </div>
  );
}
