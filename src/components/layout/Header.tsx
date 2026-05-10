'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Truck, Users, ShieldCheck, Wrench, LogOut } from 'lucide-react';

/**
 * Header: Encabezado principal del Dashboard.
 * Incluye lógica de estado activo para la navegación.
 */
export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'DASHBOARD', href: '/', icon: Home, color: 'text-gray-400', activeBg: 'bg-white/10', hoverBg: 'hover:bg-white/10' },
    { name: 'REPARTIDORES', href: '/repartidores', icon: Truck, color: 'text-[#00d4ff]', activeBg: 'bg-[#00d4ff]/20', hoverBg: 'hover:bg-[#00d4ff]/20' },
    { name: 'VISITAS', href: '/visitas', icon: Users, color: 'text-purple-400', activeBg: 'bg-purple-500/20', hoverBg: 'hover:bg-purple-500/20' },
    { name: 'PROVEEDORES', href: '/proveedores', icon: ShieldCheck, color: 'text-green-400', activeBg: 'bg-green-500/20', hoverBg: 'hover:bg-green-500/20' },
    { name: 'CONTRATISTAS', href: '/contratistas', icon: Wrench, color: 'text-orange-400', activeBg: 'bg-orange-500/20', hoverBg: 'hover:bg-orange-500/20' },
    { name: 'POLÍTICAS', href: '/politicas', icon: ShieldCheck, color: 'text-blue-400', activeBg: 'bg-blue-500/20', hoverBg: 'hover:bg-blue-500/20' },
  ];

  return (
    <header className="mb-12 border-b border-white/10 pb-8 relative">
      {/* Estado del sistema y Usuario en la esquina superior derecha */}
      <div className="absolute top-0 right-0 text-right hidden lg:block">
        <div className="flex items-center gap-4 justify-end mb-2">
          <div className="flex flex-col items-end">
            <p className="text-[10px] text-gray-600 font-black tracking-[0.2em] uppercase">OPERADOR ACTIVO</p>
            <p className="text-[10px] font-mono text-gray-400 font-bold lowercase tracking-tight">sesión iniciada</p>
          </div>
          <button 
            onClick={async () => {
              const { supabase } = await import('@/lib/supabaseClient');
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all group"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 justify-end mt-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00d4ff]"></span>
          </span>
          <p className="text-[10px] font-mono text-[#00d4ff]/80 font-bold tracking-tighter uppercase">SISTEMA PROTEGIDO</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* Logo como eje central */}
        <div className="mb-4 relative group">
          <div className="absolute -inset-4 bg-[#00d4ff]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo-cgel.png" 
            alt="Logo CGEL" 
            className="h-32 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(0,212,255,0.15)] relative z-10"
          />
        </div>

        {/* Branding Centrado */}
        <div className="text-center">
          <h1 className="text-5xl font-black bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tighter leading-none">
            CGEL CONTROL
          </h1>
          <p className="text-gray-500 mt-2 font-bold tracking-[0.3em] uppercase text-[10px]">
            Plataforma de Inteligencia Operativa y Seguridad
          </p>
        </div>
      </div>

      {/* Menú de Navegación Centrado */}
      <nav className="flex flex-wrap justify-center gap-2 mt-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${
                isActive 
                  ? `${item.activeBg} ${item.color} border-white/10 shadow-lg shadow-black/20` 
                  : `bg-white/5 text-gray-500 border-white/5 ${item.hoverBg} hover:text-white`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
