'use client';

import React, { useState, useEffect } from 'react';
import { HardHat, ArrowLeft, Send, CheckCircle2, LogOut, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

export default function ContratistasForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [empresa, setEmpresa] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [actividad, setActividad] = useState('');
  const [personalAproximado, setPersonalAproximado] = useState('1');
  const [observacionesTexto, setObservacionesTexto] = useState('');
  
  // Evidencias
  const [sctrFile, setSctrFile] = useState<File | null>(null);
  const [herramientasFile, setHerramientasFile] = useState<File | null>(null);



  const [activeTab, setActiveTab] = useState<'activos' | 'nuevo'>('activos');
  const [todaysRecords, setTodaysRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTodaysRecords = async () => {
    setIsLoadingRecords(true);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    const { data, error } = await supabase
      .from('registro_contratistas')
      .select('*')
      .eq('fecha', today)
      .order('hora_inicio', { ascending: false });
    
    if (!error && data) {
      setTodaysRecords(data);
    }
    setIsLoadingRecords(false);
  };

  useEffect(() => {
    fetchTodaysRecords();
  }, []);

  const handleMarcarSalida = async (id: string) => {
    if (!confirm('¿Seguro que deseas marcar el fin de trabajo de este contratista?')) return;
    setIsUpdatingStatus(true);
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeStr = formatter.format(now);

      const { error } = await supabase
        .from('registro_contratistas')
        .update({ hora_fin: timeStr })
        .eq('id', id);

      if (error) throw error;
      await fetchTodaysRecords();
    } catch (err) {
      alert('Error al marcar fin de trabajo.');
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa || !supervisor || !actividad) return;
    
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 

      let sctrUrl = null;
      let herramientasUrl = null;

      if (sctrFile) {
        sctrUrl = await uploadEvidence('contratistas', sctrFile);
      }
      if (herramientasFile) {
        herramientasUrl = await uploadEvidence('contratistas', herramientasFile);
      }

      const defaultObs = `Ingreso con aprox ${personalAproximado} trabajadores.`;
      const combinedObs = observacionesTexto ? `${defaultObs}\n${observacionesTexto}` : defaultObs;

      let observacionesPayload = null;
      if (combinedObs || sctrUrl || herramientasUrl) {
        observacionesPayload = JSON.stringify({
          texto: combinedObs,
          fotos: {
            sctr: sctrUrl || null,
            herramientas: herramientasUrl || null
          }
        });
      }

      // Guardamos la cabecera del contratista
      const { error } = await supabase
        .from('registro_contratistas')
        .insert({
          fecha: now.toISOString().split('T')[0],
          empresa: empresa.toUpperCase(),
          supervisor: supervisor.toUpperCase(),
          actividad: actividad.toUpperCase(),
          hora_inicio: timeString,
          observaciones: observacionesPayload
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveTab('activos');
        fetchTodaysRecords();
        // Limpiar form
        setEmpresa(''); setSupervisor(''); setActividad(''); setPersonalAproximado('1'); setObservacionesTexto('');
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
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Contratista Registrado!</h2>
        <p className="text-slate-500 dark:text-gray-400">El inicio de labores ha sido guardado.</p>
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
            <HardHat className="text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Contratistas</h2>
            <p className="text-[11px] text-orange-400 font-bold uppercase tracking-wider mt-0.5">Trabajos Internos</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-2">
        <button
          onClick={() => setActiveTab('activos')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'activos' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-slate-500 hover:bg-white/5'}`}
        >
          En Trabajo
        </button>
        <button
          onClick={() => setActiveTab('nuevo')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'nuevo' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-slate-500 hover:bg-white/5'}`}
        >
          + Nuevo
        </button>
      </div>

      {activeTab === 'activos' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Trabajos Hoy</h3>
            <button onClick={fetchTodaysRecords} className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-full" title="Actualizar">
              <RefreshCw className={`w-4 h-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {todaysRecords.filter(r => !r.hora_fin).length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 border border-dashed border-white/10">
              No hay contratistas laborando ahora.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysRecords.filter(r => !r.hora_fin).map(record => (
                <div key={record.id} className="glass-panel p-4 rounded-2xl border-l-4 border-l-orange-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white leading-tight">{record.empresa}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sup: {record.supervisor}</p>
                    </div>
                    <div className="bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-mono font-bold">{record.hora_inicio}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarcarSalida(record.id)}
                    disabled={isUpdatingStatus}
                    className="w-full mt-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" /> Finalizar Trabajo
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Trabajos Finalizados</h3>
            <div className="flex flex-col gap-2">
              {todaysRecords.filter(r => r.hora_fin).map(record => (
                <div key={record.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center opacity-60">
                  <div className="truncate pr-4">
                    <h4 className="text-sm font-bold text-white truncate">{record.empresa}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{record.supervisor}</p>
                  </div>
                  <div className="text-xs font-mono text-gray-400 whitespace-nowrap">
                    {record.hora_inicio} - {record.hora_fin}
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
            <label htmlFor="input-empresa" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Empresa Contratista</label>
            <input 
              id="input-empresa"
              required
              type="text" 
              placeholder="Ej: SERVICIOS GENERALES SAC"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-actividad" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Actividad / Trabajo a realizar</label>
            <textarea 
              id="input-actividad"
              required
              placeholder="Mantenimiento de techos, pintura, etc."
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              className="w-full h-24 neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 resize-none custom-scrollbar uppercase"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-supervisor" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Supervisor Responsable</label>
            <input 
              id="input-supervisor"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-personal" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Cantidad de Personal Aprox.</label>
            <input 
              id="input-personal"
              required
              type="number" 
              min="1"
              value={personalAproximado}
              onChange={(e) => setPersonalAproximado(e.target.value)}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50"
            />
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <ImageUpload 
            label="Foto de Seguro SCTR (Listado)" 
            onImageChange={setSctrFile} 
          />
          
          <ImageUpload 
            label="Foto de Ingreso de Herramientas" 
            onImageChange={setHerramientasFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas adicionales..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !empresa || !supervisor || !actividad}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-400 text-slate-800 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
      )}
    </div>
  );
}
