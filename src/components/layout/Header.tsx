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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-2">
      <div className="flex items-center justify-between gap-4 max-w-full overflow-hidden">
        
        {/* Logo & Version */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <img src="/logo-cgel.png" alt="Logo" className="h-6 w-auto" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-white tracking-tighter leading-none">CGEL CONTROL</h1>
            <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">v2.8.3-UX</span>
          </div>
        </Link>

        {/* Navigation - Compact Scroller */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black transition-all whitespace-nowrap ${
                  isActive 
                    ? `${item.activeBg} ${item.color} border border-white/10` 
                    : `text-gray-500 hover:text-white hover:bg-white/5`
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className={isActive ? 'block' : 'hidden md:block'}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex flex-col items-end opacity-60">
             <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400">
                <Clock className="w-3 h-3 text-cyan-400" />
                {time ? time.toLocaleTimeString('es-PE', { hour12: false }) : '--:--'}
             </div>
          </div>
          <button 
            onClick={async () => {
              const { supabase } = await import('@/lib/supabaseClient');
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg border border-white/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
