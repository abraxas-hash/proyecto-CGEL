import { createAdminClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import ProveedoresClient from './ProveedoresClient';

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
  const supabase = createAdminClient();
  const { data: proveedores, error } = await supabase
    .from('registro_proveedores_carga')
    .select('*')
    .order('fecha', { ascending: false })
    .order('hora_llegada', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-slate-800 dark:text-white font-[family-name:var(--font-geist-sans)]">
        <h2 className="text-red-500 font-bold mb-4">Error cargando proveedores de Supabase</h2>
        <pre className="bg-red-950/50 text-red-200 p-4 rounded-xl overflow-auto text-sm border border-red-500/20">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] max-w-full overflow-x-hidden">
      <Header />
      <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-slate-800 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-slate-400 dark:border-slate-700 text-sm font-bold w-full sm:w-auto justify-center sm:justify-start shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Volver al Resumen
        </Link>
      </div>
      <ProveedoresClient initialProveedores={proveedores || []} />
    </div>
  );
}
