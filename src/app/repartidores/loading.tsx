import Header from '@/components/layout/Header';
import { Truck, Search, Filter } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />
      
      <main className="glass-panel rounded-2xl p-6 overflow-hidden relative">
        {/* HUD SCANLINE EFFECT */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-20">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-white/5 rounded-lg w-64"></div>
            <div className="h-4 bg-white/5 rounded-lg w-48"></div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto animate-pulse">
            <div className="h-10 bg-white/5 rounded-xl w-64"></div>
            <div className="h-10 bg-white/5 rounded-xl w-12"></div>
            <div className="h-10 bg-white/5 rounded-xl w-32"></div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-20">
          <div className="w-full space-y-4">
            {/* Header row skeleton */}
            <div className="h-12 bg-white/5 rounded-xl w-full border border-white/10"></div>
            
            {/* Table body skeletons */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div 
                key={i} 
                className="h-20 bg-white/5 rounded-2xl border border-white/5 animate-pulse flex items-center px-6 gap-6"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="h-10 w-10 bg-white/5 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/3"></div>
                  <div className="h-3 bg-white/5 rounded w-1/4 opacity-50"></div>
                </div>
                <div className="h-4 bg-white/5 rounded w-24"></div>
                <div className="h-8 bg-white/5 rounded-full w-24"></div>
                <div className="h-10 bg-white/5 rounded-lg w-28"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
