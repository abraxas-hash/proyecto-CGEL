'use client';

import { ModeToggle } from "@/components/ui/ModeToggle";
import { LogOut } from "lucide-react";

export default function AlmacenExternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full text-slate-800 dark:text-white flex flex-col font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative z-50 bg-slate-50 dark:bg-[#0e1117] custom-scrollbar">
      {/* Top Status Bar Decoration */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-400 dark:border-slate-700 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#D97736] to-[#A85A24] flex items-center justify-center shadow-[0_0_10px_rgba(217,119,54,0.3)]">
            <span className="text-[10px] font-black text-white">CG</span>
          </div>
          <h1 className="text-sm font-bold tracking-widest uppercase">Garita Móvil</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-slate-900 dark:text-slate-300 font-black uppercase tracking-wider hidden sm:inline">Online</span>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
          <ModeToggle />
          <button 
            onClick={async () => {
              try {
                const { createBrowserClient } = await import('@supabase/ssr');
                const supabaseClient = createBrowserClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
                );
                await supabaseClient.auth.signOut();
                localStorage.clear();
                window.location.replace('/login');
              } catch (err) {
                console.error('Logout error:', err);
                window.location.replace('/login');
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-red-900/20 dark:hover:text-red-500 transition-colors shadow-sm"
            title="Cerrar Sesión"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full flex justify-center">
        <div className="w-full max-w-xl p-4 md:p-6 lg:p-8 overflow-x-hidden pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}
