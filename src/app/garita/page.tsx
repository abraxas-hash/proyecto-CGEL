'use client';

import Link from 'next/link';
import { Truck, Users, Package, HardHat, BookOpen, FileText, ShoppingBag, Warehouse, Flame } from 'lucide-react';
import { ConsultaRapida } from '@/components/garita/ConsultaRapida';

const MENU_ITEMS = [
  {
    title: "Repartidores",
    id: "tour-garita-repartidores",
    desc: "Ingreso / Salida",
    icon: Truck,
    href: "/garita/repartidores",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20"
  },
  {
    title: "Visitas",
    id: "tour-garita-visitas",
    desc: "Clientes / Otros",
    icon: Users,
    href: "/garita/visitas",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Proveedores",
    id: "tour-garita-proveedores",
    desc: "Carga / Descarga",
    icon: Package,
    href: "/garita/proveedores",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20"
  },
  {
    title: "Contratistas",
    id: "tour-garita-contratistas",
    desc: "Trabajos internos",
    icon: HardHat,
    href: "/garita/contratistas",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    title: "Cuaderno Virtual",
    id: "tour-garita-ocurrencias",
    desc: "Ocurrencias / Cierre",
    icon: BookOpen,
    href: "/garita/ocurrencias",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20"
  },
  {
    title: "Retiro de Producto",
    id: "tour-garita-retiro",
    desc: "Orden de Venta",
    icon: ShoppingBag,
    href: "/garita/retiro",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  },
  {
    title: "Almacén Externo",
    id: "tour-garita-almacen-externo",
    desc: "Punto Halcón 3",
    icon: Warehouse,
    href: "/almacen-externo",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20"
  },
  {
    title: "Gas Montacarga",
    id: "tour-garita-gas",
    desc: "Cambio de Balones",
    icon: Flame,
    href: "/garita/proveedores/gas",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  }
];

export default function GaritaMenu() {
  return (
    <div className="flex flex-col h-full gap-6 mt-4">

      <div className="grid grid-cols-2 gap-3">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            id={item.id}
            className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 active:scale-95 touch-manipulation transition-all duration-200 group aspect-square"
          >
            {/* Icon badge */}
            <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h3>
              <p className={`text-[9px] font-semibold uppercase tracking-wider ${item.color} opacity-70`}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Panel de Consulta Rápida */}
      <ConsultaRapida />

      {/* Footer Info */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          <FileText className="w-3 h-3" /> Nexus System v2.9
        </p>
      </div>
    </div>
  );
}
