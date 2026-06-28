'use client';

import Link from 'next/link';
import { Warehouse, DoorOpen, PackageMinus, PackagePlus, ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MENU = [
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
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => router.push('/garita')}
          className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white shrink-0 transition-colors"
          title="Volver a Garita"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumorphic-inset bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <Warehouse className="text-yellow-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Almacén Externo</h2>
            <p className="text-[11px] text-yellow-500 font-bold uppercase tracking-wider mt-0.5">Punto Halcón 3 · Bitácora</p>
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
