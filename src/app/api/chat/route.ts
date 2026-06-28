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
1. Siempre que te pregunten por un proveedor, visitante, repartidor, nombre, DNI, PLACA de vehículo, FECHA (cualquier fecha pasada o presente), NÚMERO DE GUÍA, o cualquier registro específico — DEBES llamar a consultarBaseDatos ANTES de responder.
2. Si te preguntan sobre métricas del día ("cómo vamos hoy", "estado del día", etc.) — DEBES llamar a leerMetricasDashboard.

REGLA CRÍTICA 1: NUNCA respondas preguntas de datos sin haber llamado primero a la herramienta correspondiente.
REGLA CRÍTICA 2: NUNCA digas "no encontré registros" si el resultado de la herramienta contiene datos. Lee el JSON cuidadosamente.
REGLA CRÍTICA 3: Cuando la herramienta retorne datos, SIEMPRE presenta esa información al usuario de forma clara y organizada.
REGLA CRÍTICA 4: Si el usuario pregunta sobre temas no relacionados al sistema, DEBES negarte cortésmente.`;

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

    // ─── HERRAMIENTA 1: Consultar Base de Datos ───────────────────────────────
    const consultarBaseDatos = tool({
      description: 'Consulta la base de datos de Nexus Control para buscar registros de Visitas, Proveedores de carga y Repartidores. Úsala para cualquier búsqueda por fecha, nombre, DNI, placa o empresa.',
      parameters: z.object({
        query: z.string().describe('El término de búsqueda. Puede ser una fecha en español ("22 de junio"), una fecha ISO ("2026-06-22"), un DNI, una placa, un nombre o una empresa.'),
      }),
      execute: async ({ query: rawQuery }) => {
        console.log(`[Nexus AI] consultarBaseDatos llamada con query: "${rawQuery}"`);
        
        // Parsear fecha en español → formato ISO YYYY-MM-DD
        let parsedDate: string | null = null;
        const ymdMatch = rawQuery.match(/\b(\d{4}-\d{2}-\d{2})\b/);
        const esMatch = rawQuery.toLowerCase().match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(?:de|del)?\s*(\d{4}))?/);
        const ymMatch = rawQuery.match(/\b(\d{4}-\d{2})\b/);

        if (ymdMatch) {
          parsedDate = ymdMatch[1];
        } else if (esMatch) {
          const months: Record<string, string> = { enero:'01',febrero:'02',marzo:'03',abril:'04',mayo:'05',junio:'06',julio:'07',agosto:'08',septiembre:'09',octubre:'10',noviembre:'11',diciembre:'12' };
          const day = esMatch[1].padStart(2, '0');
          const month = months[esMatch[2]];
          const year = esMatch[3] || new Date().getFullYear().toString();
          parsedDate = `${year}-${month}-${day}`;
        } else if (ymMatch) {
          parsedDate = ymMatch[1];
        }

        const searchTerm = parsedDate || rawQuery.trim();
        console.log(`[Nexus AI] Término de búsqueda final: "${searchTerm}" (fecha parseada: ${parsedDate})`);

        const isDni = /^\d{8,}$/.test(searchTerm);
        const isFullDate = /^\d{4}-\d{2}-\d{2}$/.test(searchTerm);
        const isMonthDate = /^\d{4}-\d{2}$/.test(searchTerm) && !isFullDate;

        const applyFilter = (q: any, textFields: string[]) => {
          if (isDni) return q.eq('dni', searchTerm);
          if (isFullDate) return q.eq('fecha', searchTerm);
          if (isMonthDate) return q.gte('fecha', `${searchTerm}-01`).lte('fecha', `${searchTerm}-31`);
          return q.or(textFields.map(f => `${f}.ilike.%${searchTerm}%`).join(','));
        };

        const results: any = {};

        // Buscar en VISITAS
        const visitasQ = applyFilter(
          supabaseDb.from('registro_visitas').select('fecha,hora_ingreso,hora_salida,nombre,dni,empresa,motivo').order('fecha', { ascending: false }).limit(30),
          ['nombre', 'empresa', 'motivo', 'dni']
        );
        const { data: visitasData, error: visitasError } = await visitasQ;
        if (visitasError) console.error('[DB ERROR] Visitas:', visitasError.message);
        if (visitasData && visitasData.length > 0) {
          results.visitas = visitasData;
          console.log(`[Nexus AI] Visitas encontradas: ${visitasData.length}`);
        }

        // Buscar en PROVEEDORES
        const proveedoresQ = applyFilter(
          supabaseDb.from('registro_proveedores_carga').select('fecha,hora_llegada,hora_salida,empresa,conductor_nombre,placa,tipo_carga').order('fecha', { ascending: false }).limit(30),
          ['conductor_nombre', 'empresa', 'placa', 'tipo_carga']
        );
        const { data: proveedoresData, error: proveedoresError } = await proveedoresQ;
        if (proveedoresError) console.error('[DB ERROR] Proveedores:', proveedoresError.message);
        if (proveedoresData && proveedoresData.length > 0) {
          results.proveedores = proveedoresData;
          console.log(`[Nexus AI] Proveedores encontrados: ${proveedoresData.length}`);
        }

        // Buscar en REPARTIDORES
        const repartidoresQ = applyFilter(
          supabaseDb.from('registro_diario_repartidores').select('fecha,hora_llegada,hora_salida,nombre_conductor,empresa_transporte,placa').order('fecha', { ascending: false }).limit(30),
          ['nombre_conductor', 'empresa_transporte', 'placa']
        );
        const { data: repartidoresData, error: repartidoresError } = await repartidoresQ;
        if (repartidoresError) console.error('[DB ERROR] Repartidores:', repartidoresError.message);
        if (repartidoresData && repartidoresData.length > 0) {
          results.repartidores = repartidoresData;
          console.log(`[Nexus AI] Repartidores encontrados: ${repartidoresData.length}`);
        }

        if (Object.keys(results).length === 0) {
          return { encontrado: false, termino_buscado: searchTerm, mensaje: `No se encontraron registros para: "${searchTerm}"` };
        }

        return { encontrado: true, termino_buscado: searchTerm, resultados: results };
      }
    });

    // ─── HERRAMIENTA 2: Métricas del Dashboard ────────────────────────────────
    const leerMetricasDashboard = tool({
      description: 'Obtiene las métricas del día actual: total de visitas, proveedores y repartidores registrados hoy.',
      parameters: z.object({}),
      execute: async () => {
        const hoy = new Date().toISOString().split('T')[0];
        console.log(`[Nexus AI] leerMetricasDashboard para fecha: ${hoy}`);
        const [visitas, proveedores, repartidores] = await Promise.all([
          supabaseDb.from('registro_visitas').select('*', { count: 'exact', head: true }).gte('fecha', hoy),
          supabaseDb.from('registro_proveedores_carga').select('*', { count: 'exact', head: true }).gte('fecha', hoy),
          supabaseDb.from('registro_diario_repartidores').select('*', { count: 'exact', head: true }).gte('fecha', hoy)
        ]);
        return {
          fecha: hoy,
          visitas_hoy: visitas.count ?? 0,
          proveedores_hoy: proveedores.count ?? 0,
          repartidores_hoy: repartidores.count ?? 0,
          total: (visitas.count ?? 0) + (proveedores.count ?? 0) + (repartidores.count ?? 0)
        };
      }
    });

    // ─── GENERAR RESPUESTA con soporte nativo multi-step ─────────────────────
    // maxSteps=3: paso 1 = el modelo decide llamar tool, paso 2 = ejecuta tool y recibe resultado, paso 3 = genera respuesta final
    const cleanMessages = messages.map((m: any) => ({
      role: (m.role === 'user' || m.role === 'assistant') ? m.role : 'user',
      content: String(m.content || '')
    }));

    const result = await generateText({
      model: google('gemini-2.0-flash'),
      system: SYSTEM_PROMPT,
      messages: cleanMessages,
      tools: { consultarBaseDatos, leerMetricasDashboard },
      maxSteps: 3,
      toolChoice: 'auto',
      maxRetries: 1,
    });

    console.log(`[Nexus AI] Steps ejecutados: ${result.steps?.length ?? 0}`);
    console.log(`[Nexus AI] Texto final: ${result.text?.substring(0, 100)}...`);

    const finalContent = result.text?.trim() || 'Hubo un problema al procesar la respuesta. Por favor intenta de nuevo.';
    return NextResponse.json({ role: 'assistant', content: finalContent });

  } catch (error: any) {
    console.error('[Chat API] Error crítico:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
