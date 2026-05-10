'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Camera, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileText, CheckCircle2, XCircle, History, Activity, CalendarDays, IdCard, X } from 'lucide-react';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function RepartidorClient({ repartidor, historial, evidencias }: { repartidor: any, historial: any, evidencias: any }) {
  const [activeCiclo, setActiveCiclo] = useState<number>(1);
  const [showDniModal, setShowDniModal] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [zoomPhotoUrl, setZoomPhotoUrl] = useState<string | null>(null);

  // Lógica de Sincronización Real: Determinar el ciclo basándose en la hora de captura
  const getCicloDeFoto = (fechaCaptura: string) => {
    try {
      const horaCaptura = new Date(fechaCaptura).toLocaleTimeString('es-ES', { hour12: false });
      
      // Comparar con los tiempos de los ciclos
      if (repartidor.entrada_3 && horaCaptura >= repartidor.entrada_3) return 3;
      if (repartidor.entrada_2 && horaCaptura >= repartidor.entrada_2) return 2;
      if (repartidor.entrada_1 && horaCaptura >= repartidor.entrada_1) return 1;
      
      return 1; // Default
    } catch (e) {
      return 1;
    }
  };

  // Filtrar evidencias por ciclo seleccionado
  const evidenciasFiltradas = evidencias?.filter((foto: any) => {
    const cicloDeEstaFoto = getCicloDeFoto(foto.fecha_captura);
    return cicloDeEstaFoto === activeCiclo;
  }) || [];

  const handleNextPhoto = () => {
    if (evidenciasFiltradas.length === 0) return;
    const currentIndex = evidenciasFiltradas.findIndex((f: any) => f.url_foto === zoomPhotoUrl);
    const nextIndex = (currentIndex + 1) % evidenciasFiltradas.length;
    setZoomPhotoUrl(evidenciasFiltradas[nextIndex].url_foto);
    setPhotoIndex(nextIndex); 
  };

  const handlePrevPhoto = () => {
    if (evidenciasFiltradas.length === 0) return;
    const currentIndex = evidenciasFiltradas.findIndex((f: any) => f.url_foto === zoomPhotoUrl);
    const prevIndex = (currentIndex - 1 + evidenciasFiltradas.length) % evidenciasFiltradas.length;
    setZoomPhotoUrl(evidenciasFiltradas[prevIndex].url_foto);
    setPhotoIndex(prevIndex); 
  };

  // Mock de la foto del DNI
  const fotoDniUrl = evidencias?.find((e: any) => e.tipo_evidencia === 'DNI')?.url_foto || 'https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] relative">
      {/* MODAL ZOOM GENÉRICO (EVIDENCIAS) CON ESTILO HUD REFINADO */}
      {zoomPhotoUrl && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setZoomPhotoUrl(null)}>
          
          {/* Botón Cerrar Sleek */}
          <button 
            onClick={() => setZoomPhotoUrl(null)}
            className="fixed top-8 right-8 p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-full text-white/50 transition-all border border-white/5 z-[102] backdrop-blur-md"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navegación HUD Minimalista */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
            className="fixed left-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5 z-[102] backdrop-blur-md group"
            title="Anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
            className="fixed right-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5 z-[102] backdrop-blur-md group"
            title="Siguiente"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="bg-[#050505] border border-white/5 p-1 rounded-2xl shadow-2xl w-full ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={zoomPhotoUrl} 
                alt="Zoom Evidencia" 
                className="w-full h-auto rounded-xl object-contain max-h-[75vh] animate-in zoom-in-95 duration-300"
              />
              
              {/* Info Bar HUD */}
              <div className="mt-2 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rounded-xl">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">Auditoría Visual</span>
                  </div>
                  <span className="text-xs font-bold text-white/80 mt-1 tracking-tight italic">
                    TAG: {evidenciasFiltradas.find((f: any) => f.url_foto === zoomPhotoUrl)?.etiqueta}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Secuencia</span>
                    <span className="text-xs font-mono text-white/60">
                      {evidenciasFiltradas.findIndex((f: any) => f.url_foto === zoomPhotoUrl) + 1} <span className="text-white/20">/</span> {evidenciasFiltradas.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ZOOM DNI */}
      {showDniModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity" onClick={() => setShowDniModal(false)}>
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowDniModal(false)}
              className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full text-white transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-[#050505] border border-white/20 p-3 rounded-2xl shadow-2xl w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={fotoDniUrl} 
                alt="Documento de Identidad" 
                className="w-full h-auto rounded-xl object-contain max-h-[75vh]"
              />
              <div className="p-5 flex justify-between items-center bg-white/5 mt-3 rounded-xl">
                <div>
                  <p className="text-white font-bold text-xl">{repartidor.conductor_apellido}</p>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                    <IdCard className="w-4 h-4" />
                    Documento de Identidad Nacional (DNI)
                  </p>
                </div>
                <div className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded font-mono border border-purple-500/30 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> VERIFICADO
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <Link href="/repartidores" className="flex items-center gap-2 text-[#00d4ff] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 text-sm font-bold w-full sm:w-auto justify-center sm:justify-start">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tabla
        </Link>
        <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">ID AUDITORÍA</span>
          <span className="text-sm font-mono font-bold text-white tracking-tighter">#{repartidor.id.split('-')[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA 1: FICHA PRINCIPAL */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 bg-[#00d4ff] h-full"></div>
            <div className="flex flex-col gap-1 mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="text-[#00d4ff] w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Datos del Registro</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono mt-2 bg-white/5 w-fit px-2 py-1 rounded">COD: F-OPER-REP-03</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Conductor Identificado</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-2xl font-bold text-white">{repartidor.conductor_apellido}</p>
                  <button 
                    onClick={() => setShowDniModal(true)}
                    className="p-2 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded-xl text-[#00d4ff] transition-all group shadow-[0_0_10px_rgba(0,212,255,0.1)] hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                    title="Ver DNI a pantalla completa"
                  >
                    <IdCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Transporte</p>
                  <p className="text-sm font-bold text-[#00d4ff]">{repartidor.empresa_abreviatura}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Placa</p>
                  <p className="text-sm font-mono text-white">{repartidor.placa}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Fecha Operativa</p>
                  <p className="text-sm font-mono text-white">{repartidor.fecha}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Turno</p>
                  <p className="text-sm text-white">{repartidor.turno}</p>
                </div>
              </div>
              
              {/* SELECTOR DE CICLOS INTERACTIVO */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase mb-3">Ciclos de Reparto (Click para filtrar fotos)</p>
                <div className="space-y-2">
                  {/* Ciclo 1 */}
                  <div 
                    onClick={() => { setActiveCiclo(1); setPhotoIndex(0); }}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-all border
                      ${activeCiclo === 1 ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <span className={`text-xs font-bold ${activeCiclo === 1 ? 'text-purple-400' : 'text-gray-400'}`}>1° Reparto</span>
                    <div className="flex gap-4">
                      <span className="text-sm font-mono text-green-400">In: {repartidor.entrada_1 || '--:--'}</span>
                      <span className="text-sm font-mono text-red-400">Out: {repartidor.salida_1 || '--:--'}</span>
                    </div>
                  </div>
                  
                  {/* Ciclo 2 */}
                  <div 
                    onClick={() => { if (repartidor.entrada_2) { setActiveCiclo(2); setPhotoIndex(0); } }}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all border
                      ${!repartidor.entrada_2 ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent' : 
                        activeCiclo === 2 ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer' : 'bg-white/5 border-transparent hover:bg-white/10 cursor-pointer'}`}
                  >
                    <span className={`text-xs font-bold ${activeCiclo === 2 ? 'text-purple-400' : 'text-gray-400'}`}>2° Reparto</span>
                    {repartidor.entrada_2 ? (
                      <div className="flex gap-4">
                        <span className="text-sm font-mono text-green-400">In: {repartidor.entrada_2}</span>
                        <span className="text-sm font-mono text-red-400">Out: {repartidor.salida_2 || '--:--'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Sin registro</span>
                    )}
                  </div>

                  {/* Ciclo 3 */}
                  <div 
                    onClick={() => { if (repartidor.entrada_3) { setActiveCiclo(3); setPhotoIndex(0); } }}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all border
                      ${!repartidor.entrada_3 ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent' : 
                        activeCiclo === 3 ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer' : 'bg-white/5 border-transparent hover:bg-white/10 cursor-pointer'}`}
                  >
                    <span className={`text-xs font-bold ${activeCiclo === 3 ? 'text-purple-400' : 'text-gray-400'}`}>3° Reparto</span>
                    {repartidor.entrada_3 ? (
                      <div className="flex gap-4">
                        <span className="text-sm font-mono text-green-400">In: {repartidor.entrada_3}</span>
                        <span className="text-sm font-mono text-red-400">Out: {repartidor.salida_3 || '--:--'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Sin registro</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AUDITORÍA DE TRANSCRIPCIÓN */}
          <div className="glass-panel rounded-2xl p-6 bg-blue-900/10 border-blue-500/20">
            <h3 className="text-sm font-bold text-blue-400 uppercase mb-3 tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" /> Trazabilidad de Vaciado
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400 flex justify-between">
                <span>Agente Responsable:</span> 
                <span className="text-white font-medium">{repartidor.agente_registro}</span>
              </p>
              <p className="text-gray-400 flex justify-between">
                <span>Digitalizado el:</span> 
                <span className="text-blue-300 font-mono" suppressHydrationWarning>
                  {new Date(repartidor.creado_en).toLocaleDateString()} a las {new Date(repartidor.creado_en).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2 italic leading-tight">
                * Nota: El vaciado de datos de la ficha física al sistema suele realizarse al finalizar la jornada operativa (10:00 PM - 11:00 PM).
              </p>
            </div>
          </div>

          {/* CHECKLIST DE SEGURIDAD */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Auditoría de Seguridad (Último Ciclo)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-sm text-gray-300">Póliza SCTR Vigente</span>
                {repartidor.sctr_ok ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-sm text-gray-300">Equipos EPP Completos</span>
                {repartidor.epp_ok ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: RÉCORD Y DIAGRAMA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Activity className="text-orange-400 w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Inteligencia y Récord</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative overflow-hidden group bg-gradient-to-br from-orange-500/10 via-orange-500/[0.02] to-transparent border border-orange-500/20 p-5 rounded-2xl transition-all hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                  <History className="w-24 h-24 text-orange-400 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <History className="w-3.5 h-3.5 text-orange-400/60" />
                    <span className="text-[9px] font-black text-orange-400/60 uppercase tracking-[0.2em]">Registro Histórico</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-orange-400 tracking-tighter">{historial?.length || 0}</p>
                    <span className="text-[10px] text-orange-400/40 font-bold uppercase tracking-widest">Eventos</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Visitas Previas</p>
                </div>
              </div>

              <div className="relative overflow-hidden group bg-gradient-to-br from-red-500/10 via-red-500/[0.02] to-transparent border border-red-500/20 p-5 rounded-2xl transition-all hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                  <XCircle className="w-24 h-24 text-red-400 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-3.5 h-3.5 text-red-400/60" />
                    <span className="text-[9px] font-black text-red-400/60 uppercase tracking-[0.2em]">Estado Crítico</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-red-400 tracking-tighter">{historial?.filter((h: any) => !h.sctr_ok).length || 0}</p>
                    <span className="text-[10px] text-red-400/40 font-bold uppercase tracking-widest">Alertas</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Faltas SCTR</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-4">
              <History className="w-4 h-4" /> Historial de Entradas (Timeline)
            </h3>
            
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {historial?.map((hist: any, idx: number) => {
                // Función auxiliar para calcular duración en minutos
                const getDuration = (inTime: string, outTime: string) => {
                  if (!inTime || !outTime) return 0;
                  const [inH, inM] = inTime.split(':').map(Number);
                  const [outH, outM] = outTime.split(':').map(Number);
                  const diff = (outH * 60 + outM) - (inH * 60 + inM);
                  return diff > 0 ? diff : 0;
                };

                const dur1 = getDuration(hist.entrada_1, hist.salida_1);
                const dur2 = getDuration(hist.entrada_2, hist.salida_2);
                const dur3 = getDuration(hist.entrada_3, hist.salida_3);
                
                const totalMins = dur1 + dur2 + dur3;
                const horas = Math.floor(totalMins / 60);
                const mins = totalMins % 60;

                return (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0f1115] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    
                    <Link 
                      href={`/repartidores/${hist.id}`} 
                      className="block w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 hover:border-[#00d4ff]/50 transition-all cursor-pointer shadow-lg"
                    >
                      <div className="flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center gap-2 mb-3 border-b border-white/5 pb-3">
                        <time className="font-mono text-sm font-bold text-[#00d4ff]">{hist.fecha}</time>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-400 bg-black/30 px-2 py-0.5 rounded font-mono border border-white/5">
                            Total: {horas}h {mins}m
                          </span>
                          {!hist.sctr_ok && <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="Sin SCTR"></span>}
                          {!hist.epp_ok && <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" title="Sin EPP"></span>}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Gráfica Ciclo 1 */}
                        {hist.entrada_1 && (
                          <div>
                            <p className="text-xs text-gray-400 flex justify-between mb-1">
                              <span className="font-mono tracking-tighter">C1: {hist.entrada_1.slice(0,5)} - {hist.salida_1 ? hist.salida_1.slice(0,5) : '--:--'}</span>
                              <span className="font-bold text-gray-300">{dur1}m</span>
                            </p>
                            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((dur1 / 180) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        )}
                        {/* Gráfica Ciclo 2 */}
                        {hist.entrada_2 && (
                          <div>
                            <p className="text-xs text-gray-400 flex justify-between mb-1">
                              <span className="font-mono tracking-tighter">C2: {hist.entrada_2.slice(0,5)} - {hist.salida_2 ? hist.salida_2.slice(0,5) : '--:--'}</span>
                              <span className="font-bold text-gray-300">{dur2}m</span>
                            </p>
                            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((dur2 / 180) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        )}
                        {/* Gráfica Ciclo 3 */}
                        {hist.entrada_3 && (
                          <div>
                            <p className="text-xs text-gray-400 flex justify-between mb-1">
                              <span className="font-mono tracking-tighter">C3: {hist.entrada_3.slice(0,5)} - {hist.salida_3 ? hist.salida_3.slice(0,5) : '--:--'}</span>
                              <span className="font-bold text-gray-300">{dur3}m</span>
                            </p>
                            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min((dur3 / 180) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-white/5 text-right">
                        <span className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-widest group-hover:underline">Abrir Ficha →</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA 3: EVIDENCIAS VISUALES Y ANALÍTICA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* TARJETA DE EVIDENCIA (CARRUSEL) */}
          <div className="glass-panel rounded-2xl p-6 border-t-4 border-t-purple-500 overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Camera className="text-purple-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Evidencia: {activeCiclo}° Reparto</h2>
              </div>
              <button 
                onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-[10px] font-black border border-purple-500/30 transition-all flex items-center gap-2"
              >
                {isGalleryOpen ? 'CONTRAER' : 'VER GALERÍA'}
                <span className="bg-purple-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">
                  {evidenciasFiltradas?.length || 0}
                </span>
              </button>
            </div>

            {evidenciasFiltradas && evidenciasFiltradas.length > 0 ? (
              <div className="flex-1 flex flex-col gap-4">
                {/* ÁREA DE CARRUSEL PRINCIPAL */}
                <div className="relative group aspect-video rounded-xl overflow-hidden bg-[#050505] border border-white/10 shadow-2xl cursor-zoom-in">
                  <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${photoIndex * 100}%)` }}>
                    {evidenciasFiltradas.map((foto: any, idx: number) => (
                      <div 
                        key={foto.id} 
                        className="min-w-full h-full relative"
                        onClick={() => setZoomPhotoUrl(foto.url_foto)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={foto.url_foto} 
                          alt={foto.etiqueta} 
                          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-xs font-black text-purple-400 font-mono tracking-widest uppercase">{foto.etiqueta}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5" suppressHydrationWarning>
                            {new Date(foto.fecha_captura).toLocaleTimeString()} • {new Date(foto.fecha_captura).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botones de Navegación del Carrusel */}
                  {evidenciasFiltradas.length > 1 && (
                    <>
                      <button 
                        onClick={() => setPhotoIndex((prev) => (prev > 0 ? prev - 1 : evidenciasFiltradas.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-500/40"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setPhotoIndex((prev) => (prev < evidenciasFiltradas.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-500/40"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* MINIATURAS (CUADRITOS) */}
                <div className="flex flex-wrap gap-2 py-2">
                  {evidenciasFiltradas.map((foto: any, idx: number) => (
                    <button 
                      key={foto.id}
                      onClick={() => setPhotoIndex(idx)}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all relative ${photoIndex === idx ? 'border-purple-500 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={foto.url_foto} alt="thumb" className="w-full h-full object-cover" />
                      {photoIndex === idx && <div className="absolute inset-0 bg-purple-500/20"></div>}
                    </button>
                  ))}
                </div>

                {/* MODO GALERÍA EXPANDIDA (ACORDEÓN) */}
                {isGalleryOpen && (
                  <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    {evidenciasFiltradas.map((foto: any) => (
                      <div key={foto.id} className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col gap-2">
                        <div className="h-20 bg-black rounded overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={foto.url_foto} alt="gal" className="w-full h-full object-cover opacity-60" />
                        </div>
                        <span className="text-[8px] font-mono text-gray-500 truncate">{foto.etiqueta}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                <Camera className="w-8 h-8 text-gray-700 mb-2" />
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Sin evidencias</p>
              </div>
            )}
          </div>

          {/* TARJETA ANALÍTICA: ESCALA DE VARIABLES */}
          <div className="glass-panel rounded-2xl p-6 border-t-4 border-t-[#00d4ff] bg-gradient-to-b from-[#00d4ff]/5 to-transparent">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00d4ff]" /> Análisis de Variables
            </h3>
            
            <div className="h-[200px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Seguridad', A: (repartidor.sctr_ok && repartidor.epp_ok) ? 100 : 50, fullMark: 100 },
                    { subject: 'SCTR', A: repartidor.sctr_ok ? 100 : 0, fullMark: 100 },
                    { subject: 'EPP', A: repartidor.epp_ok ? 100 : 0, fullMark: 100 },
                    { subject: 'Historial', A: historial?.length > 0 ? (historial.filter((h: any) => h.sctr_ok).length / historial.length) * 100 : 0, fullMark: 100 },
                    { subject: 'Consistencia', A: historial?.length > 0 ? (historial.filter((h: any) => h.epp_ok).length / historial.length) * 100 : 0, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar
                      name={repartidor.conductor_apellido}
                      dataKey="A"
                      stroke="#00d4ff"
                      fill="#00d4ff"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Puntuación de Auditoría</span>
                    <span className="text-[#00d4ff]">
                      {historial?.length > 0 ? ((historial.filter((h: any) => h.sctr_ok && h.epp_ok).length / historial.length) * 10).toFixed(1) : '0.0'} / 10
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-[#00d4ff] to-blue-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${historial?.length > 0 ? (historial.filter((h: any) => h.sctr_ok && h.epp_ok).length / historial.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Resumen de Confianza</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 flex items-center justify-center text-green-400 font-black text-xs">
                      {historial?.length > 0 ? Math.round((historial.filter((h: any) => h.sctr_ok && h.epp_ok).length / historial.length) * 100) : 0}%
                    </div>
                    <p className="text-xs text-gray-400 leading-tight">
                      {historial?.filter((h: any) => !h.sctr_ok).length > 0 
                        ? `El conductor presenta ${historial.filter((h: any) => !h.sctr_ok).length} incidentes de SCTR en sus últimos registros.` 
                        : 'El conductor mantiene un historial íntegro con 0 incidentes reportados en este periodo.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
