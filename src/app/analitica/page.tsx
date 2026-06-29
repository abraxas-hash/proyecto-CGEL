import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabaseClient';
import Header from '@/components/layout/Header';
import AnaliticaClient from './AnaliticaClient';

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

export default async function AnaliticaPage() {
  const supabase = createAdminClient();

  const [
    { count: countRepartidores },
    { count: countVisitas },
    { count: countProveedores },
    { count: countContratistas },
  ] = await Promise.all([
    supabase.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }),
    supabase.from('registro_visitas').select('*', { count: 'exact', head: true }),
    supabase.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }),
    supabase.from('registro_contratistas').select('*', { count: 'exact', head: true }),
  ]);

  const counts = {
    repartidores: countRepartidores || 0,
    visitas: countVisitas || 0,
    proveedores: countProveedores || 0,
    contratistas: countContratistas || 0,
  };

  const [
    { count: countInsideVisitas },
    { count: countInsideContratistas },
    { count: countInsideRepartidores },
    { count: countInsideProveedores },
  ] = await Promise.all([
    supabase.from('registro_visitas').select('*', { count: 'exact', head: true }).is('hora_salida', null),
    supabase.from('detalle_personal_contratistas').select('*', { count: 'exact', head: true }).is('hora_salida', null),
    supabase.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }).is('salida_1', null),
    supabase.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }).is('hora_salida', null),
  ]);

  const totalInside =
    Number(countInsideVisitas || 0) +
    Number(countInsideContratistas || 0) +
    Number(countInsideProveedores || 0) +
    Number(countInsideRepartidores || 0);

  const data = {
    distribution: [
      { name: 'Repartidores', value: countRepartidores || 0 },
      { name: 'Visitas', value: countVisitas || 0 },
      { name: 'Proveedores', value: countProveedores || 0 },
      { name: 'Contratistas', value: countContratistas || 0 },
    ],
    hourly: HOURLY_DATA,
    weekly: [
      { day: 'Lun', total: 45 },
      { day: 'Mar', total: 52 },
      { day: 'Mie', total: 38 },
      { day: 'Jue', total: totalInside + counts.repartidores + counts.visitas + counts.proveedores + counts.contratistas },
      { day: 'Vie', total: 48 },
      { day: 'Sab', total: 15 },
      { day: 'Dom', total: 5 },
    ],
    counts,
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="mt-6 sm:mt-8 mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-800 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-slate-400 dark:border-slate-700 text-sm font-bold shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Resumen
        </Link>
      </div>
      <AnaliticaClient data={data} />
    </div>
  );
}
