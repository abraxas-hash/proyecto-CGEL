'use client';

import Link from 'next/link';
import { Warehouse, DoorOpen, PackageMinus, PackagePlus, ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MENU = [
  {
    title: 'Apertura de Acceso',
    desc: 'Registrar ingreso de operario',
    Icon: DoorOpen,
    href: '/almacen-externo/acceso',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    title: 'Retiro de Material',
    desc: 'Tubería · Conductor · Carrete',
    Icon: PackageMinus,
    href: '/almacen-externo/retiro',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    title: 'Ingreso de Material',
    desc: 'Recepción de mercadería',
    Icon: PackagePlus,
    href: '/almacen-externo/ingreso',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

export default function AlmacenExternoMenu() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 pb-6">

      {/* Header */}
      <div className="flex gap-2 items-stretch mt-4">
        <button 
          onClick={() => router.push('/garita')}
          className="glass-panel px-4 rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95"
          title="Volver a Garita"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between flex-1">
          <div>
            <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Punto Halcón 3</p>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Almacén Externo</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Jr. Yungay · Bitácora Digital</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center hidden xs:flex">
            <Warehouse className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Aviso de seguridad */}
      <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
        <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-black text-red-400">OBS-04 SUBSANADA:</span> Todo acceso, retiro o ingreso de material debe quedar registrado. El agente Halcón 3 es responsable del control.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-4">
        {MENU.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all touch-manipulation"
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              <item.Icon className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white">{item.title}</h3>
              <p className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${item.color}`}>{item.desc}</p>
            </div>
            <div className="ml-auto text-slate-400">›</div>
          </Link>
        ))}
      </div>

    </div>
  );
}
