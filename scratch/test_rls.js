const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

async function runTest() {
  console.log('--- TEST DE SEGURIDAD RLS ---');

  // 1. Crear un usuario de prueba "Sonepar" (Solo Lectura)
  const email = 'auditor@sonepar.com';
  const password = 'Sonepar2026*';

  console.log(`Intentando crear/usar usuario: ${email}`);
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  let userId;
  if (authError) {
    if (authError.message.includes('already registered')) {
      const { data: existingUser } = await adminClient.auth.admin.listUsers();
      userId = existingUser.users.find(u => u.email === email).id;
      console.log('✅ Usuario ya existente.');
    } else {
      console.error('❌ Error Auth:', authError.message);
      return;
    }
  } else {
    userId = authData.user.id;
    console.log('✨ Usuario creado.');
  }

  // 2. Forzar rol 'sonepar' en la tabla de perfiles
  console.log('Asignando rol "sonepar" (Solo Lectura)...');
  await adminClient
    .from('perfiles')
    .update({ rol: 'sonepar' })
    .eq('id', userId);

  // 3. Simular sesión de usuario (Usando el cliente ANON + JWT)
  console.log('Iniciando sesión para obtener JWT...');
  const { data: sessionData } = await adminClient.auth.signInWithPassword({
    email,
    password
  });

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    }
  });

  // 4. PRUEBA DE LECTURA (Debe funcionar)
  console.log('\n--- PRUEBA 1: Lectura de Visitas (Permitido) ---');
  const { data: visitas, error: vError } = await userClient.from('registro_visitas').select('*').limit(1);
  if (vError) console.error('❌ Error Lectura:', vError.message);
  else console.log('✅ Lectura exitosa (RLS permite lectura a authenticated).');

  // 5. PRUEBA DE ESCRITURA (Debe FALLAR para rol sonepar)
  console.log('\n--- PRUEBA 2: Inserción de Visita (Denegado para Sonepar) ---');
  const { error: iError } = await userClient.from('registro_visitas').insert({
    nombre_completo: 'TEST RLS',
    dni_ce: '00000000'
  });
  if (iError) console.log('✅ Bloqueo exitoso:', iError.message);
  else console.error('❌ ERROR DE SEGURIDAD: Sonepar pudo insertar datos.');

  // 6. PRUEBA DE DIRECTORIO SCTR (Debe FALLAR para rol sonepar)
  console.log('\n--- PRUEBA 3: Lectura de Directorio SCTR (Denegado para Sonepar) ---');
  const { data: sctr, error: sError } = await userClient.from('directorio_sctr').select('*');
  if (sError) console.log('✅ Privacidad exitosa:', sError.message);
  else if (sctr.length > 0) console.error('❌ ERROR DE SEGURIDAD: Sonepar pudo ver datos sensibles del SCTR.');
  else console.log('✅ Privacidad exitosa (No se devolvieron datos).');

  console.log('\n--- FIN DEL TEST ---');
}

runTest();
