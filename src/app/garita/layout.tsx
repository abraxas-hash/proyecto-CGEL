'use client';

import { AsciiArt } from "@/components/ui/ascii-art";

export default function GaritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#111111] text-white flex flex-col font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative z-50">
      {/* Top Status Bar Decoration */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#111111]/90 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#0047AB] to-[#00d4ff] flex items-center justify-center">
            <span className="text-[10px] font-black text-white">CG</span>
          </div>
          <h1 className="text-sm font-bold tracking-widest uppercase">Garita Móvil</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Online</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-6 relative z-10 p-4">
        {children}
      </main>
      
      {/* Ambient background glow & ASCII */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-40">
          <AsciiArt
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            resolution={50}
            charset="blocks"
            color="#00d4ff"
            inverted={true}
            animated={true}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#00d4ff] rounded-full blur-[120px] opacity-10"></div>
      </div>
    </div>
  );
}
