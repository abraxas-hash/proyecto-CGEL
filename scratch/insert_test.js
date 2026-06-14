const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('comunicados_oficiales')
    .insert([
      {
        tipo: 'Alerta',
        titulo: 'TEST SSOMA: Uso Obligatorio de Arnés',
        contenido: 'Por favor, recuerden que todo el personal en el área de descarga debe utilizar arnés y línea de vida. Es de carácter OBLIGATORIO.',
        autor_rol: 'SSOMA',
        enlace_documento: null
      }
    ]);

  if (error) {
    console.error('Error insertando la alerta:', error.message);
  } else {
    console.log('¡Alerta de prueba insertada con éxito!');
  }
}

main();
