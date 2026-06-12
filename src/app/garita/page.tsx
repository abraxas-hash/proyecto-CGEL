'use client';

import Link from 'next/link';
import { Truck, Users, Package, HardHat, BookOpen, LayoutDashboard, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const MENU_ITEMS = [
  {
    title: "Repartidores",
    id: "tour-garita-repartidores",
    desc: "Ingreso / Salida",
    icon: Truck,
    href: "/garita/repartidores",
    color: "text-[#00d4ff]",
    bg: "bg-[#00d4ff]/10",
    border: "border-[#00d4ff]/20"
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
    border: "border-red-500/20",
    featured: true
  }
];

export default function GaritaMenu() {
  const router = useRouter();

  const menuItems = MENU_ITEMS;

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Header Info */}
      <div className="neu-flat p-4 rounded-2xl flex items-center justify-between mt-2">
        <div>
          <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Centro Logístico</h2>
          <p className="text-xl font-black text-white">Panel Garita</p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="neu-button p-3 text-[#00d4ff] rounded-xl transition-all"
          title="Ir al Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Link 
            key={item.title} 
            href={item.href}
            id={item.id}
            className={`
              neu-button rounded-2xl p-4 flex flex-col items-center justify-center text-center
              transition-transform active:scale-95 touch-manipulation relative overflow-hidden group
              ${item.featured ? 'col-span-2 min-h-32' : 'aspect-square'}
            `}
          >
            {/* Huge Background Icon */}
            <item.icon 
              strokeWidth={1.5}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 ${item.color} opacity-[0.15] group-hover:scale-110 transition-transform duration-500`} 
            />
            
            {/* Text Content in Foreground */}
            <div className="relative z-10 mt-auto pt-10">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md">{item.title}</h3>
              <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 drop-shadow-md ${item.color}`}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Footer Info */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          <FileText className="w-3 h-3" /> Nexus System v2.9
        </p>
      </div>
    </div>
  );
}
