'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Send, CheckCircle2, AlertTriangle, BookOpen, Clock, Activity, Users, Truck, Flame, Package, Share2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CuadernoPage() {
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
            <BookOpen className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
              Cuaderno Virtual
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-wider mt-0.5 text-red-500">
              Ocurrencias / Cierre
            </p>
          </div>
        </div>
      </div>

      <NuevaOcurrenciaTab />
    </div>
  );
}

// ==========================================
// TAB 1: NUEVA OCURRENCIA (Original)
// ==========================================
function NuevaOcurrenciaTab() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  const fetchHistorial = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('cuaderno_ocurrencias')
        .select('*')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .order('created_at', { ascending: false });

      if (data) setHistorial(data);
    } catch (e) { } finally {
      setLoadingHistorial(false);
    }
  };

  const handleShareWhatsApp = (oc: any) => {
    const time = new Date(oc.created_at).toLocaleString('es-ES');
    let message = `*Reporte de Ocurrencia*\n`;
    message += `Fecha y Hora: ${time}\n`;
    message += `Turno: ${oc.turno}\n`;
    message += `Estado Equipos: ${oc.estado_equipos || 'Sin detalle'}\n`;
    message += `Novedades:\n${oc.novedades}\n`;
    
    if (oc.foto_url) {
       message += `\n*Evidencia Fotográfica:*\n${oc.foto_url}`;
    }

    const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  useEffect(() => {
    fetchHistorial();
  }, [success]);
  
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
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novedades) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `ocurrencias/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('cgel-evidencias').upload(filePath, photo);
        if (!uploadError) {
          const { data } = supabase.storage.from('cgel-evidencias').getPublicUrl(filePath);
          photoUrl = data.publicUrl;
        }
      }

      const { error } = await supabase
        .from('cuaderno_ocurrencias')
        .insert({ turno, novedades, estado_equipos: estadoEquipos, foto_url: photoUrl, agente_id: user?.id });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push('/garita'), 2000);
    } catch (error) {
      alert('Hubo un error al guardar. Verifica la conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">¡Novedad Registrada!</h2>
        <p className="text-slate-500 dark:text-gray-400">El cuaderno ha sido actualizado para este turno.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8 animate-in fade-in duration-300">
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <div>
          <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">Turno</label>
          <select 
            value={turno} onChange={(e) => setTurno(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-slate-800 dark:text-white font-bold"
          >
            <option value="MAÑANA">MAÑANA (07:00 - 15:00)</option>
            <option value="TARDE">TARDE (15:00 - 23:00)</option>
            <option value="NOCHE">NOCHE (23:00 - 07:00)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">Novedades y Ocurrencias</label>
          <textarea 
            required rows={4} placeholder="Escribe aquí si hubo algún incidente, entrega de llaves, observaciones especiales..."
            value={novedades} onChange={(e) => setNovedades(e.target.value.toUpperCase())}
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-slate-800 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">Estado de Equipos (Garita)</label>
          <textarea 
            rows={2} placeholder="Radios, Lámparas, Computadora, Llaves..."
            value={estadoEquipos} onChange={(e) => setEstadoEquipos(e.target.value.toUpperCase())}
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-slate-800 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-widest mb-2 block">Evidencia Fotográfica (Opcional)</label>
          <div className="flex items-center gap-4">
            <button
              type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-3 rounded-xl transition-colors text-slate-700 dark:text-slate-300 font-bold text-sm"
            >
              <Camera className="w-5 h-5" /> {photoPreview ? 'Cambiar Foto' : 'Tomar Foto'}
            </button>
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoCapture} className="hidden" />
            {photoPreview && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-red-500">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit" disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 disabled:opacity-50 mt-4"
      >
        {isSubmitting ? <span className="animate-pulse">Guardando...</span> : <><Send className="w-5 h-5" /> Registrar en Cuaderno</>}
      </button>

      {/* Historial Reciente */}
      <div className="mt-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" /> Historial Reciente
        </h3>
        
        {loadingHistorial ? (
          <div className="text-center p-4 text-slate-400 text-sm">Cargando historial...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {historial.map((oc, i) => (
              <div key={i} className="glass-panel p-3 rounded-xl border-l-4 border-l-red-500">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-red-500">{new Date(oc.created_at).toLocaleString('es-ES')}</span>
                  <span className="text-[10px] font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    TURNO {oc.turno}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm text-slate-800 dark:text-white font-medium line-clamp-2 flex-1">{oc.novedades}</p>
                  <button 
                    onClick={() => handleShareWhatsApp(oc)}
                    type="button"
                    className="p-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg border border-[#25D366]/30 transition-all shrink-0"
                    title="Compartir por WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {historial.length === 0 && (
              <p className="text-center text-sm text-slate-500 p-4">No hay ocurrencias recientes registradas.</p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}


