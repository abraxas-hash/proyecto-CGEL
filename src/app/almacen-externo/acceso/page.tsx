'use client';

import React, { useState } from 'react';
import { DoorOpen, ArrowLeft, Send, CheckCircle2, User, Hash, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AGENTES = ['HALCÓN 3', 'AGENTE GARITA', 'AGENTE NAVE 1', 'OTRO'];
const AREAS = ['OPERACIONES', 'ALMACÉN', 'LOGÍSTICA', 'MANTENIMIENTO', 'ADMINISTRACIÓN'];
const MOTIVOS = [
  'Retiro de material para despacho',
  'Inventario físico',
  'Inspección de stock',
  'Mantenimiento de instalación',
  'Recepción de mercadería',
  'Otro',
];

export default function AccesoAlmacenPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [operarioNombre, setOperarioNombre] = useState('');
  const [operarioDni, setOperarioDni] = useState('');
  const [areaSolicitante, setAreaSolicitante] = useState('OPERACIONES');
  const [motivo, setMotivo] = useState('');
  const [motivoCustom, setMotivoCustom] = useState('');
  const [agenteAbre, setAgenteAbre] = useState('HALCÓN 3');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!operarioNombre || !operarioDni || !motivo) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const { error: dbError } = await supabase
        .from('almacen_externo_accesos')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora_apertura: now.toTimeString().split(' ')[0],
          operario_nombre: operarioNombre.toUpperCase(),
          operario_dni: operarioDni.trim(),
          area_solicitante: areaSolicitante,
          motivo: motivo === 'Otro' ? motivoCustom.toUpperCase() : motivo.toUpperCase(),
          agente_abre: agenteAbre,
        });

      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => router.push('/almacen-externo'), 2500);
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4 px-6">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Acceso Registrado!</h2>
        <p className="text-slate-500 text-sm">
          Operario <span className="font-bold text-slate-700 dark:text-white">{operarioNombre.toUpperCase()}</span> ingresó al almacén externo.
        </p>
        <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Bitácora actualizada · {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2">
        <Link href="/almacen-externo" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-800 dark:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <DoorOpen className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">Apertura de Acceso</h2>
            <p className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider">Almacén Externo · Halcón 3</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Operario */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
            <User className="w-3 h-3" /> Datos del Operario
          </p>
          <div>
            <label htmlFor="dni" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">DNI</label>
            <input
              id="dni" required type="number" inputMode="numeric"
              placeholder="Número de DNI"
              value={operarioDni}
              onChange={e => setOperarioDni(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xl font-black text-slate-800 dark:text-white focus:outline-none focus:border-yellow-400/50 tracking-widest text-center"
            />
          </div>
          <div>
            <label htmlFor="nombre" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Nombre Completo</label>
            <input
              id="nombre" required type="text"
              placeholder="Apellidos y nombres"
              value={operarioNombre}
              onChange={e => setOperarioNombre(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-yellow-400/50 uppercase"
            />
          </div>
        </div>

        {/* Área y motivo */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="area" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Área Solicitante</label>
            <select
              id="area"
              value={areaSolicitante}
              onChange={e => setAreaSolicitante(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
            >
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="motivo" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Motivo de Acceso</label>
            <select
              id="motivo" required
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="">— Selecciona —</option>
              {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {motivo === 'Otro' && (
            <input
              required type="text"
              placeholder="Especifique el motivo..."
              value={motivoCustom}
              onChange={e => setMotivoCustom(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-yellow-400/30 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          )}
        </div>

        {/* Agente que abre */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="agente" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-2 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-yellow-400" /> Agente que Autoriza Apertura
          </label>
          <select
            id="agente"
            value={agenteAbre}
            onChange={e => setAgenteAbre(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
          >
            {AGENTES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Hora de apertura: <strong className="text-slate-600 dark:text-slate-200">{new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</strong> (se registra al guardar)</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
            ⚠ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !operarioNombre || !operarioDni || !motivo}
          className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR APERTURA'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
