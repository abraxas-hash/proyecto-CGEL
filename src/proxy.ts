import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Guard: si las variables de entorno no están disponibles (Edge Runtime),
    // dejar pasar la request sin romper el proxy.
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Proxy] Variables de Supabase no encontradas. Dejando pasar la request.')
      return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const isLoginPage = pathname === '/login'

    // Si no hay usuario y no estamos en login → redirigir a login
    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Protección de rutas de administración (RBAC)
    if (user && pathname !== '/') {
      const { data: profile } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single()
        
      let role = profile?.rol || 'agente';
      if (user.email === 'ssoma@cgel.com') role = 'ssoma';
      if (user.email === 'gerencia@cgel.com') role = 'gerencia';
      if (user.email === 'garita@cgel.com') role = 'garita';
      
      // Restricciones para Garita
      if (role === 'garita') {
        if (pathname.startsWith('/admin') || pathname.startsWith('/analitica')) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
      }
      
      // Restricciones para SSOMA
      if (role === 'ssoma') {
        const operationalRoutes = ['/repartidores', '/visitas', '/proveedores', '/gas']
        if (operationalRoutes.some(route => pathname.startsWith(route))) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
      }
    }

    // Si está logueado e intenta ir a login, simplemente dejar pasar.
    // El login page maneja su propia redirección post-login.
    // NO redirigir aquí para evitar el bucle al hacer logout.

    return supabaseResponse
  } catch (error) {
    console.error('[Proxy Error]', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest\\.json|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|js)$).*)'],
}
