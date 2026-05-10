'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { 
  Camera, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  History, 
  Activity, 
  Truck, 
  IdCard, 
  X, 
  ClipboardCheck, 
  ShieldCheck,
  Package,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function ProveedorClient({ proveedor, historial, evidencias }: { proveedor: any, historial: any, evidencias: any }) {
  const [showDniModal, setShowDniModal] = useState<boolean>(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Mock de la foto del DNI
  const fotoDniUrl = evidencias?.find((e: any) => e.tipo_evidencia === 'DNI')?.url_foto || 'https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative">
      {/* MODAL ZOOM DNI / FOTO */}
      {(showDniModal || selectedImg) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity" onClick={() => { setShowDniModal(false); setSelectedImg(null); }}>
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => { setShowDniModal(false); setSelectedImg(null); }}
              className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full text-white transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-[#050505] border border-white/20 p-3 rounded-2xl shadow-2xl w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImg || fotoDniUrl} 
                alt="Zoom Evidencia" 
                className="w-full h-auto rounded-xl object-contain max-h-[75vh]"
              />
              <div className="p-5 flex justify-between items-center bg-white/5 mt-3 rounded-xl">
                <div>
                  <p className="text-white font-bold text-xl">{proveedor.conductor}</p>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                    <ShieldCheck className="w-4 h-4 text-[#00d4ff]" />
                    Evidencia de Seguridad - {proveedor.empresa_proveedor}
                  </p>
                </div>
                <div className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded font-mono border border-blue-500/30 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> REGISTRO AUDITADO
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="mb-6 flex justify-between items-center">
        <Link href="/proveedores" className="flex items-center gap-2 text-[#00d4ff] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-mono border border-blue-500/30">
          CONTROL CARGA: {proveedor.id.split('-')[0]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA 1: DATOS PROVEEDOR */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-t-4 border-t-blue-500">
            <div className="flex flex-col gap-1 mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Ficha de Proveedor</h2>
              </div>
              <span className="text-[10px] text-gray-500 font-mono mt-2 bg-white/5 w-fit px-2 py-1 rounded">COD: F-OPER-PROV-02</span>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Proveedor / Empresa</p>
                <p className="text-2xl font-black text-white mt-1 leading-tight">{proveedor.empresa_proveedor}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Placa Vehículo</p>
                  <p className="text-lg font-mono text-white mt-1">{proveedor.placa}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Hora Llegada</p>
                  <p className="text-lg font-mono text-blue-400 mt-1">{proveedor.hora_llegada?.slice(0,5)}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Conductor</p>
                <div className="flex items-center justify-between mt-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-white font-semibold text-sm capitalize">{proveedor.conductor?.toLowerCase()}</span>
                  <button 
                    onClick={() => setShowDniModal(true)}
                    className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  >
                    <IdCard className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                <p className="text-[10px] text-orange-400/80 uppercase font-bold mb-2 flex items-center gap-2">
                  <Package className="w-3 h-3" /> Guías de Remisión
                </p>
                <p className="text-sm text-gray-300 font-mono break-words bg-black/20 p-2 rounded">
                  {proveedor.n_guias || 'Sin guías registradas'}
                </p>
              </div>
            </div>
          </div>

          {/* CHECKLIST DE SEGURIDAD PROVEEDOR */}
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-white/[0.03] to-transparent">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-5 tracking-[0.2em] flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-green-400" /> Protocolo de Seguridad
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                <span className="text-sm text-gray-300">SCTR Salud / Pensión</span>
                {(proveedor.sctr_salud && proveedor.sctr_pension) ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                <span className="text-sm text-gray-300">EPP Completo (Casco/Botas)</span>
                {proveedor.epp_completo ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                <span className="text-sm text-gray-300">Licencia & SOAT Vigente</span>
                {proveedor.licencia_soat_ok ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                <span className="text-sm text-gray-300">Documentación Guías OK</span>
                {proveedor.guias_ok ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl border flex items-center justify-center gap-3 ${proveedor.autorizado ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {proveedor.autorizado ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              <span className="font-black uppercase tracking-widest text-sm">
                {proveedor.autorizado ? 'INGRESO AUTORIZADO' : 'INGRESO DENEGADO'}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: RÉCORD Y OBSERVACIONES */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Activity className="text-blue-400 w-6 h-6" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Récord de Empresa</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl text-center shadow-lg shadow-blue-500/5">
                <p className="text-4xl font-black text-blue-400">{historial?.length || 0}</p>
                <p className="text-[10px] text-blue-400/80 mt-1 uppercase font-bold tracking-widest">Entregas</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl text-center shadow-lg shadow-purple-500/5">
                <p className="text-4xl font-black text-purple-400">{historial?.filter((h: any) => !h.autorizado).length || 0}</p>
                <p className="text-[10px] text-purple-400/80 mt-1 uppercase font-bold tracking-widest">Rechazos</p>
              </div>
            </div>

            <h3 className="text-xs font-black text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-widest">
              <History className="w-4 h-4" /> Historial Reciente (Log)
            </h3>
            
            <div className="space-y-4 flex-1">
              {historial?.map((hist: any, idx: number) => (
                <Link 
                  key={idx} 
                  href={`/proveedores/${hist.id}`}
                  className="block group relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/10 hover:before:bg-blue-400 transition-all"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{hist.fecha}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${hist.autorizado ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      {hist.autorizado ? 'OK' : 'DENIED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-tighter">
                    LLEGADA: {hist.hora_llegada?.slice(0,5)} | CONDUCTOR: {hist.conductor?.slice(0,15)}...
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/5 italic">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-blue-400 font-bold not-italic uppercase text-[10px] block mb-1">Observaciones del Agente:</span>
                "{proveedor.observaciones || 'Sin observaciones adicionales registradas para este ingreso.'}"
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: EVIDENCIAS VISUALES */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 bg-gradient-to-b from-transparent to-purple-900/5">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Camera className="text-purple-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Evidencia Fotográfica</h2>
          </div>

          {evidencias && evidencias.length > 0 ? (
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {evidencias.map((foto: any) => (
                <div 
                  key={foto.id} 
                  className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden group hover:border-purple-500/50 transition-all shadow-xl cursor-pointer"
                  onClick={() => setSelectedImg(foto.url_foto)}
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={foto.url_foto} 
                      alt={foto.etiqueta} 
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white border border-white/20 shadow-2xl">
                      {foto.tipo_evidencia || 'SISTEMA'}
                    </div>
                  </div>
                  <div className="p-5 border-t border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-white uppercase tracking-widest">{foto.etiqueta}</p>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {new Date(foto.fecha_captura).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500" suppressHydrationWarning>
                      Capturado el {new Date(foto.fecha_captura).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
              <Camera className="w-12 h-12 text-gray-700 mb-4" />
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Sin registros fotográficos</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
