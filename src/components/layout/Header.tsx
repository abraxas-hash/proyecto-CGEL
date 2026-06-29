'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Truck, Users, ShieldCheck, ShieldAlert, Wrench, LogOut, Clock, MapPin, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { GuidedTourButton } from '@/components/ui/GuidedTourButton';

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
    { name: 'RESUMEN', href: '/', icon: Home, color: 'text-gray-400', activeBg: 'bg-white/10', hoverBg: 'hover:bg-white/10' },
    { name: 'REPARTIDORES', href: '/repartidores', icon: Truck, color: 'text-slate-800 dark:text-white', activeBg: 'bg-[#00d4ff]/20', hoverBg: 'hover:bg-[#00d4ff]/20' },
    { name: 'VISITAS', href: '/visitas', icon: Users, color: 'text-purple-400', activeBg: 'bg-purple-500/20', hoverBg: 'hover:bg-purple-500/20' },
    { name: 'PROVEEDORES', href: '/proveedores', icon: ShieldCheck, color: 'text-green-400', activeBg: 'bg-green-500/20', hoverBg: 'hover:bg-green-500/20' },
    { name: 'CONTRATISTAS', href: '/contratistas', icon: Wrench, color: 'text-orange-400', activeBg: 'bg-orange-500/20', hoverBg: 'hover:bg-orange-500/20' },
    { name: 'ANALÍTICA', href: '/analitica', icon: BarChart2, color: 'text-purple-400', activeBg: 'bg-purple-500/20', hoverBg: 'hover:bg-purple-500/20' },
    { name: 'POLÍTICAS', href: '/politicas', icon: ShieldCheck, color: 'text-blue-400', activeBg: 'bg-blue-500/20', hoverBg: 'hover:bg-blue-500/20' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 dark:border-white/[0.08] bg-[#e0e5ec] dark:bg-[#0e1117] px-2 md:px-4 py-2 transition-colors duration-500">
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4 w-full">
        
        {/* Logo & Version (Fijo a la izquierda) */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-black/5 dark:bg-white/5 p-1.5 rounded-lg border border-black/10 dark:border-white/10">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs md:text-sm font-black text-black dark:text-white tracking-tighter leading-none">NEXUS CONTROL</h1>
              <span className="text-[7px] md:text-[8px] text-slate-800 dark:text-white dark:text-slate-800 dark:text-white font-bold uppercase tracking-widest">v2.8.3-UX</span>
            </div>
          </Link>
        </div>

        {/* Navigation (Flexible y scrolleable en el medio) */}
        <nav className="flex-1 min-w-0 flex items-center justify-start md:justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`shrink-0 flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black transition-all whitespace-nowrap ${
                  isActive 
                    ? `${item.activeBg} ${item.color} border border-black/10 dark:border-white/10 shadow-sm` 
                    : `text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`
                }`}
                title={item.name}
              >
                <Icon className="w-4 h-4 md:w-3.5 md:h-3.5" />
                <span className="hidden lg:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Info (Fijo a la derecha) */}
        <div className="shrink-0 flex items-center gap-1 md:gap-3">
          <div className="hidden xl:flex flex-col items-end border-r border-black/10 dark:border-white/10 pr-3 mr-1">
             <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 text-slate-800 dark:text-white dark:text-slate-800 dark:text-white" />
                {time ? time.toLocaleTimeString('es-PE', { hour12: false }) : '--:--'}
             </div>
             {userEmail && (
               <div className="flex items-center gap-1.5 mt-0.5 text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                  <span className="text-slate-800 dark:text-white/80 dark:text-slate-800 dark:text-white/60">{userRole || 'AUDITOR'}</span>
                  <span className="opacity-30">|</span>
                  <span>{userEmail.split('@')[0]}</span>
               </div>
             )}
          </div>
          
          <ModeToggle />
          
          <div className="hidden sm:block">
            <GuidedTourButton />
          </div>

          <button 
            onClick={async () => {
              try {
                const { supabase } = await import('@/lib/supabaseClient');
                await supabase.auth.signOut();
                localStorage.clear();
                window.location.replace('/login');
              } catch (err) {
                console.error('Logout error:', err);
                window.location.replace('/login');
              }
            }}
            className="p-2 md:p-2.5 bg-black/5 dark:bg-white/5 hover:bg-red-500/10 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 rounded-lg md:rounded-xl border border-black/10 dark:border-white/10 transition-all flex items-center justify-center"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
