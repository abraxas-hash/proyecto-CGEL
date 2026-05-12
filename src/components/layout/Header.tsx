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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Clock
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    
    // Load User
    async function loadUser() {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        const { data: profile } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserRole(profile.rol);
        }
      }
    }
    loadUser();

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
    <header className="mb-1 sm:mb-2 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      
      {/* SECCIÓN SUPERIOR: Branding y Perfil */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-y-3">
        
        {/* Izquierda: Logo y Título */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="relative flex items-center justify-center bg-white/5 rounded-xl p-1 sm:p-2 border border-white/5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo-cgel.png" 
              alt="Logo CGEL" 
              className="h-7 sm:h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,212,255,0.15)]"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tighter leading-none truncate">
              CGEL CONTROL
            </h1>
            <p className="mt-0.5 sm:mt-1 font-black uppercase text-[7px] sm:text-[9px] truncate">
              <span className="text-gray-500 tracking-[0.1em] sm:tracking-[0.2em]">Inteligencia Operativa</span>
              <span className="ml-2 text-white bg-pink-600 px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-[0_0_10px_rgba(255,20,147,0.5)]">v2.6.4-HARD-REFRESH</span>
            </p>
          </div>
        </div>

        {/* Centro: Reloj, Fecha y Ubicación (Wraps to bottom on mobile) */}
        <div className="flex flex-col items-center justify-center opacity-80 order-3 lg:order-2 w-full lg:w-auto mt-2 lg:mt-0 pt-3 lg:pt-0 border-t border-white/5 lg:border-none">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span className="text-[12px] sm:text-[13px] font-mono font-bold tracking-[0.15em]">
              {time ? time.toLocaleTimeString('es-PE', { hour12: false }) : '--:--:--'}
            </span>
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-red-500/80" />
            LIMA, PERÚ • CD SONEPAR • {time ? time.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') : '...'}
          </div>
        </div>

        {/* Derecha: Estado y Usuario */}
        <div className="flex items-center gap-2 sm:gap-6 order-2 lg:order-3">
          
          {/* Indicador de Sistema (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00d4ff]"></span>
            </span>
            <p className="text-[9px] font-mono text-[#00d4ff]/80 font-bold tracking-widest uppercase mt-px">Sistema Protegido</p>
          </div>

          {/* Información del Operador y Logout */}
          <div className="flex items-center gap-2 sm:gap-4 sm:border-l sm:border-white/10 sm:pl-6">
            <div className="flex flex-col items-end min-w-0">
              <p className="text-[7px] sm:text-[10px] text-gray-300 font-bold tracking-tight max-w-[80px] sm:max-w-xs truncate">
                {userEmail || 'Cargando...'}
              </p>
              <p className="text-[6px] sm:text-[9px] font-black text-[#00d4ff] uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {userRole ? userRole : 'OPERADOR'}
              </p>
            </div>
            <button 
              onClick={async () => {
                const { supabase } = await import('@/lib/supabaseClient');
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="p-1.5 sm:p-2.5 bg-[#151515] hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg sm:rounded-xl border border-white/5 hover:border-red-500/20 transition-all group"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 ${
                  isActive 
                    ? `${item.activeBg} ${item.color} border border-white/10 shadow-[0_0_15px_rgba(0,212,255,0.1)]` 
                    : `bg-transparent text-gray-500 border border-transparent hover:bg-white/5 hover:text-white`
                } soft-button`}
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
