'use client';

import React, { useState, useEffect } from 'react';
import { PackageMinus, ArrowLeft, Send, CheckCircle2, Camera, Search, UserCheck } from 'lucide-react';
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

export default function RetiroMaterialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [material, setMaterial] = useState('');
  const [materialCustom, setMaterialCustom] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('UND');
  const [guia, setGuia] = useState('');
  const [autorizadoPor, setAutorizadoPor] = useState('');
  const [operarioDni, setOperarioDni] = useState('');
  const [operarioNombre, setOperarioNombre] = useState('');
  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoFichaFile, setFotoFichaFile] = useState<File | null>(null);

  useEffect(() => {
    if (operarioDni.length === 8) {
      buscarDni();
    }
  }, [operarioDni]);

  const buscarDni = async () => {
    setIsSearchingDni(true);
    try {
      // Buscar en movimientos pasados
      const { data } = await supabase
        .from('almacen_externo_movimientos')
        .select('operario_nombre')
        .eq('operario_dni', operarioDni)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data && data.operario_nombre) {
        setOperarioNombre(data.operario_nombre);
      }
    } catch (e) {
      // no encontrado
    } finally {
      setIsSearchingDni(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!material || !cantidad || !autorizadoPor || !operarioNombre) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      let urlFoto: string | null = null;

      if (fotoFile) {
        urlFoto = await uploadEvidence('almacen-externo', fotoFile);
      }
      let urlFotoFicha: string | null = null;
      if (fotoFichaFile) {
        urlFotoFicha = await uploadEvidence('almacen-externo', fotoFichaFile);
      }

      const { error: dbError } = await supabase
        .from('almacen_externo_movimientos')
        .insert({
          fecha: now.toISOString().split('T')[0],
          hora: now.toTimeString().split(' ')[0],
          tipo: 'RETIRO',
          descripcion_material: (material === 'Otro' ? materialCustom : material).toUpperCase(),
          cantidad: cantidad.trim(),
          unidad,
          guia_referencia: guia.trim().toUpperCase() || null,
          autorizado_por: autorizadoPor.toUpperCase(),
          operario_dni: operarioDni,
          operario_nombre: operarioNombre.toUpperCase(),
          url_foto: urlFoto,
          url_foto_ficha: urlFotoFicha,
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
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Retiro Registrado!</h2>
        <p className="text-slate-500 text-sm">
          <span className="font-bold text-slate-700 dark:text-white">{material === 'Otro' ? materialCustom : material}</span> — {cantidad} {unidad}
        </p>
        <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Bitácora actualizada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2 mb-2">
        <Link href="/almacen-externo" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
            <PackageMinus className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Retiro de Material</h2>
            <p className="text-[11px] text-red-400 font-bold uppercase tracking-wider mt-0.5">Almacén Externo · Salida</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Material */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Material que sale</p>
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
              className="w-full bg-white/50 dark:bg-black/20 border border-red-400/30 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          )}

          {/* Cantidad y unidad */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="cantidad" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Cantidad</label>
              <input
                id="cantidad" required type="text"
                placeholder="Ej: 50"
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

        {/* Autorización */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Autorización</p>
          <div>
            <label htmlFor="guia" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Guía / Orden de Referencia</label>
            <input
              id="guia" type="text"
              placeholder="Ej: GR-001-2026 (opcional)"
              value={guia}
              onChange={e => setGuia(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          </div>
          <div>
            <label htmlFor="autoriza" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">Autorizado Por (Supervisor Sonepar)</label>
            <input
              id="autoriza" required type="text"
              placeholder="Nombre del supervisor"
              value={autorizadoPor}
              onChange={e => setAutorizadoPor(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="operario_dni" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">
                DNI Operario
                {isSearchingDni && <span className="text-red-500 animate-pulse text-[9px] ml-2">Buscando...</span>}
              </label>
              <div className="relative">
                <input
                  id="operario_dni" required type="text" maxLength={8}
                  placeholder="DNI"
                  value={operarioDni}
                  onChange={e => setOperarioDni(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 pr-10 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label htmlFor="operario" className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest block mb-1">
                Nombre del Operario
              </label>
              <div className="relative">
                <input
                  id="operario" required type="text"
                  placeholder="Nombre..."
                  value={operarioNombre}
                  onChange={e => setOperarioNombre(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl p-3 pr-10 text-sm font-bold text-slate-800 dark:text-white focus:outline-none uppercase"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Doble Foto del material */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-5">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <Camera className="w-3 h-3" /> 1. Evidencia del Material
            </p>
            <ImageUpload onImageChange={setFotoFile} required label="Fotografiar el producto a retirar" />
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <Camera className="w-3 h-3" /> 2. Evidencia de Guía / Ficha
            </p>
            <ImageUpload onImageChange={setFotoFichaFile} required label="Fotografiar el documento" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">⚠ {error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !material || !cantidad || !autorizadoPor || !operarioNombre}
          className="w-full py-4 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR RETIRO'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
