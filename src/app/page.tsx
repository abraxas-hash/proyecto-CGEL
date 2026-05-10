import { createAdminClient } from '@/lib/supabaseClient';
import { ShieldCheck, Truck, Users, Wrench } from 'lucide-react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import SafeAnalytics from '@/components/dashboard/SafeAnalytics';
import SafetyObservations from '@/components/dashboard/SafetyObservations';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createAdminClient();
  const { count: countRepartidores } = await supabase
    .from('registro_diario_repartidores')
    .select('*', { count: 'exact', head: true });

  const { count: countVisitas } = await supabase
    .from('registro_visitas')
    .select('*', { count: 'exact', head: true });

  const { count: countProveedores } = await supabase
    .from('registro_proveedores_carga')
    .select('*', { count: 'exact', head: true });

  const { count: countContratistas } = await supabase
    .from('registro_contratistas')
    .select('*', { count: 'exact', head: true });

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

  const hourlyData = [
    { hour: '06:00', total: 2 },
    { hour: '08:00', total: 8 },
    { hour: '10:00', total: 15 },
    { hour: '12:00', total: 12 },
    { hour: '14:00', total: 20 },
    { hour: '16:00', total: 14 },
    { hour: '18:00', total: 5 },
    { hour: '20:00', total: 3 },
  ];

  const { count: countInsideVisitas } = await supabase
    .from('registro_visitas')
    .select('*', { count: 'exact', head: true })
    .is('hora_salida', null);

  const { count: countInsideContratistas } = await supabase
    .from('detalle_personal_contratistas')
    .select('*', { count: 'exact', head: true })
    .is('hora_salida', null);

  const { count: countInsideRepartidores } = await supabase
    .from('registro_diario_repartidores')
    .select('*', { count: 'exact', head: true })
    .is('salida_1', null);

  const { count: countInsideProveedores } = await supabase
    .from('registro_proveedores_carga')
    .select('*', { count: 'exact', head: true })
    .is('hora_salida', null);

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

      <main>
        {/* Alertas de Seguridad en Vivo */}
        {totalInside > 0 ? (
          <div className="mb-8 p-4 sm:p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0"></div>
              <p className="text-red-500 text-xs sm:text-sm font-black uppercase tracking-widest leading-tight">
                ALERTA DE SEGURIDAD: {totalInside} Personas/Vehículos en Planta sin salida registrada
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-red-400/80">
              <span className="bg-red-500/10 px-2 py-1 rounded">REPARTIDORES: {countInsideRepartidores || 0}</span>
              <span className="bg-red-500/10 px-2 py-1 rounded">VISITAS: {countInsideVisitas || 0}</span>
              <span className="bg-red-500/10 px-2 py-1 rounded">CONTRATISTAS: {countInsideContratistas || 0}</span>
              <span className="bg-red-500/10 px-2 py-1 rounded">PROVEEDORES: {countInsideProveedores || 0}</span>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-500 text-xs font-black uppercase tracking-widest">Planta Despejada - Sin ingresos pendientes de salida</p>
          </div>
        )}

        {/* Grid de tarjetas métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard 
            title="Repartidores" 
            subtitle="Control diario de rutas"
            value={countRepartidores || 0}
            Icon={Truck}
            colorTheme="blue"
            href="/repartidores"
          />

          <MetricCard 
            title="Visitas" 
            subtitle="Control de pases de seguridad"
            value={countVisitas || 0}
            Icon={Users}
            colorTheme="purple"
            href="/visitas"
          />

          <MetricCard 
            title="Proveedores" 
            subtitle="Revisión SCTR y Guías"
            value={countProveedores || 0}
            Icon={ShieldCheck}
            colorTheme="green"
            href="/proveedores"
          />

          <MetricCard 
            title="Contratistas" 
            subtitle="Inventario y personal"
            value={countContratistas || 0}
            Icon={Wrench}
            colorTheme="orange"
            href="/contratistas"
          />
        </div>

        {/* Panel de Observaciones Críticas de Seguridad (SSOMA) */}
        <SafetyObservations />

        {/* Sección de Gráficas Avanzadas */}
        <div className="mt-8">
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
