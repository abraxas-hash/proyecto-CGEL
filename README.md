
<div align="center">

# ⚡ CGEL CONTROL
### Plataforma de Inteligencia Operativa y Seguridad

*Un servicio de **CGEL SECURITY S.A.C.** — Seguridad de Alta Tecnología para Entornos Industriales*

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-RLS_Activo-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Desplegado-000000?style=for-the-badge&logo=vercel)

</div>

---

## 📋 Descripción del Servicio

**CGEL Control** es la plataforma digital de comando y auditoría operativa desarrollada exclusivamente por [CGEL Security S.A.C.](https://cgel.pe) para sus clientes. Diseñada para centros de distribución de alta complejidad logística, centraliza en tiempo real el control de accesos, la trazabilidad de personas y vehículos, y la documentación de evidencias fotográficas — convirtiendo la información dispersa de la garita en inteligencia procesable para la Gerencia de Operaciones y SSOMA.

> **Cliente actual:** Sonepar Perú S.A.C. — Centro de Distribución Jr. Yungay 1870, Urb. Chacra Ríos, Cercado de Lima.

---

## 🎯 Propuesta de Valor

| Problema Tradicional | Solución CGEL Control |
|---|---|
| Registros en papel, pérdida de información | Base de datos cifrada en la nube, disponible 24/7 |
| Sin evidencia fotográfica vinculada | Galería de evidencias SCTR/EPP por registro |
| Sin visibilidad del estado de planta | Dashboard en tiempo real: ¿quién está adentro? |
| Incumplimiento SUNAFIL por falta de trazabilidad | Auditoría completa y exportable para fiscalizaciones |
| Datos SCTR inaccesibles en el momento crítico | Verificación instantánea por conductor y placa |
| Demoras en reportes para la Gerencia | Métricas automáticas: alertas, gráficas, KPIs |

---

## 🛡️ Módulos Operativos

### 🚛 Repartidores Fijos
Control diario de ciclos de carga y distribución. Registra hasta 3 entradas/salidas por turno, con verificación de SCTR y EPP, placa y empresa transportista. Alerta en tiempo real si una unidad está en planta sin salida registrada.

### 👤 Visitas y Personal Externo
Gestión de pases de seguridad con DNI/CE, empresa referida, datos de contacto y hora de ingreso/salida. Historial de visitas previas por persona para detección de patrones.

### 📦 Proveedores de Carga
Control de ingreso de mercadería pesada. Auditoría de guías de remisión, SCTR de salud y pensión, verificación de EPP completo y registro de autorización de acceso a planta.

### 🔧 Contratistas
Inventario de herramientas y control de personal subcontratado. Detalla nombre, DNI, cargo, hora de entrada/salida y estado de cada trabajador. Detecta personal en planta sin salida.

### 📊 Dashboard de Inteligencia (SSOMA)
- Alerta roja animada cuando hay personas/vehículos en planta sin salida registrada
- Gráficas de distribución de tráfico por categoría
- Volumen de ingresos por ciclo semanal
- KPIs de Salud SCTR y Alertas Críticas
- Timeline en tiempo real de eventos de seguridad

### 📜 Políticas y Cumplimiento Legal
Sección documental que certifica el cumplimiento con:
- **Ley N° 29783** — Seguridad y Salud en el Trabajo
- **Ley N° 28879** — Servicios de Seguridad Privada
- **Ley N° 29733** — Protección de Datos Personales
- **Estándar BASC V6-2022** — Control de Accesos en CD

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────┐
│                  CGEL CONTROL                       │
│               (Next.js 16 + Turbopack)              │
│                                                     │
│  ┌──────────────┐       ┌──────────────────────┐   │
│  │  Auth Layer  │       │   Server Components   │   │
│  │  (Supabase)  │──────▶│   (SSR + ISR/10s)    │   │
│  └──────────────┘       └──────────┬───────────┘   │
│                                    │               │
│  ┌──────────────────────────────────▼─────────────┐ │
│  │              Base de Datos (Supabase)           │ │
│  │                                                │ │
│  │  RLS Activo en todas las tablas                │ │
│  │  RBAC: admin > supervisor > agente > sonepar   │ │
│  │                                                │ │
│  │  Tablas: repartidores | visitas | proveedores  │ │
│  │          contratistas | perfiles | directorio  │ │
│  │          sctr | evidencias_fotograficas        │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Stack Tecnológico
| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | Next.js 16 + Turbopack | SSR/ISR para datos en tiempo real sin carga en el cliente |
| **Estilos** | Tailwind CSS v4 | UI de alta densidad, tema oscuro operativo |
| **Gráficas** | Recharts | Visualización de métricas de seguridad |
| **Base de Datos** | Supabase (PostgreSQL) | RLS nativo, auth integrada, backups automáticos |
| **Seguridad** | RLS + RBAC | Acceso por roles, datos protegidos por políticas de servidor |
| **Despliegue** | Vercel | CI/CD automático por Git push, CDN global |

---

## 🔐 Arquitectura de Seguridad (RBAC + RLS)

El sistema implementa **Row Level Security** en Supabase para garantizar que ningún usuario pueda acceder a datos que no le corresponden, incluso si manipula el cliente.

### Jerarquía de Roles

```
admin
  └── Acceso total (lectura, escritura, edición)
supervisor
  └── Lectura total + edición de registros críticos
agente
  └── Lectura total + creación de nuevos registros
sonepar (cliente)
  └── Solo lectura en módulos operativos
  └── SIN ACCESO al directorio SCTR sensible
```

### Protecciones Activas
- ✅ Directorio SCTR visible **solo para personal CGEL** (privacidad de conductores)
- ✅ Inserción de registros **restringida a agentes autenticados**
- ✅ Modificación de histórico **bloqueada para rol Sonepar**
- ✅ Trigger automático de creación de perfil al registrar usuarios

---

## 🚀 Guía de Despliegue

### Pre-requisitos
- Node.js 20+
- Proyecto en [Supabase](https://supabase.com) con el schema CGEL aplicado
- Cuenta en [Vercel](https://vercel.com) vinculada a este repositorio

### Variables de Entorno
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` **nunca debe exponerse al cliente**. Solo se usa en Server Components y nunca se prefija con `NEXT_PUBLIC_`.

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/abraxas-hash/proyecto-CGEL.git
cd proyecto-CGEL

# Instalar dependencias
npm install

# Iniciar entorno de desarrollo
npm run dev
```

### Despliegue Continuo (Vercel)
```bash
# Cada push a master activa un redeploy automático en Vercel
git add .
git commit -m "feat: descripción del cambio"
git push origin master
```

### Hardening de Base de Datos
Ejecutar el script de seguridad en el **SQL Editor de Supabase**:
```sql
-- Ver: security_hardening.sql en la raíz del repositorio
-- Activa RLS, crea roles RBAC y configura triggers de perfiles
```

---

## 📁 Estructura del Proyecto

```
cgel-portal/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Dashboard principal (Server Component)
│   │   ├── login/                 # Autenticación (Kira-style split screen)
│   │   ├── repartidores/          # Módulo de control de rutas
│   │   │   └── [id]/              # Ficha de auditoría individual
│   │   ├── visitas/               # Módulo de pases de seguridad
│   │   │   └── [id]/
│   │   ├── proveedores/           # Módulo de carga y despacho
│   │   │   └── [id]/
│   │   ├── contratistas/          # Módulo de personal externo
│   │   │   └── [id]/
│   │   └── politicas/             # Políticas de seguridad y privacidad
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx         # Navegación principal con estado activo
│   │   ├── dashboard/
│   │   │   ├── SafeAnalytics.tsx  # Wrapper SSR-safe para gráficas
│   │   │   ├── AnalyticsSection.tsx # KPIs y gráficas (Recharts)
│   │   │   └── SafetyObservations.tsx # Panel de alertas SSOMA
│   │   └── ui/
│   │       └── MetricCard.tsx     # Tarjeta de métrica reutilizable
│   └── lib/
│       └── supabaseClient.ts      # Admin client + anon client
├── security_hardening.sql         # Script de RLS y RBAC para Supabase
├── DOCUMENTACION_SEGURIDAD.md     # Documentación técnica de seguridad
└── Informe_Tecnico_001_2026_CGEL_SONEPAR.md  # Informe oficial de auditoría
```

---

## 📊 Capacidades de Reporte

| Funcionalidad | Estado |
|---|---|
| Dashboard en tiempo real (ISR 10s) | ✅ Activo |
| Alerta de personas en planta sin salida | ✅ Activo |
| Galería de evidencias fotográficas por registro | ✅ Activo |
| Historial de visitas por persona (DNI) | ✅ Activo |
| Historial de ingresos por conductor | ✅ Activo |
| Verificación SCTR y EPP | ✅ Activo |
| Inventario de herramientas por contratista | ✅ Activo |
| KPIs operativos (area chart, radial chart) | ✅ Activo |
| Timeline de eventos críticos SSOMA | ✅ Activo |
| Exportación de datos | 🔄 En desarrollo |
| Integración de imágenes desde Telegram/Bot | 🔄 Planificado |
| Notificaciones push (alertas de seguridad) | 🔄 Planificado |

---

## 👥 Equipo y Contacto

| Rol | Responsable |
|---|---|
| **Gerencia de Operaciones CGEL** | Coronel PNP (r) César Espinoza Azula |
| **Gerencia General CGEL** | General (r) Carlos Enrique Vallejos Passano |
| **Desarrollo e Integración Digital** | Antigravity AI — Powered by Google DeepMind |

---

## 📄 Licencia y Confidencialidad

**SISTEMA PROPIETARIO — CONFIDENCIAL**

Este software, su arquitectura y su base de datos son propiedad exclusiva de **CGEL Security S.A.C.** Está licenciado para uso exclusivo del cliente **Sonepar Perú S.A.C.** bajo los términos del contrato de servicios de seguridad vigente.

Queda estrictamente prohibida la reproducción, distribución o modificación del presente sistema sin autorización expresa y escrita de CGEL Security S.A.C.

---

<div align="center">

**© 2026 CGEL Security S.A.C. — Todos los derechos reservados**

*Protegido por la Ley N° 29733 de Protección de Datos Personales del Perú*

</div>
