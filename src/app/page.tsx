import { createAdminClient } from '@/lib/supabaseClient';
import { ComunicadosWidget } from '@/components/dashboard/ComunicadosWidget';
import Header from '@/components/layout/Header';
import { CollapsibleMetrics } from '@/components/dashboard/CollapsibleMetrics';
import SafeAnalytics from '@/components/dashboard/SafeAnalytics';

import { OperationalFunnel } from '@/components/dashboard/OperationalFunnel';

import { EmotionManagementWidget } from '@/components/dashboard/EmotionManagementWidget';
import { AnalisisDia } from '@/components/dashboard/AnalisisDia';
export const dynamic = 'force-dynamic';

const HOURLY_DATA = [
  { hour: '06:00', total: 2 },
  { hour: '08:00', total: 8 },
  { hour: '10:00', total: 15 },
  { hour: '12:00', total: 12 },
  { hour: '14:00', total: 20 },
  { hour: '16:00', total: 14 },
  { hour: '18:00', total: 5 },
  { hour: '20:00', total: 3 },
];

export default async function Home() {
  const supabase = createAdminClient();
  const [
    { count: countRepartidores },
    { count: countVisitas },
    { count: countProveedores },
    { count: countContratistas }
  ] = await Promise.all([
    supabase.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }),
    supabase.from('registro_visitas').select('*', { count: 'exact', head: true }),
    supabase.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }),
    supabase.from('registro_contratistas').select('*', { count: 'exact', head: true })
  ]);

  const counts = {
    repartidores: countRepartidores || 0,
    visitas: countVisitas || 0,
    proveedores: countProveedores || 0,
    contratistas: countContratistas || 0,
  };

  const distributionData = [
    { name: 'Repartidores', value: countRepartidores || 0 },
    { name: 'Visitas', value: countVisitas || 0 },
    { name: 'Proveedores', value: countProveedores || 0 },
    { name: 'Contratistas', value: countContratistas || 0 },
  ];

  const hourlyData = HOURLY_DATA;

  const [
    { count: countInsideVisitas },
    { count: countInsideContratistas },
    { count: countInsideRepartidores },
    { count: countInsideProveedores }
  ] = await Promise.all([
    supabase.from('registro_visitas').select('*', { count: 'exact', head: true }).is('hora_salida', null),
    supabase.from('detalle_personal_contratistas').select('*', { count: 'exact', head: true }).is('hora_salida', null),
    supabase.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }).is('salida_1', null),
    supabase.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }).is('hora_salida', null)
  ]);

  const totalInside = Number(countInsideVisitas || 0) + 
                    Number(countInsideContratistas || 0) + 
                    Number(countInsideProveedores || 0) + 
                    Number(countInsideRepartidores || 0);

  const weeklyData = [
    { day: 'Lun', total: 45 },
    { day: 'Mar', total: 52 },
    { day: 'Mie', total: 38 },
    { day: 'Jue', total: totalInside + counts.repartidores + counts.visitas + counts.proveedores + counts.contratistas },
    { day: 'Vie', total: 48 },
    { day: 'Sab', total: 15 },
    { day: 'Dom', total: 5 },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />

      <main className="mt-6 sm:mt-8">

        {/* Módulo de Comunicaciones Oficiales */}
        <div className="mb-8">
          <ComunicadosWidget />
        </div>

        {/* Tarjetas métricas colapsables */}
        <div className="mb-8">
          <CollapsibleMetrics counts={counts} />
        </div>

        {/* Resumen Analítico del Día */}
        <div className="mb-8" id="tour-analisis">
          <AnalisisDia />
        </div>




        {/* Embudo y Gestión Emocional en 2 columnas */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="tour-funnel">
            <OperationalFunnel />
          </div>
          <div id="tour-emotions">
            <EmotionManagementWidget />
          </div>
        </div>

        {/* Analíticas Avanzadas */}
        <div className="mt-8 mb-8">
          <SafeAnalytics 
            data={{
              distribution: distributionData,
              hourly: hourlyData,
              weekly: weeklyData,
              counts: counts
            }}
          />
        </div>
      </main>
    </div>
  );
}
