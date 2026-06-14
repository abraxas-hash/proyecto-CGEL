import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testQuery() {
  const query = 'ABJ-550';
  let q = supabase.from('registro_diario_repartidores')
    .select('*')
    .or(`conductor_apellido.ilike.%${query}%,empresa_abreviatura.ilike.%${query}%,placa.ilike.%${query}%`);
  const res = await q;
  console.log('Query result:', res.data);
  console.log('Query error:', res.error);
}

testQuery();
