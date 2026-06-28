import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabaseClient'

export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SYSTEM_PROMPT = `Eres Nexus AI, el asistente operativo inteligente del sistema Nexus Control.
Tu única función es asistir al personal respondiendo dudas sobre cómo usar el sistema, buscar información en la base de datos de garita y analizar el dashboard operativo.
Eres altamente profesional, conciso y hablas siempre en español.

El sistema Nexus Control tiene las siguientes secciones:
- Dashboard: Métricas en tiempo real de personal en planta, alertas de tiempo excedido, embudo operativo y línea de tiempo SSOMA.
- Panel Garita: Módulos para registrar Repartidores (entrada/salida de camiones), Visitas (pases temporales con foto DNI), Proveedores (validación SCTR y guías de remisión), Contratistas (inventario herramientas y personal) y Ocurrencias (cuaderno virtual inmutable).
- Políticas: Cifrado de datos, roles jerárquicos (Admin, Gerente, Supervisor SSOMA, Vigilante) y matriz de responsabilidades.

TIENES HERRAMIENTAS ACTIVAS:
1. Siempre que te pregunten por un proveedor, cliente, nombre, DNI, PLACA de vehículo (ej. D8J-550), FECHA (CUALQUIER fecha, pasada o presente, ej. 22 de junio), NÚMERO DE GUÍA, o registro específico, UTILIZA LA HERRAMIENTA consultarBaseDatos para extraer la información.
2. Si te preguntan "cómo vamos hoy", "cuál es el estado", o sobre las métricas del dashboard, UTILIZA LA HERRAMIENTA leerMetricasDashboard.

REGLA CRÍTICA 1: Si el usuario pregunta sobre temas no relacionados al sistema (programación, historia, chistes, deportes, etc.), DEBES negarte cortésmente.
REGLA CRÍTICA 2: NUNCA asumas que no tienes información de fechas pasadas. Tienes acceso a toda la base de datos histórica. NUNCA digas que no puedes buscar en el pasado. SIEMPRE usa consultarBaseDatos.
REGLA CRÍTICA 3: NUNCA asumas que no tienes información sin antes usar la herramienta consultarBaseDatos. SIEMPRE debes usar la herramienta para CADA nueva placa, DNI, nombre, guía o fecha que el usuario pida, sin importar si fallaste en búsquedas anteriores.`;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() { },
        },
      }
    )

    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Acceso Denegado. Sesión no válida.' }, { status: 401 })
    }

    const supabaseDb = createAdminClient()

    const { messages } = await req.json();

    const dbParams = z.object({
      query: z.string().describe('Término de búsqueda exacto, por ejemplo "22 de junio", "D8J-550", "Juan".')
    });

    const metricasParams = z.object({});

    const myTools = {
        consultarBaseDatos: tool({
          description: 'Busca el historial en la base de datos de Visitas, Proveedores y Repartidores.',
          parameters: dbParams,
          // @ts-ignore
          execute: async (args: any) => {
            console.log(`[Nexus AI] Tool args:`, JSON.stringify(args));
            const lastMessage = messages[messages.length - 1]?.content || '';
            let rawQuery = String(args.query || '').trim();
            if (!rawQuery) rawQuery = lastMessage.trim();
            const combinedInput = rawQuery;
            
            let parsedDate = null;
            const ymdMatch = combinedInput.match(/\b(\d{4}-\d{2}-\d{2})\b/);
            const ymMatch = combinedInput.match(/\b(\d{4}-\d{2})\b/);
            
            if (ymdMatch) parsedDate = ymdMatch[1];
            else {
              const esMatch = combinedInput.toLowerCase().match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(?:de|del)\s+(\d{4}))?/);
              if (esMatch) {
                const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                const day = esMatch[1].padStart(2, '0');
                const month = (months.indexOf(esMatch[2]) + 1).toString().padStart(2, '0');
                const year = esMatch[3] || new Date().getFullYear().toString();
                parsedDate = `${year}-${month}-${day}`;
              } else if (ymMatch) {
                parsedDate = ymMatch[1]; // just YYYY-MM
              }
            }
            
            const query = parsedDate ? parsedDate : rawQuery;
            console.log(`[Nexus AI] Buscando en BD: raw='${combinedInput}', parsed='${query}'`);
            
            if (!query) {
               return { error: "DEBES proveer un término de búsqueda en el parámetro query." };
            }
            
            let resultados: any = {};
            const isDni = /^\d+$/.test(query) && query.length >= 8;
            const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(query);
            const isMonthDate = /^\d{4}-\d{2}$/.test(query) && !isFullDate;

            const buildQuery = (table: string, textSearchFields: string) => {
              let q = supabaseDb.from(table).select('*').order('fecha', { ascending: false }).limit(30);
              if (isDni) {
                q = q.eq('dni', query);
              } else if (isFullDate) {
                q = q.eq('fecha', query);
              } else if (isMonthDate) {
                q = q.gte('fecha', `${query}-01`).lte('fecha', `${query}-31`);
              } else {
                q = q.or(textSearchFields.split(',').map(f => `${f}.ilike.%${query}%`).join(','));
              }
              return q;
            };

            const searchVisitas = async () => {
              let q = buildQuery('registro_visitas', 'nombre,empresa,motivo,dni');
              const { data, error } = await q;
              if (error) console.error("[DB ERROR] Visitas:", error);
              if (data && data.length > 0) resultados.visitas = data.map((d:any) => ({ fecha: d.fecha, hora: d.hora_ingreso, nombre: d.nombre, dni: d.dni, empresa: d.empresa, motivo: d.motivo }));
            };

            const searchProveedores = async () => {
              let q = buildQuery('registro_proveedores_carga', 'conductor_nombre,empresa,placa,tipo_carga');
              const { data, error } = await q;
              if (error) console.error("[DB ERROR] Proveedores:", error);
              console.log(`[Nexus AI] Proveedores encontrados para ${query}:`, data ? data.length : 0);
              if (data && data.length > 0) resultados.proveedores = data.map((d:any) => ({ fecha: d.fecha, hora: d.hora_llegada, empresa: d.empresa, conductor: d.conductor_nombre, placa: d.placa, carga: d.tipo_carga }));
            };

            const searchRepartidores = async () => {
              let q = buildQuery('registro_diario_repartidores', 'nombre_conductor,empresa_transporte,placa');
              const { data, error } = await q;
              if (error) console.error("[DB ERROR] Repartidores:", error);
              if (data && data.length > 0) resultados.repartidores = data.map((d:any) => ({ fecha: d.fecha, hora: d.hora_llegada, conductor: d.nombre_conductor, empresa: d.empresa_transporte, placa: d.placa }));
            };

            await Promise.all([searchVisitas(), searchProveedores(), searchRepartidores()]);

            return Object.keys(resultados).length > 0 
              ? resultados 
              : { mensaje: "No se encontraron registros en la base de datos para el término: " + (query) };
          }
        }),
        leerMetricasDashboard: tool({
          description: 'Obtiene las métricas actuales del dashboard (cantidad de visitas, proveedores y repartidores ingresados en el día actual)',
          parameters: metricasParams,
          // @ts-ignore - Bypass Vercel AI SDK strict generic inference bug
          execute: async (args: any) => {
            console.log(`[Nexus AI] Leyendo métricas del dashboard`);
            const hoy = new Date().toISOString().split('T')[0];
            const [visitas, proveedores, repartidores] = await Promise.all([
              supabaseDb.from('registro_visitas').select('*', { count: 'exact', head: true }).gte('fecha', hoy),
              supabaseDb.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }).gte('fecha', hoy),
              supabaseDb.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }).gte('fecha', hoy)
            ]);
            return {
              fecha_consulta: hoy,
              visitas_hoy: visitas.count || 0,
              proveedores_hoy: proveedores.count || 0,
              repartidores_hoy: repartidores.count || 0,
              total_accesos_hoy: (visitas.count || 0) + (proveedores.count || 0) + (repartidores.count || 0)
            };
          }
        })
    };

    // Limpiamos los mensajes entrantes para evitar problemas de esquema (quitamos id, etc)
    let currentMessages = messages.map((m: any) => ({
      role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
      content: m.content || ''
    }));
    
    let finalContent = "";

    // Bucle manual para soportar múltiples pasos sin usar el esquema estricto de herramientas
    for (let i = 0; i < 4; i++) {
      const result = await generateText({
        model: google('gemini-flash-latest', {
          useSearchGrounding: true,
        }),
        system: SYSTEM_PROMPT,
        messages: currentMessages as any,
        tools: myTools,
        maxRetries: 0
      });

      if (result.toolCalls && result.toolCalls.length > 0) {
        // En lugar de usar el esquema estricto de 'tool-call' y 'tool-result', 
        // simplemente inyectamos los resultados como un mensaje de sistema/usuario en texto plano.
        // ¡Esto es a prueba de fallos contra cualquier versión del SDK!
        
        currentMessages.push({
          role: 'assistant',
          content: result.text || `Buscando información en la base de datos...`
        });

        const rawResults = result.toolResults.map((tr: any) => tr.result);
        currentMessages.push({
          role: 'user',
          content: `[SISTEMA INTERNO]: La herramienta de base de datos devolvió la siguiente información:\n\n${JSON.stringify(rawResults, null, 2)}\n\nPor favor, lee estos datos y responde a mi pregunta anterior de forma natural y conversacional.`
        });
      } else {
        finalContent = result.text;
        break;
      }
    }

    if (!finalContent || finalContent.trim() === '') {
      finalContent = "He analizado la información pero hubo un error al generar la respuesta de texto.";
    }

    return NextResponse.json({ role: 'assistant', content: finalContent });
  } catch (error: any) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
