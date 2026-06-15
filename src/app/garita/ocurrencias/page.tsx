'use client';

import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Send, CheckCircle2, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OcurrenciasPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  React.useEffect(() => {
    async function fetchHistorial() {
      try {
        const { data, error } = await supabase
          .from('cuaderno_ocurrencias')
          .select('*, perfiles(nombre, rol)') // Asumiendo que el agente_id enlaza con una tabla perfiles o usuarios si es posible, sino solo mostramos datos crudos
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (!error && data) {
          setHistorial(data);
        }
      } catch (err) {
        console.error('Error fetching historial:', err);
      } finally {
        setLoadingHistorial(false);
      }
    }
    fetchHistorial();
  }, [success]); // Refrescar cuando se guarda una nueva
  
  // Form State
  const [turno, setTurno] = useState('MAÑANA');
  const [novedades, setNovedades] = useState('');
  const [estadoEquipos, setEstadoEquipos] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novedades) return;
    
    setIsSubmitting(true);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      let photoUrl = null;

      // 2. Upload photo if exists
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `ocurrencias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cgel-evidencias')
          .upload(filePath, photo);

        if (!uploadError) {
          const { data } = supabase.storage.from('cgel-evidencias').getPublicUrl(filePath);
          photoUrl = data.publicUrl;
        }
      }

      // 3. Save to database
      // Note: Make sure the 'cuaderno_ocurrencias' table exists in Supabase!
      const { error } = await supabase
        .from('cuaderno_ocurrencias')
        .insert({
          turno,
          novedades,
          estado_equipos: estadoEquipos,
          foto_url: photoUrl,
          agente_id: user?.id,
          // We can let Supabase handle created_at
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/garita');
      }, 2000);

    } catch (error) {
      console.error('Error submitting:', error);
      alert('Hubo un error al guardar. Verifica tu conexión a internet.');
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
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Ocurrencia Guardada!</h2>
        <p className="text-slate-900 dark:text-slate-300 font-black">El reporte de turno ha sido registrado con éxito.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/garita"
          className="w-10 h-10 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-center text-slate-800 dark:text-white"
          aria-label="Volver al menú de garita"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Cuaderno Virtual</h2>
          <p className="text-[11px] text-slate-900 dark:text-slate-300 font-black font-bold uppercase tracking-wider mt-0.5">Reporte de Novedades</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Turno Selector */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-[10px] text-slate-900 dark:text-slate-300 font-black font-bold uppercase tracking-widest block mb-3">Turno Actual</div>
          <div className="grid grid-cols-3 gap-2">
            {['MAÑANA', 'TARDE', 'NOCHE'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTurno(t)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  turno === t 
                    ? 'bg-[#D97736] text-black shadow-[0_0_15px_rgba(217,119,54,0.3)]' 
                    : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-slate-300 font-black'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Novedades */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="input-novedades" className="text-[10px] text-slate-900 dark:text-slate-300 font-black font-bold uppercase tracking-widest block mb-3 flex justify-between items-center">
            Novedades del Turno
            <span className="text-red-400">* Obligatorio</span>
          </label>
          <textarea 
            id="input-novedades"
            required
            value={novedades}
            onChange={(e) => setNovedades(e.target.value)}
            placeholder="Escribe aquí si hubo algún incidente, rondas realizadas, o 'Sin novedades especiales'..."
            className="w-full h-32 neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 resize-none custom-scrollbar"
          />
        </div>

        {/* Estado Equipos */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="input-estado-equipos" className="text-[10px] text-slate-900 dark:text-slate-300 font-black font-bold uppercase tracking-widest block mb-3">
            Estado de Equipos (PDAs, Radios)
          </label>
          <textarea 
            id="input-estado-equipos"
            value={estadoEquipos}
            onChange={(e) => setEstadoEquipos(e.target.value)}
            placeholder="Ej: Se entregan 3 PDAs operativas y 2 radios con batería cargada."
            className="w-full h-20 neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-[#D97736]/50 resize-none custom-scrollbar"
          />
        </div>

        {/* Cámara / Evidencia */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="input-foto" className="text-[10px] text-slate-900 dark:text-slate-300 font-black font-bold uppercase tracking-widest block mb-3">Evidencia Fotográfica</label>
          
          <input 
            id="input-foto"
            type="file" 
            accept="image/*" 
            capture="environment" // Forces back camera on mobile!
            ref={fileInputRef}
            onChange={handlePhotoCapture}
            className="hidden" 
          />

          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Evidencia" className="w-full object-cover max-h-64" />
              <button 
                type="button"
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur text-slate-800 dark:text-white rounded-lg border border-white/20"
              >
                Cambiar foto
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-900 dark:text-slate-300 font-black hover:bg-white/5 hover:border-[#00d4ff]/50 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-slate-800 dark:text-white" />
              </div>
              <span className="text-sm font-bold">Tomar Foto con Celular</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting || !novedades}
          className="w-full py-4 mt-2 bg-gradient-to-r from-[#0047AB] to-[#00d4ff] text-slate-800 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,54,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'FIRMAR Y GUARDAR REPORTE'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
        
        <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 mt-2">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-orange-200/70 leading-tight">
            Al presionar "Firmar", este reporte quedará inmutable en el sistema y asociado a tu usuario. Asegúrate de que la información sea verídica.
          </p>
        </div>

      </form>

      {/* Historial Timeline */}
      <div className="mt-8">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#00d4ff]" />
          Registros Anteriores
        </h3>
        
        {loadingHistorial ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
          </div>
        ) : historial.length === 0 ? (
          <div className="text-center p-6 glass-panel rounded-xl">
            <p className="text-slate-500 font-medium">No hay ocurrencias previas registradas.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-300 dark:border-slate-700 ml-3 space-y-6">
            {historial.map((oc, idx) => (
              <div key={oc.id || idx} className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.5)]"></div>
                <div className="glass-panel p-4 rounded-xl relative group hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-sm">
                      TURNO {oc.turno}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(oc.created_at).toLocaleString('es-PE', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-3 whitespace-pre-wrap">
                    {oc.novedades}
                  </p>
                  
                  {oc.estado_equipos && (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-black/5 dark:bg-black/20 p-2 rounded-lg border border-slate-200 dark:border-white/5">
                      <strong className="block text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">Equipos:</strong>
                      {oc.estado_equipos}
                    </div>
                  )}

                  {oc.foto_url && (
                    <a href={oc.foto_url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-[10px] text-[#00d4ff] hover:underline font-bold uppercase tracking-widest flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Ver Evidencia Adjunta
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
