# Memoria del Proyecto (Contexto para Agentes de IA)

**Proyecto:** Nexus Control (CGEL Portal)
**Descripción:** Plataforma de Inteligencia Operativa y Seguridad.

## Stack Tecnológico
- **Framework:** Next.js (App Router, Turbopack).
- **Estilos:** Tailwind CSS (con soporte para Dark Mode manual).
- **Base de Datos:** Supabase (PostgREST).
- **Iconografía:** Lucide React.
- **Interfaz (UI):** Basada en tarjetas estilo Neumorfismo / Glassmorphism ("glass-panel").

---

## Últimas Modificaciones (Estado Actual)

### 1. Soporte PWA (Progressive Web App)
- La aplicación ahora es instalable nativamente en móviles y escritorio.
- **Archivos creados:** `public/manifest.json` y `public/sw.js`.
- **Íconos:** Se generaron versiones perfectamente cuadradas (`icon-192x192.png` y `icon-512x512.png`) con propiedad `"purpose": "any maskable"` para cumplir las normativas estrictas de Chrome/Android.
- **Registro:** Se inyectó el componente cliente `PwaRegister.tsx` en el `src/app/layout.tsx` y se exportó la metadata de Apple y manifest.

### 2. Desactivación de Caché Global (Bypass de Vercel)
- **Problema:** El Edge CDN de Vercel y el Next.js Router cacheaban agresivamente las páginas, impidiendo ver actualizaciones.
- **Solución:** Se inyectaron las directivas `export const dynamic = 'force-dynamic';` y `export const fetchCache = 'force-no-store';` en la raíz `src/app/layout.tsx` para obligar al servidor a renderizar en tiempo real en cada solicitud.

### 3. Módulo de Garita (Ocurrencias)
- **Corrección de DB:** Se reparó un error 400 (Bad Request) de Supabase en `src/app/garita/ocurrencias/page.tsx` removiendo un `JOIN` inexistente hacia la tabla `perfiles`.
- **Nueva Funcionalidad:** Se agregó una sección de "Línea de Tiempo" (Historial) debajo del formulario para mostrar dinámicamente las últimas 5 ocurrencias registradas.

### 4. Correcciones de Diseño Responsivo (Mobile)
- **Problema:** Los textos y botones de las cabeceras se apilaban o deformaban en pantallas móviles.
- **Solución:** Se reestructuraron las cabeceras (`CardHeader`) usando utilidades flexbox (`flex-col sm:flex-row`) en los widgets del Dashboard: `LiveEventsFeed`, `EmotionManagementWidget`, `OperationalFunnel` y `ComunicadosWidget`.

### 5. Ajustes Visuales (Sombra de Neón)
- **Mejora:** Se aumentó significativamente la intensidad de la luz (glow) emitida por las tarjetas de métricas (`MetricCard.tsx`).
- **Valores:** Se ajustó el alpha de `rgba` a `0.4` y el radio de difuminado a `20px` para destacar el efecto neumórfico tanto en el modo claro como oscuro.

---

## Próximos Pasos
*El agente que lea este documento puede proceder con nuevas implementaciones teniendo en cuenta que el proyecto actualmente prioriza el diseño Glassmorphism, que la caché está desactivada intencionalmente por desarrollo, y que la plataforma ya funciona como una PWA.*
