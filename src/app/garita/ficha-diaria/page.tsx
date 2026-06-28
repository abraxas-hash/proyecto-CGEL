'use client';

import React, { useState } from 'react';
import { FileText, ArrowLeft, Send, CheckCircle2, Camera } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { uploadEvidence } from '@/lib/storageHelper';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useRouter } from 'next/navigation';

export default function FichaDiariaPage() {
  const router = useRouter();
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
      setError("La foto de la ficha es obligatoria.");
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const urlFoto = await uploadEvidence('fichas_diarias', fotoFile);

      const { error: dbError } = await supabase
        .from('fichas_diarias')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora: now.toTimeString().split(' ')[0],
          turno,
          observaciones: observaciones.trim(),
          url_foto: urlFoto,
        });

      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => router.push('/garita'), 2500);
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4 px-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Ficha Subida!</h2>
        <p className="text-slate-500 text-sm">
          La ficha diaria ha sido almacenada correctamente en el sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2 mb-2">
        <Link href="/garita" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Ficha Diaria</h2>
            <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">Subir Ficha Física</p>
          </div>
        </div>
      </div>

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
            <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Observaciones (Opcional)</label>
            <textarea
              rows={3}
              placeholder="Notas sobre la ficha..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none resize-none uppercase"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <Camera className="w-3 h-3" /> Foto de la Ficha
          </p>
          <ImageUpload onImageChange={setFotoFile} required label="Fotografiar la ficha firmada" />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">⚠ {error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !fotoFile}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-2"
        >
          {isSubmitting ? 'SUBIENDO...' : 'SUBIR FICHA'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
