import { createAdminClient } from '@/lib/supabaseClient';
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
      <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">
        <h2 className="text-red-500 font-bold mb-4">Error cargando datos de Supabase</h2>
        <pre className="bg-red-950/50 text-red-200 p-4 rounded-xl overflow-auto text-sm border border-red-500/20">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] max-w-full overflow-x-hidden">
      <Header />
      <ProveedoresClient initialProveedores={proveedores || []} />
    </div>
  );
}
