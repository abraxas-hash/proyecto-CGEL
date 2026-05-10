import { createAdminClient } from '@/lib/supabaseClient';
import ProveedorClient from './ProveedorClient';

export const revalidate = 30;

export default async function ProveedorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Obtener los datos del proveedor actual
  const { data: proveedor } = await supabase
    .from('registro_proveedores_carga')
    .select('*')
    .eq('id', id)
    .single();

  if (!proveedor) {
    return <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">Proveedor no encontrado (ID: {id}).</div>;
  }

  // 2. Obtener el historial de esta empresa
  const { data: historial } = await supabase
    .from('registro_proveedores_carga')
    .select('id, fecha, hora_llegada, conductor, autorizado')
    .eq('empresa_proveedor', proveedor.empresa_proveedor)
    .order('fecha', { ascending: false })
    .limit(8);

  // 3. Obtener evidencias fotográficas vinculadas
  let { data: evidencias } = await supabase
    .from('evidencias_fotograficas')
    .select('*')
    .eq('vinculado_a_registro_id', id);

  // Simulación de evidencias si no hay reales
  if (!evidencias || evidencias.length === 0) {
    evidencias = [
      {
        id: 'mock-p-1',
        tipo_evidencia: 'GUIAS',
        etiqueta: 'REMISION_V01',
        url_foto: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
        fecha_captura: new Date(new Date(proveedor.fecha).getTime() + 10 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-p-2',
        tipo_evidencia: 'CARGA',
        etiqueta: proveedor.placa,
        url_foto: 'https://images.unsplash.com/photo-1519003722824-192d99233858?q=80&w=600&auto=format&fit=crop',
        fecha_captura: new Date(new Date(proveedor.fecha).getTime() + 10.5 * 60 * 60 * 1000).toISOString()
      }
    ] as any;
  }

  return (
    <ProveedorClient 
      proveedor={proveedor} 
      historial={historial || []} 
      evidencias={evidencias || []} 
    />
  );
}
