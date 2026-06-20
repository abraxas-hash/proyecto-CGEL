require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const { google } = require('@ai-sdk/google');
const { generateText, tool } = require('ai');
const { z } = require('zod');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dbParams = z.object({
  query: z.string().describe('El número de DNI, nombre de la persona, placa del vehículo o nombre de la empresa a buscar'),
});

const myTools = {
    consultarBaseDatos: tool({
      description: 'Busca el historial o récord de un DNI',
      parameters: dbParams,
      execute: async (args) => {
        const query = String(args.query || '').trim();
        console.log(`[Nexus AI] Buscando en TODAS las tablas BD: '${query}'`);
        let resultados = {};
        const isDni = /^\d+$/.test(query);

        const searchVisitas = async () => {
          let q = supabase.from('registro_visitas').select('*').order('fecha', { ascending: false }).limit(15);
          if (isDni) q = q.eq('dni', query); else q = q.or(`visitante_nombre.ilike.%${query}%,empresa.ilike.%${query}%`);
          const { data, error } = await q;
          if (error) console.error("VISITAS ERROR:", error);
          if (data && data.length > 0) resultados.visitas = data;
        };

        const searchProveedores = async () => {
          let q = supabase.from('registro_proveedores_carga').select('*').order('fecha', { ascending: false }).limit(15);
          if (isDni) q = q.eq('dni', query); else q = q.or(`conductor_nombre.ilike.%${query}%,empresa.ilike.%${query}%,placa.ilike.%${query}%`);
          const { data, error } = await q;
          if (error) console.error("PROV ERROR:", error);
          if (data && data.length > 0) resultados.proveedores = data;
        };

        const searchRepartidores = async () => {
          let q = supabase.from('registro_diario_repartidores').select('*').order('fecha', { ascending: false }).limit(15);
          q = q.or(`conductor_apellido.ilike.%${query}%,empresa_abreviatura.ilike.%${query}%,placa.ilike.%${query}%`);
          const { data, error } = await q;
          if (error) console.error("REP ERROR:", error);
          if (data && data.length > 0) resultados.repartidores = data;
        };

        await Promise.all([searchVisitas(), searchProveedores(), searchRepartidores()]);

        console.log("RESULTADOS:", Object.keys(resultados));
        return Object.keys(resultados).length > 0 ? resultados : { mensaje: "No se encontraron registros" };
      }
    })
};

const SYSTEM_PROMPT = `Eres Nexus AI. 
REGLA CRÍTICA: SIEMPRE debes usar la herramienta consultarBaseDatos para CADA nueva placa, DNI o nombre que el usuario pida.`;

async function test() {
  const result = await generateText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages: [{role: 'user', content: 'dame informacion del dni 48287778'}],
    tools: myTools,
    maxRetries: 0
  });

  console.log("Tool Calls:", JSON.stringify(result.toolCalls, null, 2));
  console.log("Tool Results:", JSON.stringify(result.toolResults, null, 2));
}

test().catch(console.error);
