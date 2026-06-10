'use client';

import React, { useState } from 'react';
import { Package, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadEvidence } from '@/lib/storageHelper';

export default function ProveedoresForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa || !placa || !conductor) return;
    
    setIsSubmitting(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; 

      let guiaUrl = null;
      let estibaUrl = null;

      if (guiaFile) {
        guiaUrl = await uploadEvidence('proveedores', guiaFile);
      }
      if (estibaFile) {
        estibaUrl = await uploadEvidence('proveedores', estibaFile);
      }

      let observacionesPayload = null;
      if (observacionesTexto || guiaUrl || estibaUrl) {
        observacionesPayload = JSON.stringify({
          texto: observacionesTexto,
          fotos: {
            guias: guiaUrl || null,
            estiba: estibaUrl || null
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
        <h2 className="text-2xl font-black text-white mb-2">¡Proveedor Registrado!</h2>
        <p className="text-gray-400">El ingreso a zona de carga ha sido guardado.</p>
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
            <Package className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">Proveedores</h2>
            <p className="text-[11px] text-green-400 font-bold uppercase tracking-wider mt-0.5">Control de Carga</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-empresa" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Empresa de Transporte</label>
            <input 
              id="input-empresa"
              required
              type="text" 
              placeholder="Ej: TRANSPORTES SAC"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-green-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-placa" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Placa de la Unidad</label>
            <input 
              id="input-placa"
              required
              type="text" 
              placeholder="Ej: T4K-987"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              className="w-full neu-input rounded-xl p-4 text-xl font-black text-white focus:outline-none focus:border-green-500/50 uppercase text-center tracking-widest"
            />
          </div>
          
          <div>
            <label htmlFor="input-tipocarga" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Tipo de Carga</label>
            <input 
              id="input-tipocarga"
              required
              type="text" 
              placeholder="Ej: BOBINAS DE CABLE, MERCADERÍA"
              value={tipoCarga}
              onChange={(e) => setTipoCarga(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-green-500/50 uppercase"
            />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-conductor" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Nombre del Conductor</label>
            <input 
              id="input-conductor"
              required
              type="text" 
              placeholder="Nombres y Apellidos"
              value={conductor}
              onChange={(e) => setConductor(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-green-500/50 uppercase"
            />
          </div>

          <div>
            <label htmlFor="input-dni" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">DNI del Conductor</label>
            <input 
              id="input-dni"
              required
              type="number" 
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-green-500/50"
            />
          </div>
        </div>
        
        <div className="neu-flat p-4 rounded-2xl flex flex-col gap-4">
          <ImageUpload 
            label="Foto de Guía de Remisión" 
            onImageChange={setGuiaFile} 
          />
          
          <ImageUpload 
            label="Foto de Estiba / Carga" 
            onImageChange={setEstibaFile} 
          />
          
          <div>
            <label htmlFor="input-observaciones" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Observaciones (Opcional)</label>
            <textarea 
              id="input-observaciones"
              placeholder="Notas sobre el estado de la carga..."
              value={observacionesTexto}
              onChange={(e) => setObservacionesTexto(e.target.value)}
              rows={2}
              className="w-full neu-input rounded-xl p-3 text-sm text-white focus:outline-none focus:border-green-500/50 resize-none"
            />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-2xl grid grid-cols-2 gap-4">
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
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${sctrOk ? 'neu-pressed' : 'neu-button'}`}
          >
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SCTR</span>
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
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${eppOk ? 'neu-pressed' : 'neu-button'}`}
          >
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Botas y EPP</span>
            <span className={`text-lg font-black ${eppOk ? 'text-green-500' : 'text-red-500'}`}>{eppOk ? 'OK' : 'OBS'}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !empresa || !placa || !conductor}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'GUARDANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
