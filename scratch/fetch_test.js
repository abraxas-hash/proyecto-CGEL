const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function main() {
  console.log('--- ADMIN FETCH ---');
  const { data: adminData, error: adminErr } = await supabaseAdmin.from('comunicados_oficiales').select('*');
  console.log(adminErr ? adminErr : adminData);

  console.log('--- ANON FETCH ---');
  const { data: anonData, error: anonErr } = await supabaseAnon.from('comunicados_oficiales').select('*');
  console.log(anonErr ? anonErr : anonData);
}

main();
