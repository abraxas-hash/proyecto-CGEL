'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Truck, Users, ShieldCheck, Wrench, LogOut, Clock, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Header: Encabezado principal del Dashboard.
 * Diseño Horizontal "Command Center" para mayor profesionalidad.
 */
export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'DASHBOARD', href: '/', icon: Home, color: 'text-gray-400', activeBg: 'bg-white/10', hoverBg: 'hover:bg-white/10' },
    { name: 'REPARTIDORES', href: '/repartidores', icon: Truck, color: 'text-[#00d4ff]', activeBg: 'bg-[#00d4ff]/20', hoverBg: 'hover:bg-[#00d4ff]/20' },
    { name: 'VISITAS', href: '/visitas', icon: Users, color: 'text-purple-400', activeBg: 'bg-purple-500/20', hoverBg: 'hover:bg-purple-500/20' },
    { name: 'PROVEEDORES', href: '/proveedores', icon: ShieldCheck, color: 'text-green-400', activeBg: 'bg-green-500/20', hoverBg: 'hover:bg-green-500/20' },
    { name: 'CONTRATISTAS', href: '/contratistas', icon: Wrench, color: 'text-orange-400', activeBg: 'bg-orange-500/20', hoverBg: 'hover:bg-orange-500/20' },
    { name: 'POLÍTICAS', href: '/politicas', icon: ShieldCheck, color: 'text-blue-400', activeBg: 'bg-blue-500/20', hoverBg: 'hover:bg-blue-500/20' },
  ];

  return (
    <header className="mb-8 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* SECCIÓN SUPERIOR: Branding y Perfil */}
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Izquierda: Logo y Título */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center bg-white/5 rounded-xl p-2 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo-cgel.png" 
              alt="Logo CGEL" 
              className="h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,212,255,0.15)]"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tighter leading-none">
              CGEL CONTROL
            </h1>
            <p className="text-gray-500 mt-1 font-bold tracking-[0.2em] uppercase text-[9px]">
              Inteligencia Operativa
            </p>
          </div>
        </div>

        {/* Centro: Reloj, Fecha y Ubicación */}
        <div className="hidden lg:flex flex-col items-center justify-center opacity-80">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span className="text-[13px] font-mono font-bold tracking-[0.15em]">
              {time ? time.toLocaleTimeString('es-PE', { hour12: false }) : '--:--:--'}
            </span>
          </div>
          <div className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-red-500/80" />
            LIMA, PERÚ • CD SONEPAR • {time ? time.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') : '...'}
          </div>
        </div>

        {/* Derecha: Estado y Usuario */}
        <div className="flex items-center gap-6">
          
          {/* Indicador de Sistema */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00d4ff]"></span>
            </span>
            <p className="text-[9px] font-mono text-[#00d4ff]/80 font-bold tracking-widest uppercase mt-px">Sistema Protegido</p>
          </div>

          {/* Información del Operador y Logout */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="flex flex-col items-end hidden sm:flex">
              <p className="text-[9px] text-gray-500 font-black tracking-[0.2em] uppercase">Operador</p>
              <p className="text-[10px] font-mono text-gray-300 font-bold lowercase tracking-tight">Activo</p>
            </div>
            <button 
              onClick={async () => {
                const { supabase } = await import('@/lib/supabaseClient');
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="p-2.5 bg-[#151515] hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl border border-white/5 hover:border-red-500/20 transition-all group"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* SECCIÓN INFERIOR: Pestañas de Navegación */}
      <div className="px-6 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/20">
        <nav className="flex gap-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black transition-all ${
                  isActive 
                    ? `${item.activeBg} ${item.color} border border-white/10 shadow-md shadow-black/20` 
                    : `bg-transparent text-gray-500 border border-transparent ${item.hoverBg} hover:text-white`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
