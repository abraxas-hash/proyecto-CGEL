import { createAdminClient } from '@/lib/supabaseClient';
import RepartidorClient from './RepartidorClient';

export const revalidate = 30;

export default async function RepartidorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Obtener los datos del repartidor actual
  const { data: repartidor } = await supabase
    .from('registro_diario_repartidores')
    .select('*')
    .eq('id', id)
    .single();

  if (!repartidor) {
    return <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">Registro no encontrado (ID: {id}).</div>;
  }

  // 2. Obtener el historial completo de este conductor (Récord de visitas pasadas)
  const { data: historial } = await supabase
    .from('registro_diario_repartidores')
    .select('id, fecha, entrada_1, salida_1, entrada_2, salida_2, entrada_3, salida_3, epp_ok, sctr_ok')
    .eq('conductor_apellido', repartidor.conductor_apellido)
    .order('fecha', { ascending: false })
    .limit(5);

  // 3. Obtener las evidencias fotográficas
  let { data: evidencias } = await supabase
    .from('evidencias_fotograficas')
    .select('*')
    .eq('vinculado_a_registro_id', id);

  // MOCK DATA: Si no hay evidencias, simulamos unas para visualizar el diseño
  if (!evidencias || evidencias.length === 0) {
    evidencias = [
      {
        id: 'mock-1',
        tipo_evidencia: 'SCTR',
        etiqueta: 'SCTR_VIGENTE',
        url_foto: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
        fecha_captura: new Date(new Date(repartidor.fecha).getTime() + 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-2',
        tipo_evidencia: 'ESTIBA',
        etiqueta: repartidor.placa || 'FOTO_CAMION',
        url_foto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop',
        fecha_captura: new Date(new Date(repartidor.fecha).getTime() + 8.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-3',
        tipo_evidencia: 'EPP',
        etiqueta: repartidor.conductor_apellido,
        url_foto: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        fecha_captura: new Date(new Date(repartidor.fecha).getTime() + 8.6 * 60 * 60 * 1000).toISOString()
      }
    ] as any;
  }

  return (
    <RepartidorClient 
      repartidor={repartidor} 
      historial={historial} 
      evidencias={evidencias} 
    />
  );
}
