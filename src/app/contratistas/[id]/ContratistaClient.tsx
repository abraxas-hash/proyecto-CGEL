'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { 
  Camera, 
  ArrowLeft, 
  HardHat, 
  CheckCircle2, 
  XCircle, 
  History, 
  Activity, 
  X, 
  Hammer,
  Users,
  Wrench,
  ShieldCheck,
  MapPin,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function ContratistaClient({ contratista, personal, herramientas, evidencias }: { contratista: any, personal: any[], herramientas: any[], evidencias: any[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Parse JSON observations if any
  const parsedObs = useMemo(() => {
    if (!contratista.observaciones) return { texto: '', fotos: {} };
    try {
      const parsed = JSON.parse(contratista.observaciones);
      return {
        texto: parsed.texto || '',
        fotos: parsed.fotos || {}
      };
    } catch {
      return { texto: contratista.observaciones, fotos: {} };
    }
  }, [contratista.observaciones]);

  const mergedEvidencias = useMemo(() => {
    let ev = [...(evidencias || [])];
    
    const nowISO = new Date().toISOString();
    
    if (parsedObs.fotos.sctr) {
      ev.push({
        id: 'json-sctr',
        url_foto: parsedObs.fotos.sctr,
        tipo_evidencia: 'SCTR',
        etiqueta: 'Foto de SCTR',
        fecha_captura: nowISO
      });
    }
    if (parsedObs.fotos.herramientas) {
      ev.push({
        id: 'json-herramientas',
        url_foto: parsedObs.fotos.herramientas,
        tipo_evidencia: 'HERRAMIENTAS',
        etiqueta: 'Foto de Herramientas',
        fecha_captura: nowISO
      });
    }
    return ev;
  }, [evidencias, parsedObs]);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative">
      {/* MODAL ZOOM EVIDENCIA */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg transition-opacity" 
          onClick={() => setSelectedImg(null)}
          onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setSelectedImg(null); }}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setSelectedImg(null)}
              className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full text-slate-800 dark:text-white transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-[#050505] border border-white/20 p-2 rounded-2xl shadow-2xl w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImg} 
                alt="Zoom Evidencia" 
                className="w-full h-auto object-contain max-h-[75vh]"
              />
              <div className="p-6 flex justify-between items-center bg-white/5">
                <div>
                  <p className="text-slate-800 dark:text-white font-black text-2xl uppercase tracking-tight">{contratista.empresa_contratista}</p>
                  <p className="text-yellow-500 text-sm font-bold flex items-center gap-2 mt-1">
                    <HardHat className="w-4 h-4" />
                    AUDITORÍA DE OBRA Y MANTENIMIENTO
                  </p>
                </div>
                <div className="px-5 py-2 bg-yellow-500 text-black rounded font-black border border-yellow-400 flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4" /> CUMPLIMIENTO TÉCNICO
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
        <Link href="/contratistas" className="flex items-center gap-2 text-slate-800 dark:text-white hover:text-slate-800 dark:text-slate-800 dark:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-bold w-full sm:w-auto justify-center sm:justify-start shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tabla
        </Link>
        <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">ID AUDITORÍA</span>
          <span className="text-sm font-mono font-bold text-slate-800 dark:text-white tracking-tighter">#{String(contratista.id).split('-')[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA 1: DETALLES DEL TRABAJO */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-t-8 border-t-yellow-500 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Hammer className="w-32 h-32 text-slate-800 dark:text-white" />
            </div>
            
            <div className="relative">
              <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase leading-[0.9] mb-2">{contratista.empresa_contratista}</h2>
              <p className="text-yellow-500 font-bold tracking-widest text-xs uppercase mb-8">Contratista Autorizado</p>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-yellow-600 dark:text-yellow-400 uppercase font-black tracking-[0.2em] mb-2 flex items-center gap-2">
                    <ClipboardList className="w-3 h-3" /> Naturaleza del Trabajo
                  </p>
                  <p className="text-slate-900 dark:text-white text-lg font-semibold leading-snug">{contratista.trabajo_realizar}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 dark:bg-white/5 p-4 rounded-2xl border border-slate-400 dark:border-slate-600">
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-black tracking-widest mb-1">Área de Trabajo</p>
                    <p className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" /> {contratista.area_trabajo}
                    </p>
                  </div>
                  <div className="bg-white/10 dark:bg-white/5 p-4 rounded-2xl border border-slate-400 dark:border-slate-600">
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-black tracking-widest mb-1">Autorizado por</p>
                    <p className="text-slate-900 dark:text-white font-bold">{contratista.autorizado_por}</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-100 dark:bg-black/40 rounded-3xl border border-slate-300 dark:border-slate-600">
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-black mb-3 tracking-widest">Observaciones de Seguridad</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                    "{parsedObs.texto || 'No se registraron observaciones para este servicio técnico.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHECKLIST GENERAL CONTRATISTA */}
          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-br from-yellow-500/[0.05] to-transparent">
            <h3 className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase mb-6 tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-yellow-500" /> Requisitos de Empresa
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/10 dark:bg-white/5 p-4 rounded-2xl border border-slate-300 dark:border-slate-600 hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Póliza SCTR Global Vigente</span>
                {contratista.sctr_vigente ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="flex items-center justify-between bg-white/10 dark:bg-white/5 p-4 rounded-2xl border border-slate-300 dark:border-slate-600 hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Retiro y Limpieza Conforme</span>
                {contratista.firma_conformidad_retiro ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: PERSONAL E INVENTARIO */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* PERSONAL */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Users className="text-blue-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Personal en Planta</h2>
              </div>
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-black">
                {personal.length} PAX
              </span>
            </div>
            
            <div className="space-y-3">
              {personal.map((p, idx) => (
                <div key={p.id || p.dni_ce || idx} className="bg-white/5 border border-slate-700 p-4 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-slate-800 dark:text-white font-bold capitalize">{p.nombre_completo?.toLowerCase()}</p>
                      <p className="text-[10px] text-gray-500 font-mono">DNI: {p.dni_ce}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center" title="SCTR">
                        <span className="text-[8px] text-gray-500 font-bold uppercase mb-0.5">SCTR</span>
                        {p.sctr_ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex flex-col items-center" title="EPP">
                        <span className="text-[8px] text-gray-500 font-bold uppercase mb-0.5">EPP</span>
                        {p.epp_completo ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 pt-2 border-t border-slate-700">
                    <span>INGRESO: {p.hora_ingreso?.slice(0,5)}</span>
                    <span className={p.hora_salida ? 'text-gray-500' : 'text-green-500 font-bold'}>
                      {p.hora_salida ? `SALIDA: ${p.hora_salida.slice(0,5)}` : 'TRABAJANDO...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HERRAMIENTAS */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Wrench className="text-orange-400 w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Inventario de Herramientas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {herramientas.map((h, idx) => (
                <div key={h.id || idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center font-black text-orange-400 border border-orange-500/20">
                    {h.cantidad}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-tight">{h.descripcion_general}</p>
                </div>
              ))}
              {herramientas.length === 0 && (
                <p className="text-xs text-gray-600 col-span-full py-4 text-center">No se registró inventario de herramientas.</p>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA 3: EVIDENCIA VISUAL */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-6 h-full bg-gradient-to-b from-transparent to-yellow-900/5">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Camera className="text-purple-400 w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Inspección</h2>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {mergedEvidencias.map((foto: any, idx: number) => (
                <div 
                  key={foto.id || idx} 
                  className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden group hover:border-yellow-500/50 transition-all shadow-xl cursor-pointer"
                  onClick={() => setSelectedImg(foto.url_foto)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedImg(foto.url_foto); }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={foto.url_foto} 
                      alt="Evidencia Obra" 
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-slate-800 dark:text-white border border-white/10 uppercase tracking-tighter">
                      {foto.tipo_evidencia}
                    </div>
                  </div>
                </div>
              ))}
              {mergedEvidencias.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 text-center p-8">
                  <Camera className="w-10 h-10 text-gray-800 mb-4" />
                  <p className="text-gray-700 font-black uppercase tracking-widest text-[8px]">Sin registros fotográficos de obra</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
