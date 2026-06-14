import Header from '@/components/layout/Header';

export default function Loading() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] animate-pulse">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 bg-white/5 rounded-3xl border border-slate-700"></div>
          <div className="h-48 bg-white/5 rounded-3xl border border-slate-700"></div>
        </div>
        <div className="lg:col-span-4 h-[600px] bg-white/5 rounded-3xl border border-slate-700"></div>
        <div className="lg:col-span-4 h-[600px] bg-white/5 rounded-3xl border border-slate-700"></div>
      </div>
    </div>
  );
}
