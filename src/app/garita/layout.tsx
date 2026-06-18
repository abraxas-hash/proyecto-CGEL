'use client';

import { useState } from "react";
import { AsciiArt } from "@/components/ui/ascii-art";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function GaritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full text-slate-800 dark:text-white flex flex-col font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative z-50">
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
          <LogoutButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full flex justify-center">
        <div className="w-full max-w-xl p-4 md:p-6 pb-12">
          {children}
        </div>
      </main>
      
      {/* Ambient background glow & ASCII */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20 dark:opacity-40">
          <AsciiArt
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            resolution={50}
            charset="blocks"
            color="#D97736"
            inverted={true}
            animated={true}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#D97736] rounded-full blur-[120px] opacity-10"></div>
      </div>
    </div>
  );
}

function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Usamos await para asegurarnos que la cookie se elimina en el servidor
      // antes de redirigir, así evitamos que el middleware / proxy nos rebote al dashboard.
      await supabase.auth.signOut();
      localStorage.clear();
      // Usar timestamp para evitar que el navegador use un redirect 307 cacheado
      window.location.href = `/login?t=${Date.now()}`;
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-10 h-10 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-red-900/20 dark:hover:text-red-500 transition-colors shadow-sm active:scale-95 touch-manipulation cursor-pointer relative z-[100] disabled:opacity-50"
      title="Cerrar Sesión"
    >
      {isLoggingOut ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Cerrar Sesión</span>
    </button>
  );
}
