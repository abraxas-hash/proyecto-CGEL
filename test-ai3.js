require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const { google } = require('@ai-sdk/google');
const { generateText, tool } = require('ai');
const { z } = require('zod');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dbParams = z.object({
  query: z.string().optional().describe('Término de búsqueda en texto: DNI, nombre, placa, empresa, número de guía. No usar para fechas.'),
  fecha: z.string().optional().describe('Si el usuario busca por fecha o mes, pasa el valor aquí en formato estricto YYYY-MM-DD (ej. 2026-06-22) o YYYY-MM (ej. 2026-06).'),
  tipo: z.enum(['visitas', 'proveedores', 'repartidores', 'todos']).optional().describe('El módulo donde buscar.')
});

const myTools = {
    consultarBaseDatos: tool({
      description: 'Busca el historial o récord en la base de datos',
      parameters: dbParams,
      execute: async (args) => {
        const query = String(args.query || '').trim();
        const fechaParams = String(args.fecha || '').trim();
        const searchStr = query || fechaParams;
        console.log(`[Nexus AI] Buscando en TODAS las tablas BD: query='${query}', fecha='${fechaParams}'`);
        let resultados = {};
        
        const isDni = /^\d+$/.test(searchStr) && searchStr.length >= 8;
        const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(fechaParams);
        const isMonthDate = /^\d{4}-\d{2}$/.test(fechaParams);

        const buildQuery = (table, textSearchFields) => {
          let q = supabase.from(table).select('*').order('fecha', { ascending: false }).limit(30);
          if (isDni && query) {
            q = q.eq('dni', query);
          } else if (isFullDate) {
            q = q.eq('fecha', fechaParams);
          } else if (isMonthDate) {
            q = q.gte('fecha', `${fechaParams}-01`).lte('fecha', `${fechaParams}-31`);
          } else if (query) {
            q = q.or(textSearchFields.split(',').map(f => `${f}.ilike.%${query}%`).join(','));
          }
          return q;
        };

        const searchProveedores = async () => {
          let q = buildQuery('registro_proveedores_carga', 'conductor_nombre,empresa,placa,tipo_carga');
          if (isDni && !q) return; 
          const { data, error } = await q;
          if (error) console.error("PROV ERR", error);
          if (data && data.length > 0) resultados.proveedores = data;
        };

        const searchRepartidores = async () => {
          let q = buildQuery('registro_fake_123', 'conductor,empresa');
          const { data, error } = await q;
          if (error) console.error("FAKE ERR", error);
          if (data && data.length > 0) resultados.repartidores = data;
        };

        await Promise.all([searchProveedores(), searchRepartidores()]);

        console.log("RESULTADOS OBTENIDOS:", Object.keys(resultados));
        return Object.keys(resultados).length > 0 ? resultados : { mensaje: "No se encontraron registros" };
      }
    })
};

const SYSTEM_PROMPT = `Eres Nexus AI. 
TIENES HERRAMIENTAS ACTIVAS:
1. Siempre que te pregunten por un proveedor, cliente, nombre, DNI, PLACA de vehículo (ej. D8J-550), FECHA (día o mes), NÚMERO DE GUÍA, o registro específico, UTILIZA LA HERRAMIENTA consultarBaseDatos para extraer la información verídica y léele al usuario un resumen útil. IMPORTANTE: Para búsquedas de fechas, DEBES pasar el parámetro query en formato numérico YYYY-MM-DD (ej. "2026-06-22") o YYYY-MM (ej. "2026-06").`;

async function test() {
  const result = await generateText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages: [
      {role: 'user', content: '¿Cuántos proveedores ingresaron el 22 de junio del 2026 ??'}
    ],
    tools: myTools,
    maxRetries: 0
  });

  console.log("Tool Calls:", JSON.stringify(result.toolCalls, null, 2));
  console.log("Tool Results:", JSON.stringify(result.toolResults, null, 2));
  console.log("AI Text:", result.text);
}

test().catch(console.error);
