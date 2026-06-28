import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nqouocmxfvcpyemxvobm.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3VvY214ZnZjcHllbXh2b2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg0MDU4NiwiZXhwIjoyMDY3NDE2NTg2fQ.WYzE45zlmtNeuMUCk9WPw4H89GI67ooFmsSam0NDOmc'

const supabaseDb = createClient(supabaseUrl, serviceRoleKey)

async function test() {
  const query = '2026-06-22'
  let q = supabaseDb.from('registro_proveedores_carga').select('*').order('fecha', { ascending: false }).limit(30)
  q = q.eq('fecha', query)
  
  const { data, error } = await q
  console.log("Error:", error)
  console.log("Data length:", data ? data.length : 0)
  console.log("Data:", data)
}

test()
