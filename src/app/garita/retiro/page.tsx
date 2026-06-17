'use client';

import React, { useState, useRef } from 'react';
import { ShoppingBag, ArrowLeft, Send, CheckCircle2, Search, User, Hash, FileText } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function RetiroClientesForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [dni, setDni] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [ordenVenta, setOrdenVenta] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Búsqueda por DNI
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);
  const dniRef = useRef<HTMLInputElement>(null);

  const handleDniBlur = async () => {
    if (!dni || dni.length < 8) return;
    setIsSearching(true);
    setFound(false);
    try {
      // Buscar en registros anteriores de retiro
      const { data } = await supabase
        .from('registro_retiro_clientes')
        .select('nombre_cliente')
        .eq('dni', dni)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.nombre_cliente) {
        setNombreCliente(data.nombre_cliente);
        setFound(true);
      }
    } catch (_) {
      // Silenciar error de búsqueda previa
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !nombreCliente || !ordenVenta) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const now = new Date();
      const fecha = now.toISOString().split('T')[0];
      const hora = now.toTimeString().split(' ')[0];

      const { error } = await supabase
        .from('registro_retiro_clientes')
        .insert({
          fecha,
          hora_ingreso: hora,
          dni: dni.trim(),
          nombre_cliente: nombreCliente.trim().toUpperCase(),
          orden_venta: ordenVenta.trim().toUpperCase(),
          observaciones: observaciones.trim() || null,
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => router.push('/garita'), 2500);
    } catch (err: any) {
      setSubmitError(err?.message || err?.details || JSON.stringify(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4 px-6">
        <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-sky-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Retiro Registrado!</h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          El cliente <span className="font-bold text-slate-700 dark:text-white">{nombreCliente}</span> ha sido
          registrado para retirar la orden <span className="font-black text-sky-400">{ordenVenta}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Header */}
      <div className="flex items-center gap-4 mt-2">
        <Link
          href="/garita"
          className="w-10 h-10 rounded-xl glass-panel hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-slate-800 dark:text-white"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <ShoppingBag className="text-sky-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Retiro de Producto</h2>
            <p className="text-[11px] text-sky-400 font-bold uppercase tracking-wider mt-0.5">Cliente · Exclusa de Seguridad</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* DNI */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <label htmlFor="input-dni" className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
              <Hash className="w-3 h-3" /> DNI del Cliente
              {isSearching && <span className="text-sky-400 animate-pulse text-[9px] font-black">Buscando...</span>}
              {found && !isSearching && <span className="text-green-500 text-[9px] font-black">✓ Encontrado</span>}
            </label>
            <input
              id="input-dni"
              ref={dniRef}
              required
              type="number"
              inputMode="numeric"
              placeholder="Ingrese el número de DNI"
              value={dni}
              onChange={e => { setDni(e.target.value); setFound(false); }}
              onBlur={handleDniBlur}
              className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-4 text-2xl font-black text-slate-800 dark:text-white focus:outline-none focus:border-sky-400/50 tracking-widest text-center transition-colors"
            />
          </div>

          {/* Nombre del cliente */}
          <div>
            <label htmlFor="input-nombre" className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
              <User className="w-3 h-3" /> Nombre Completo
            </label>
            <input
              id="input-nombre"
              required
              type="text"
              placeholder="Nombres y Apellidos"
              value={nombreCliente}
              onChange={e => setNombreCliente(e.target.value)}
              className={`w-full neumorphic-inset bg-white/50 dark:bg-black/20 border rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none transition-colors uppercase ${found ? 'border-green-400/50 dark:border-green-500/40' : 'border-slate-400/30 dark:border-white/10 focus:border-sky-400/50'}`}
            />
          </div>
        </div>

        {/* Orden de venta */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="input-orden" className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
            <FileText className="w-3 h-3" /> Código de Orden de Venta
          </label>
          <input
            id="input-orden"
            required
            type="text"
            placeholder="Ej: OV-2026-00123"
            value={ordenVenta}
            onChange={e => setOrdenVenta(e.target.value)}
            className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-4 text-xl font-black text-slate-800 dark:text-white focus:outline-none focus:border-sky-400/50 uppercase tracking-widest text-center transition-colors"
          />
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Código del comprobante o documento de entrega
          </p>
        </div>

        {/* Observaciones */}
        <div className="glass-panel p-4 rounded-2xl">
          <label htmlFor="input-obs" className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block mb-2">
            Observaciones (Opcional)
          </label>
          <textarea
            id="input-obs"
            placeholder="Ej: Retira mercadería parcial, presenta guía de remisión..."
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            rows={2}
            className="w-full neumorphic-inset bg-white/50 dark:bg-black/20 border border-slate-400/30 dark:border-white/10 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sky-400/50 resize-none"
          />
        </div>

        {/* Error */}
        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold break-all">
            ⚠ Error: {submitError}
          </div>
        )}

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isSubmitting || !dni || !nombreCliente || !ordenVenta}
          className="w-full py-4 bg-gradient-to-r from-sky-600 to-sky-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR RETIRO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
