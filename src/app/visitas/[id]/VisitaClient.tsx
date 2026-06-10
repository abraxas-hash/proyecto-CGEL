'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { 
  Camera, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  XCircle, 
  History, 
  Activity, 
  IdCard, 
  X, 
  CalendarDays,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function VisitaClient({ visita, historial, evidencias }: { visita: any, historial: any, evidencias: any }) {
  const [showDniModal, setShowDniModal] = useState<boolean>(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Parse JSON observations if any
  const parsedObs = useMemo(() => {
    if (!visita.observaciones) return { texto: '', fotos: {} };
    try {
      const parsed = JSON.parse(visita.observaciones);
      return {
        texto: parsed.texto || '',
        fotos: parsed.fotos || {}
      };
    } catch {
      return { texto: visita.observaciones, fotos: {} };
    }
  }, [visita.observaciones]);

  let baseFotoDniUrl = evidencias?.find((e: any) => e.tipo_evidencia === 'DNI')?.url_foto;
  const fotoDniUrl = parsedObs.fotos.dni || baseFotoDniUrl || 'https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=800&auto=format&fit=crop';

  const mergedEvidencias = useMemo(() => {
    let ev = [...(evidencias || [])];
    if (parsedObs.fotos.dni) {
      ev.push({
        id: 'json-dni',
        url_foto: parsedObs.fotos.dni,
        tipo_evidencia: 'DNI',
        etiqueta: 'Foto de Documento',
        fecha_captura: new Date().toISOString()
      });
    }
    return ev;
  }, [evidencias, parsedObs]);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative">
      {/* MODAL LIGHTBOX */}
      {(showDniModal || selectedImg) && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity" 
          onClick={() => { setShowDniModal(false); setSelectedImg(null); }}
          onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { setShowDniModal(false); setSelectedImg(null); } }}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => { setShowDniModal(false); setSelectedImg(null); }}
              className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full text-white transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-[#050505] border border-white/20 p-2 rounded-2xl shadow-2xl w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImg || fotoDniUrl} 
                alt="Zoom Evidencia" 
                className="w-full h-auto object-contain max-h-[75vh]"
              />
              <div className="p-5 flex justify-between items-center bg-white/5">
                <div>
                  <p className="text-white font-bold text-xl">{visita.nombre_completo}</p>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-green-400" />
                    Destino: {visita.referencia_visita}
                  </p>
                </div>
                <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded font-mono border border-green-500/30 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> IDENTIDAD VALIDADA
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <Link href="/visitas" className="flex items-center gap-2 text-[#00d4ff] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 text-sm font-bold w-full sm:w-auto justify-center sm:justify-start">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tabla
        </Link>
        <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">ID AUDITORÍA</span>
          <span className="text-sm font-mono font-bold text-white tracking-tighter">#{String(visita.id).split('-')[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA 1: PERFIL DE VISITA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-green-500/[0.05] to-transparent">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group">
                <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center overflow-hidden group-hover:border-green-400/50 transition-all duration-500">
                  <User className="w-12 h-12 text-green-400" />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowDniModal(true)}
                  className="absolute bottom-0 right-0 p-2 bg-green-500 text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Ver DNI"
                >
                  <IdCard className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-black text-white capitalize leading-tight">{visita.nombre_completo?.toLowerCase()}</h2>
              <p className="text-xs text-gray-500 font-mono mt-2 tracking-[0.3em] uppercase">ID: {visita.dni_ce}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Empresa / Procedencia</p>
                <p className="text-white font-bold">{visita.empresa || 'PARTICULAR'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <Clock className="w-4 h-4 text-green-400 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Ingreso</p>
                  <p className="text-lg font-mono text-white mt-1">{visita.hora_ingreso?.slice(0,5)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <Clock className="w-4 h-4 text-orange-400 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Salida</p>
                  <p className="text-lg font-mono text-white mt-1">{visita.hora_salida?.slice(0,5) || '--:--'}</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Motivo y Destino
                </p>
                <p className="text-sm text-[#00d4ff] font-bold mb-1">Visitó a: {visita.referencia_visita}</p>
                <p className="text-xs text-gray-400 leading-relaxed italic">"{visita.motivo_visita}"</p>
              </div>
            </div>
          </div>

          {/* CHECKLIST SEGURIDAD VISITA */}
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-[0.2em]">Auditoría de Protocolo</h3>
            <div className="space-y-3">
              {[
                { label: 'DNI Físico Entregado', val: visita.dni_fisico_entregado, icon: <IdCard className="w-4 h-4" /> },
                { label: 'Registrado en Sistema', val: visita.registrado_sistema, icon: <Activity className="w-4 h-4" /> },
                { label: 'EPP Básico (Casco/Chaleco)', val: visita.epp_basico_ok, icon: <ShieldCheck className="w-4 h-4" /> },
                { label: 'Pase Visita Entregado', val: visita.pase_visita_entregado, icon: <CreditCard className="w-4 h-4" /> },
                { label: 'Pase Devuelto en Salida', val: visita.pase_devuelto_salida, icon: <ArrowLeft className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="text-xs text-gray-300 font-medium">{item.label}</span>
                  </div>
                  {item.val ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA 2: HISTORIAL Y DIAGRAMA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
              <Activity className="text-green-400 w-6 h-6" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Récord de Ingresos</h2>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center mb-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <p className="text-6xl font-black text-green-400">{historial?.length || 0}</p>
              <p className="text-xs text-green-400/80 mt-2 uppercase font-black tracking-[0.3em]">Visitas totales</p>
            </div>

            <h3 className="text-[10px] font-black text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-widest">
              <CalendarDays className="w-4 h-4" /> Log de Trazabilidad
            </h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {historial?.map((hist: any) => (
                <Link 
                  key={hist.id} 
                  href={`/visitas/${hist.id}`}
                  className="block group bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white font-mono">{hist.fecha}</span>
                    <span className="text-[9px] font-bold text-[#00d4ff] group-hover:underline">VER DETALLE</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Visitó a: <span className="text-gray-300 font-bold">{hist.referencia_visita?.slice(0,20)}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Estadía: {hist.hora_ingreso?.slice(0,5)} - {hist.hora_salida?.slice(0,5) || 'ACTIVA'}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-5 bg-black/40 rounded-3xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-2 tracking-widest">Observaciones</p>
              <p className="text-xs text-gray-400 italic leading-relaxed">
                "{parsedObs.texto || 'No se registraron incidentes durante esta visita administrativa.'}"
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: EVIDENCIA VISUAL */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 bg-gradient-to-b from-transparent to-green-900/5">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Camera className="text-purple-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Cámaras y Evidencia</h2>
          </div>

          {mergedEvidencias && mergedEvidencias.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {mergedEvidencias.map((foto: any, i: number) => (
                <div 
                  key={foto.id || i} 
                  className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden group hover:border-green-400/50 transition-all shadow-xl cursor-pointer"
                  onClick={() => setSelectedImg(foto.url_foto)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedImg(foto.url_foto); }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={foto.url_foto} 
                      alt="Evidencia Visita" 
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">
                      {foto.tipo_evidencia}
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{foto.etiqueta}</p>
                    <span className="text-[9px] font-mono text-gray-500">
                      {new Date(foto.fecha_captura || new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 text-center">
              <Camera className="w-12 h-12 text-gray-800 mb-4" />
              <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[10px]">Sin capturas de seguridad</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
