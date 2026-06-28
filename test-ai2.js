require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const query = '2026-06-22';
  console.log("Testing query:", query);
  
  let q = supabase.from('registro_proveedores_carga').select('*').order('fecha', { ascending: false }).limit(30);
  q = q.eq('fecha', query);
  
  const { data, error } = await q;
  
  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("DATA LENGTH:", data ? data.length : 0);
  }
}

test().catch(console.error);
