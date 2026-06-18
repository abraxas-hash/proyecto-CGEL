'use client';

import React, { useState } from 'react';
import { PackagePlus, ArrowLeft, Send, CheckCircle2, Camera } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { uploadEvidence } from '@/lib/storageHelper';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useRouter } from 'next/navigation';

const MATERIALES = [
  'Tubería PVC',
  'Tubería EMT',
  'Conductor eléctrico',
  'Carrete de cable',
  'Parihuela / Pallet',
  'Fitting / Accesorio',
  'Tablero eléctrico',
  'Luminaria',
  'Otro',
];
const UNIDADES = ['UND', 'MT', 'ML', 'RLL', 'KG', 'PAQ', 'CJA'];

export default function IngresoMaterialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [material, setMaterial] = useState('');
  const [materialCustom, setMaterialCustom] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('UND');
  const [guia, setGuia] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [operarioNombre, setOperarioNombre] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!material || !cantidad || !proveedor || !operarioNombre) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      let urlFoto: string | null = null;

      if (fotoFile) {
        urlFoto = await uploadEvidence('almacen-externo', fotoFile);
      }

      const { error: dbError } = await supabase
        .from('almacen_externo_movimientos')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora: now.toTimeString().split(' ')[0],
          tipo: 'INGRESO',
          descripcion_material: (material === 'Otro' ? materialCustom : material).toUpperCase(),
          cantidad: cantidad.trim(),
          unidad,
          guia_referencia: guia.trim().toUpperCase() || null,
          autorizado_por: proveedor.toUpperCase(),
          operario_nombre: operarioNombre.toUpperCase(),
          url_foto: urlFoto,
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
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Ingreso Registrado!</h2>
        <p className="text-slate-500 text-sm">
          <span className="font-bold text-slate-700 dark:text-white">{material === 'Otro' ? materialCustom : material}</span> — {cantidad} {unidad} almacenado.
        </p>
        <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Bitácora actualizada</p>
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
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <PackagePlus className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">Ingreso de Material</h2>
            <p className="text-[11px] text-green-400 font-bold uppercase tracking-wider">Almacén Externo · Recepción</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Material */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Material que ingresa</p>
          <div>
            <label htmlFor="material" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Tipo de Material</label>
            <select
              id="material" required
              value={material}
              onChange={e => setMaterial(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="">— Selecciona —</option>
              {MATERIALES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {material === 'Otro' && (
            <input
              required type="text"
              placeholder="Especifique el material..."
              value={materialCustom}
              onChange={e => setMaterialCustom(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-green-400/30 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="cantidad" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Cantidad</label>
              <input
                id="cantidad" required type="text"
                placeholder="Ej: 100"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
                className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xl font-black text-slate-800 dark:text-white text-center focus:outline-none"
              />
            </div>
            <div className="w-28">
              <label htmlFor="unidad" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Unidad</label>
              <select
                id="unidad"
                value={unidad}
                onChange={e => setUnidad(e.target.value)}
                className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
              >
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Proveedor y guía */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Datos de Recepción</p>
          <div>
            <label htmlFor="guia" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">N° Guía de Remisión</label>
            <input
              id="guia" type="text"
              placeholder="Ej: 001-00123456 (opcional)"
              value={guia}
              onChange={e => setGuia(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          </div>
          <div>
            <label htmlFor="proveedor" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Proveedor / Empresa de Origen</label>
            <input
              id="proveedor" required type="text"
              placeholder="Nombre del proveedor"
              value={proveedor}
              onChange={e => setProveedor(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          </div>
          <div>
            <label htmlFor="operario" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Operario que Recepciona</label>
            <input
              id="operario" required type="text"
              placeholder="Nombre del operario"
              value={operarioNombre}
              onChange={e => setOperarioNombre(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          </div>
        </div>

        {/* Foto */}
        <div className="glass-panel p-4 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <Camera className="w-3 h-3" /> Evidencia Fotográfica (opcional)
          </p>
          <ImageUpload onImageChange={setFotoFile} label="Fotografiar la mercadería recibida" />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">⚠ {error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !material || !cantidad || !proveedor || !operarioNombre}
          className="w-full py-4 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR INGRESO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
