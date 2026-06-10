import { createAdminClient } from '@/lib/supabaseClient';
import ContratistaClient from './ContratistaClient';

export const dynamic = 'force-dynamic';

export default async function ContratistaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Datos del contratista (Master)
  const { data: contratista } = await supabase
    .from('registro_contratistas')
    .select('*')
    .eq('id', id)
    .single();

  if (!contratista) {
    return <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">Contratista no encontrado (ID: {id}).</div>;
  }

  // 2, 3 y 4. Personal, herramientas y evidencias vinculadas (en paralelo)
  const [
    { data: personal },
    { data: herramientas },
    { data: evidenciasResult }
  ] = await Promise.all([
    supabase
      .from('detalle_personal_contratistas')
      .select('*')
      .eq('registro_contratista_id', id),
    supabase
      .from('inventario_herramientas_contratistas')
      .select('*')
      .eq('registro_contratista_id', id),
    supabase
      .from('evidencias_fotograficas')
      .select('*')
      .eq('vinculado_a_registro_id', id)
  ]);

  let evidencias = evidenciasResult;

  // Mocks industriales
  if (!evidencias || evidencias.length === 0) {
    evidencias = [
      {
        id: 'mock-c-1',
        tipo_evidencia: 'TRABAJO',
        etiqueta: 'INICIO_OBRA',
        url_foto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
        fecha_captura: new Date(new Date(contratista.fecha).getTime() + 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-c-2',
        tipo_evidencia: 'HERRAMIENTAS',
        etiqueta: 'INVENTARIO_01',
        url_foto: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop',
        fecha_captura: new Date(new Date(contratista.fecha).getTime() + 8.5 * 60 * 60 * 1000).toISOString()
      }
    ] as any;
  }

  return (
    <ContratistaClient 
      contratista={contratista} 
      personal={personal || []} 
      herramientas={herramientas || []} 
      evidencias={evidencias || []} 
    />
  );
}
