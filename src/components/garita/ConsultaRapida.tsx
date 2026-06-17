'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown, Truck, Users, Package, HardHat, RefreshCw, Circle } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface PersonaItem {
  nombre: string;
  detalle: string;   // placa, empresa, DNI, etc.
  hora: string;
  activo: boolean;   // si aún no tiene hora_salida
}

interface Categoria {
  key: string;
  label: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  fetchFn: () => Promise<PersonaItem[]>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toHora(str?: string | null) {
  if (!str) return '--:--';
  return str.slice(0, 5);
}

// ─── Fetchers por categoría ───────────────────────────────────────────────────
async function fetchRepartidores(): Promise<PersonaItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('registro_repartidores')
    .select('conductor_nombre, empresa, placa, hora_llegada, hora_salida, fecha')
    .eq('fecha', today)
    .order('hora_llegada', { ascending: false })
    .limit(20);
  return (data || []).map((r) => ({
    nombre: r.conductor_nombre || '—',
    detalle: `${r.empresa || ''} · ${r.placa || ''}`.trim().replace(/^·\s*/, ''),
    hora: toHora(r.hora_llegada),
    activo: !r.hora_salida,
  }));
}

async function fetchVisitas(): Promise<PersonaItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('registro_visitas')
    .select('nombre_completo, empresa_procede, dni_ce, hora_ingreso, hora_salida, fecha')
    .eq('fecha', today)
    .order('hora_ingreso', { ascending: false })
    .limit(20);
  return (data || []).map((r) => ({
    nombre: r.nombre_completo || '—',
    detalle: r.empresa_procede || r.dni_ce || '—',
    hora: toHora(r.hora_ingreso),
    activo: !r.hora_salida,
  }));
}

async function fetchProveedores(): Promise<PersonaItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('registro_proveedores_carga')
    .select('conductor_nombre, empresa, placa, hora_llegada, hora_salida, fecha')
    .eq('fecha', today)
    .order('hora_llegada', { ascending: false })
    .limit(20);
  return (data || []).map((r) => ({
    nombre: r.conductor_nombre || '—',
    detalle: `${r.empresa || ''} · ${r.placa || ''}`.trim().replace(/^·\s*/, ''),
    hora: toHora(r.hora_llegada),
    activo: !r.hora_salida,
  }));
}

async function fetchContratistas(): Promise<PersonaItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('registro_contratistas')
    .select('empresa_contratista, trabajo_realizar, hora_ingreso, hora_salida, fecha_ingreso')
    .eq('fecha_ingreso', today)
    .order('hora_ingreso', { ascending: false })
    .limit(20);
  return (data || []).map((r) => ({
    nombre: r.empresa_contratista || '—',
    detalle: r.trabajo_realizar || '—',
    hora: toHora(r.hora_ingreso),
    activo: !r.hora_salida,
  }));
}

// ─── Definición de categorías ─────────────────────────────────────────────────
const CATEGORIAS: Categoria[] = [
  { key: 'repartidores', label: 'Repartidores',  Icon: Truck,    color: 'text-[#00d4ff]',  bg: 'bg-[#00d4ff]/10',  fetchFn: fetchRepartidores },
  { key: 'visitas',      label: 'Visitas',        Icon: Users,    color: 'text-purple-400', bg: 'bg-purple-500/10', fetchFn: fetchVisitas      },
  { key: 'proveedores',  label: 'Proveedores',    Icon: Package,  color: 'text-green-400',  bg: 'bg-green-500/10',  fetchFn: fetchProveedores  },
  { key: 'contratistas', label: 'Contratistas',   Icon: HardHat,  color: 'text-orange-400', bg: 'bg-orange-500/10', fetchFn: fetchContratistas },
];

// ─── Sub‑componente: una fila de persona ─────────────────────────────────────
function PersonaRow({ persona, color }: { persona: PersonaItem; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-black/5 dark:border-white/5 last:border-0">
      <Circle
        className={`w-2 h-2 shrink-0 ${persona.activo ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{persona.nombre}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{persona.detalle}</p>
      </div>
      <span className={`text-[10px] font-black shrink-0 ${persona.activo ? color : 'text-gray-400'}`}>
        {persona.hora}
      </span>
    </div>
  );
}

// ─── Sub‑componente: acordeón de una categoría ───────────────────────────────
function CategoriaAccordion({ cat }: { cat: Categoria }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PersonaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cat.fetchFn();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [cat]);

  // Carga al abrir y refresca cada 30s mientras está abierto
  useEffect(() => {
    if (!open) return;
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [open, load]);

  const activos = items.filter((i) => i.activo).length;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      {/* Cabecera del acordeón */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className={`w-8 h-8 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
          <cat.Icon className={`w-4 h-4 ${cat.color}`} strokeWidth={2.5} />
        </div>
        <span className="flex-1 text-left text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
          {cat.label}
        </span>
        {/* Badge de activos */}
        {activos > 0 && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            {activos} activo{activos !== 1 ? 's' : ''}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Contenido desplegable */}
      {open && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
              Registros de hoy · {items.length} total
            </p>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Actualizar"
            >
              <RefreshCw className={`w-3 h-3 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading && items.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-4">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-4 italic">Sin registros hoy.</p>
          ) : (
            <div>
              {items.map((p, idx) => (
                <PersonaRow key={idx} persona={p} color={cat.color} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal exportado ──────────────────────────────────────────
export function ConsultaRapida() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest flex items-center gap-2">
        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
        Consulta Rápida — Hoy
      </p>
      {CATEGORIAS.map((cat) => (
        <CategoriaAccordion key={cat.key} cat={cat} />
      ))}
    </div>
  );
}
