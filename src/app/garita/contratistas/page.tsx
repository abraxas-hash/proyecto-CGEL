'use client';

import React, { useState } from 'react';
import { HardHat, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
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
        router.push('/garita');
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
        <h2 className="text-2xl font-black text-white mb-2">¡Contratista Registrado!</h2>
        <p className="text-gray-400">El inicio de labores ha sido guardado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/garita"
          className="w-10 h-10 rounded-xl neu-button flex items-center justify-center text-white"
          aria-label="Volver al menú de garita"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center">
            <HardHat className="text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">Contratistas</h2>
            <p className="text-[11px] text-orange-400 font-bold uppercase tracking-wider mt-0.5">Trabajos Internos</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-empresa" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Empresa Contratista</label>
            <input 
              id="input-empresa"
              required
              type="text" 
              placeholder="Ej: SERVICIOS GENERALES SAC"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-actividad" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Actividad / Trabajo a realizar</label>
            <textarea 
              id="input-actividad"
              required
              placeholder="Mantenimiento de techos, pintura, etc."
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              className="w-full h-24 neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none custom-scrollbar uppercase"
            />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-supervisor" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Supervisor Responsable</label>
            <input 
              id="input-supervisor"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-personal" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Cantidad de Personal Aprox.</label>
            <input 
              id="input-personal"
              required
              type="number" 
              min="1"
              value={personalAproximado}
              onChange={(e) => setPersonalAproximado(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <ImageUpload 
            label="Foto de Seguro SCTR (Listado)" 
            onImageChange={setSctrFile} 
          />
          
          <ImageUpload 
            label="Foto de Ingreso de Herramientas" 
            onImageChange={setHerramientasFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas adicionales..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !empresa || !supervisor || !actividad}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
