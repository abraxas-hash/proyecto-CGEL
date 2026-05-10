import Header from '@/components/layout/Header';

export default function Loading() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] animate-pulse">
      <Header />
      
      <main className="glass-panel rounded-2xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-white/5 rounded-lg w-64"></div>
          <div className="h-10 bg-white/5 rounded-lg w-32"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      </main>
    </div>
  );
}
