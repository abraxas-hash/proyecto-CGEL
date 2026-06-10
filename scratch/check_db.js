const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqouocmxfvcpyemxvobm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3VvY214ZnZjcHllbXh2b2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg0MDU4NiwiZXhwIjoyMDY3NDE2NTg2fQ.WYzE45zlmtNeuMUCk9WPw4H89GI67ooFmsSam0NDOmc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('cuaderno_ocurrencias')
    .select('*')
    .limit(1);
  if (error) {
    console.error('Error fetching cuaderno_ocurrencias:', error);
  } else {
    console.log('cuaderno_ocurrencias columns:', Object.keys(data[0] || {}));
    console.log('Sample record:', data[0]);
  }
}

check();
