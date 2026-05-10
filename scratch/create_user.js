const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Faltan variables de entorno en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  console.log('--- Iniciando Creación de Usuario de Prueba ---');
  
  const email = 'admin@cgel.com';
  const password = 'Sonepar2026*';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Confirmamos el email automáticamente
    user_metadata: { role: 'admin', name: 'Supervisor Sonepar' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log(`✅ El usuario ${email} ya existe. Puedes usarlo para las pruebas.`);
    } else {
      console.error('❌ Error al crear usuario:', error.message);
    }
  } else {
    console.log('✨ Usuario creado exitosamente:');
    console.log(`📧 Email: ${data.user.email}`);
    console.log(`🔒 Password: ${password}`);
    console.log('--- Proceso Finalizado ---');
  }
}

createTestUser();
