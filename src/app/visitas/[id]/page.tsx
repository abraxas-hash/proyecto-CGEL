import { createAdminClient } from '@/lib/supabaseClient';
import VisitaClient from './VisitaClient';

export const revalidate = 30;

export default async function VisitaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. Obtener datos de la visita
  const { data: visita } = await supabase
    .from('registro_visitas')
    .select('*')
    .eq('id', id)
    .single();

  if (!visita) {
    return <div className="p-8 text-white font-[family-name:var(--font-geist-sans)]">Visita no encontrada (ID: {id}).</div>;
  }

  // 2. Historial de ingresos de esta persona (por DNI)
  const { data: historial } = await supabase
    .from('registro_visitas')
    .select('id, fecha, hora_ingreso, hora_salida, referencia_visita')
    .eq('dni_ce', visita.dni_ce)
    .order('fecha', { ascending: false })
    .limit(10);

  // 3. Evidencias vinculadas
  let { data: evidencias } = await supabase
    .from('evidencias_fotograficas')
    .select('*')
    .eq('vinculado_a_registro_id', id);

  // Mocks de seguridad
  if (!evidencias || evidencias.length === 0) {
    evidencias = [
      {
        id: 'mock-v-1',
        tipo_evidencia: 'DNI',
        etiqueta: visita.dni_ce,
        url_foto: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=800&auto=format&fit=crop',
        fecha_captura: new Date(new Date(visita.fecha).getTime() + 9 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-v-2',
        tipo_evidencia: 'ACCESO',
        etiqueta: 'PORTAL_ENTRADA',
        url_foto: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
        fecha_captura: new Date(new Date(visita.fecha).getTime() + 9 * 60 * 60 * 1000).toISOString()
      }
    ] as any;
  }

  return (
    <VisitaClient 
      visita={visita} 
      historial={historial} 
      evidencias={evidencias} 
    />
  );
}
