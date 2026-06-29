import { createAdminClient } from '@/lib/supabaseClient';
import GasDetailClient from './GasDetailClient';

export const dynamic = 'force-dynamic';

export default async function GasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Obtener los datos del proveedor actual
  const { data: proveedor } = await supabase
    .from('registro_proveedores_carga')
    .select('*')
    .eq('id', id)
    .single();

  if (!proveedor) {
    return <div className="p-8 text-slate-800 dark:text-white font-[family-name:var(--font-geist-sans)]">Gas Montacargas no encontrado (ID: {id}).</div>;
  }

  // 2 y 3. Historial de ingresos y evidencias vinculadas (en paralelo)
  let [
    { data: historial },
    { data: evidenciasResult }
  ] = await Promise.all([
    supabase
      .from('registro_proveedores_carga')
      .select('id, fecha, hora_llegada, conductor, autorizado')
      .eq('empresa_proveedor', proveedor.empresa_proveedor)
      .order('fecha', { ascending: false })
      .limit(8),
    supabase
      .from('evidencias_fotograficas')
      .select('*')
      .eq('vinculado_a_registro_id', id)
  ]);

  let evidencias = evidenciasResult || [];

  return (
    <GasDetailClient 
      proveedor={proveedor} 
      historial={historial || []} 
      evidencias={evidencias || []} 
    />
  );
}
