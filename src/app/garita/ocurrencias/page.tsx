'use client';

import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Send, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OcurrenciasPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
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
        <h2 className="text-2xl font-black text-white mb-2">¡Ocurrencia Guardada!</h2>
        <p className="text-gray-400">El reporte de turno ha sido registrado con éxito.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/garita"
          className="w-10 h-10 rounded-xl neu-button flex items-center justify-center text-white"
          aria-label="Volver al menú de garita"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-white leading-tight">Cuaderno Virtual</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Reporte de Novedades</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Turno Selector */}
        <div className="neu-flat p-4 rounded-2xl">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3">Turno Actual</div>
          <div className="grid grid-cols-3 gap-2">
            {['MAÑANA', 'TARDE', 'NOCHE'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTurno(t)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  turno === t 
                    ? 'bg-[#00d4ff] text-black shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                    : 'neu-button text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Novedades */}
        <div className="neu-flat p-4 rounded-2xl">
          <label htmlFor="input-novedades" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3 flex justify-between items-center">
            Novedades del Turno
            <span className="text-red-400">* Obligatorio</span>
          </label>
          <textarea 
            id="input-novedades"
            required
            value={novedades}
            onChange={(e) => setNovedades(e.target.value)}
            placeholder="Escribe aquí si hubo algún incidente, rondas realizadas, o 'Sin novedades especiales'..."
            className="w-full h-32 neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 resize-none custom-scrollbar"
          />
        </div>

        {/* Estado Equipos */}
        <div className="neu-flat p-4 rounded-2xl">
          <label htmlFor="input-estado-equipos" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3">
            Estado de Equipos (PDAs, Radios)
          </label>
          <textarea 
            id="input-estado-equipos"
            value={estadoEquipos}
            onChange={(e) => setEstadoEquipos(e.target.value)}
            placeholder="Ej: Se entregan 3 PDAs operativas y 2 radios con batería cargada."
            className="w-full h-20 neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 resize-none custom-scrollbar"
          />
        </div>

        {/* Cámara / Evidencia */}
        <div className="neu-flat p-4 rounded-2xl">
          <label htmlFor="input-foto" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3">Evidencia Fotográfica</label>
          
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
                className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur text-white rounded-lg border border-white/20"
              >
                Cambiar foto
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:bg-white/5 hover:border-[#00d4ff]/50 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <span className="text-sm font-bold">Tomar Foto con Celular</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting || !novedades}
          className="w-full py-4 mt-2 bg-gradient-to-r from-[#0047AB] to-[#00d4ff] text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
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
    </div>
  );
}
