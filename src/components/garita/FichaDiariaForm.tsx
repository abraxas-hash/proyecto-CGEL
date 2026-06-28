'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { uploadEvidence } from '@/lib/storageHelper';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface FichaDiariaFormProps {
  tipoFicha: 'VISITAS' | 'PROVEEDORES' | 'REPARTIDORES';
}

export function FichaDiariaForm({ tipoFicha }: FichaDiariaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [turno, setTurno] = useState('MAÑANA');
  const [observaciones, setObservaciones] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fotoFile) {
      setError('La foto de la ficha es obligatoria.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const urlFoto = await uploadEvidence('fichas_diarias', fotoFile);

      // We store the tipoFicha in the observaciones field as JSON just in case the table doesn't have a 'tipo' column
      const observacionesPayload = JSON.stringify({
        tipo: tipoFicha,
        nota: observaciones.trim()
      });

      const { error: dbError } = await supabase
        .from('fichas_diarias')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora: now.toTimeString().split(' ')[0],
          turno,
          observaciones: observacionesPayload,
          url_foto: urlFoto,
        });

      if (dbError) throw dbError;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFotoFile(null);
        setObservaciones('');
      }, 3000);
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white">¡Ficha Subida!</h3>
        <p className="text-slate-500 text-sm max-w-[250px]">
          La ficha de {tipoFicha.toLowerCase()} ha sido almacenada correctamente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        <div>
          <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Turno</label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="MAÑANA">MAÑANA (07:00 - 15:00)</option>
            <option value="TARDE">TARDE (15:00 - 23:00)</option>
            <option value="NOCHE">NOCHE (23:00 - 07:00)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">
            Foto de Ficha de {tipoFicha.toLowerCase()}
          </label>
          <ImageUpload
            onImageCaptured={(file) => setFotoFile(file)}
            currentImage={fotoFile ? URL.createObjectURL(fotoFile) : undefined}
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Observaciones (Opcional)</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Algún detalle adicional..."
            className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none resize-none h-24"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !fotoFile}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/20"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Guardar Ficha
          </>
        )}
      </button>
    </form>
  );
}
