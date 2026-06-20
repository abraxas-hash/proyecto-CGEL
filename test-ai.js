require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const { google } = require('@ai-sdk/google');
const { generateText, tool } = require('ai');
const { z } = require('zod');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dbParams = z.object({
  query: z.string(),
  tipo: z.enum(['visitas', 'proveedores', 'repartidores', 'todos']).optional()
});

const myTools = {
    consultarBaseDatos: tool({
      description: 'Busca un DNI',
      parameters: dbParams,
      execute: async (args) => {
        const query = String(args.query || '').trim();
        const tipo = args.tipo || 'todos';
        console.log("TOOL EXECUTED WITH:", query, tipo);
        
        let resultados = {};
        const isDni = /^\d+$/.test(query);

        let q = supabase.from('registro_visitas').select('*').order('fecha', { ascending: false }).limit(15);
        if (isDni) q = q.eq('dni', query); else q = q.or(`visitante_nombre.ilike.%${query}%,empresa.ilike.%${query}%`);
        const { data, error } = await q;
        if (error) console.error("DB ERROR:", error);
        if (data && data.length > 0) resultados.visitas = data;

        console.log("TOOL RETURNING:", Object.keys(resultados).length > 0 ? "DATA FOUND" : "NO DATA");
        return Object.keys(resultados).length > 0 ? resultados : { mensaje: "No se encontraron registros" };
      }
    })
};

async function test() {
  const result = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: "dame informacion del dni 48287778",
    tools: myTools,
  });

  console.log("Tool Calls:", JSON.stringify(result.toolCalls, null, 2));
  console.log("Tool Results:", JSON.stringify(result.toolResults, null, 2));
}

test().catch(console.error);
