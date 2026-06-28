import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * Cliente estándar para uso general en el browser (Respeta RLS).
 * Usa valores placeholder en build-time para evitar errores de importación.
 * Los valores reales se leen desde las variables de entorno en runtime.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
)

/**
 * Cliente con privilegios de administrador (Bypasa RLS).
 * IMPORTANTE: Solo debe usarse en Server Components o API Routes (nunca en el browser).
 * Lee las variables en tiempo de ejecución para mayor seguridad.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase.\n' +
      'Configure NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en:\n' +
      'Vercel → Project → Settings → Environment Variables'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
