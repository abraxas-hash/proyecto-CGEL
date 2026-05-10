import { createAdminClient } from '@/lib/supabaseClient';
import Header from '@/components/layout/Header';
import ContratistasClient from './ContratistasClient';

export const revalidate = 10;

export default async function ContratistasPage() {
  const supabase = createAdminClient();
  const { data: contratistas, error } = await supabase
    .from('registro_contratistas')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">
        <h2 className="text-red-500 font-bold mb-4">Error cargando contratistas de Supabase</h2>
        <pre className="bg-red-950/50 text-red-200 p-4 rounded-xl overflow-auto text-sm border border-red-500/20">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <ContratistasClient initialContratistas={contratistas || []} />
    </div>
  );
}
