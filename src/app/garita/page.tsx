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
    color: "text-sky-400"
  },
  {
    title: "Visitas",
    id: "tour-garita-visitas",
    desc: "Clientes / Otros",
    icon: Users,
    href: "/garita/visitas",
    color: "text-purple-400"
  },
  {
    title: "Proveedores",
    id: "tour-garita-proveedores",
    desc: "Carga / Descarga",
    icon: Package,
    href: "/garita/proveedores",
    color: "text-green-400"
  },
  {
    title: "Contratistas",
    id: "tour-garita-contratistas",
    desc: "Trabajos internos",
    icon: HardHat,
    href: "/garita/contratistas",
    color: "text-orange-400"
  },
  {
    title: "Cuaderno Virtual",
    id: "tour-garita-ocurrencias",
    desc: "Ocurrencias / Cierre",
    icon: BookOpen,
    href: "/garita/ocurrencias",
    color: "text-red-400"
  },
  {
    title: "Retiro de Producto",
    id: "tour-garita-retiro",
    desc: "Orden de Venta",
    icon: ShoppingBag,
    href: "/garita/retiro",
    color: "text-cyan-400"
  },
  {
    title: "Almacén Externo",
    id: "tour-garita-almacen-externo",
    desc: "Punto Halcón 3",
    icon: Warehouse,
    href: "/almacen-externo",
    color: "text-yellow-400"
  },
  {
    title: "Montacarga, alquiler y recarga de gas",
    id: "tour-garita-gas",
    desc: "Cambio de Balones",
    icon: Flame,
    href: "/garita/proveedores/gas",
    color: "text-orange-500"
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
            className="glass-panel hover:bg-black/5 dark:hover:bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-transform active:scale-95 touch-manipulation relative overflow-hidden group h-28"
          >
            {/* Background Icon (High Relief / Embossed) - Smaller */}
            <item.icon 
              strokeWidth={2.5}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 ${item.color} opacity-30 drop-shadow-[1px_2px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[1px_2px_2px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500`} 
            />
            
            {/* Text Content in Foreground */}
            <div className="relative z-10 mt-auto pt-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight drop-shadow-md">{item.title}</h3>
              <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 drop-shadow-md ${item.color}`}>{item.desc}</p>
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
