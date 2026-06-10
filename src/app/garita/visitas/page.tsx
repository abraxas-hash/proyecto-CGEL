'use client';

import React, { useState } from 'react';
import { Users, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
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
          // Las visitas a zona de oficinas rara vez necesitan SCTR, así que lo omitimos o lo dejamos false
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
        <h2 className="text-2xl font-black text-white mb-2">¡Visita Registrada!</h2>
        <p className="text-gray-400">El ingreso ha sido guardado exitosamente.</p>
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
            <Users className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">Visitas</h2>
            <p className="text-[11px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Control de Clientes / Otros</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-dni" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">DNI / Carnet Ext.</label>
            <input 
              id="input-dni"
              required
              type="number" 
              placeholder="Ej: 71234567"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full neu-input rounded-xl p-4 text-xl font-black text-white focus:outline-none focus:border-purple-500/50 text-center tracking-widest"
            />
          </div>

          <div>
            <label htmlFor="input-nombre" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Nombre Completo</label>
            <input 
              id="input-nombre"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-empresa" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Empresa (Opcional)</label>
            <input 
              id="input-empresa"
              type="text" 
              placeholder="Ej: Particular"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 uppercase"
            />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-motivo" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Motivo de Visita</label>
            <input 
              id="input-motivo"
              required
              type="text" 
              placeholder="Ej: Reunión comercial, Recojo, etc."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-autorizado" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Autorizado Por</label>
            <input 
              id="input-autorizado"
              type="text" 
              placeholder="Nombre del personal interno"
              value={autorizadoPor}
              onChange={(e) => setAutorizadoPor(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 uppercase"
            />
          </div>
        </div>
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <ImageUpload 
            label="Foto del DNI / Documento" 
            onImageChange={setDniFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas adicionales..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-2xl">
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
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${eppOk ? 'neu-pressed' : 'neu-button'}`}
          >
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Equipos de Protección (Si ingresa a nave)</span>
            <span className={`text-lg font-black ${eppOk ? 'text-purple-500' : 'text-red-500'}`}>{eppOk ? 'CON EPP' : 'SIN EPP'}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !dni || !nombre || !motivo}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
