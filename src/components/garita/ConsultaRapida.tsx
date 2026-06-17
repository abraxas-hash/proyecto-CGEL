'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown, Truck, Users, Package, HardHat, Circle } from 'lucide-react';

interface PersonaItem {
  nombre: string;
  detalle: string;
  hora: string;
  activo: boolean;
}

function toHora(str?: string | null) {
  if (!str) return '--:--';
  return str.slice(0, 5);
}

const today = new Date().toISOString().split('T')[0];

async function fetchData(categoria: string): Promise<PersonaItem[]> {
  if (categoria === 'repartidores') {
    const { data } = await supabase
      .from('registro_repartidores')
      .select('conductor_nombre, empresa, placa, hora_llegada, hora_salida')
      .eq('fecha', today)
      .order('hora_llegada', { ascending: false })
      .limit(20);
    return (data || []).map(r => ({
      nombre: r.conductor_nombre || '—',
      detalle: [r.empresa, r.placa].filter(Boolean).join(' · '),
      hora: toHora(r.hora_llegada),
      activo: !r.hora_salida,
    }));
  }
  if (categoria === 'visitas') {
    const { data } = await supabase
      .from('registro_visitas')
      .select('nombre_completo, empresa_procede, hora_ingreso, hora_salida')
      .eq('fecha', today)
      .order('hora_ingreso', { ascending: false })
      .limit(20);
    return (data || []).map(r => ({
      nombre: r.nombre_completo || '—',
      detalle: r.empresa_procede || '—',
      hora: toHora(r.hora_ingreso),
      activo: !r.hora_salida,
    }));
  }
  if (categoria === 'proveedores') {
    const { data } = await supabase
      .from('registro_proveedores_carga')
      .select('conductor_nombre, empresa, placa, hora_llegada, hora_salida')
      .eq('fecha', today)
      .order('hora_llegada', { ascending: false })
      .limit(20);
    return (data || []).map(r => ({
      nombre: r.conductor_nombre || '—',
      detalle: [r.empresa, r.placa].filter(Boolean).join(' · '),
      hora: toHora(r.hora_llegada),
      activo: !r.hora_salida,
    }));
  }
  if (categoria === 'contratistas') {
    const { data } = await supabase
      .from('registro_contratistas')
      .select('empresa_contratista, trabajo_realizar, hora_ingreso, hora_salida')
      .eq('fecha_ingreso', today)
      .order('hora_ingreso', { ascending: false })
      .limit(20);
    return (data || []).map(r => ({
      nombre: r.empresa_contratista || '—',
      detalle: r.trabajo_realizar || '—',
      hora: toHora(r.hora_ingreso),
      activo: !r.hora_salida,
    }));
  }
  return [];
}

const CATS = [
  { key: 'repartidores', label: 'Repartidores', Icon: Truck,    color: 'text-[#00d4ff]',  bg: 'bg-[#00d4ff]/10'  },
  { key: 'visitas',      label: 'Visitas',       Icon: Users,    color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { key: 'proveedores',  label: 'Proveedores',   Icon: Package,  color: 'text-green-400',  bg: 'bg-green-500/10'  },
  { key: 'contratistas', label: 'Contratistas',  Icon: HardHat,  color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

function Acordeon({ cat }: { cat: typeof CATS[0] }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PersonaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    if (loading) return;
    setLoading(true);
    const data = await fetchData(cat.key);
    setItems(data);
    setLoading(false);
    setLoaded(true);
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) load();
  }

  const activos = items.filter(i => i.activo).length;

  return (
    <div className="glass-panel rounded-2xl">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center gap-3 p-4"
      >
        <div className={`w-8 h-8 rounded-xl ${cat.bg} flex items-center justify-center`}>
          <cat.Icon className={`w-4 h-4 ${cat.color}`} strokeWidth={2.5} />
        </div>
        <span className="flex-1 text-left text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
          {cat.label}
        </span>
        {activos > 0 && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.bg} ${cat.color} mr-1`}>
            {activos} ✓
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-black/5 dark:border-white/5">
          {loading ? (
            <p className="text-[11px] text-slate-400 text-center py-3">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-3 italic">Sin registros hoy.</p>
          ) : (
            <div className="pt-2 space-y-1">
              {items.map((p, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <Circle className={`w-2 h-2 shrink-0 ${p.activo ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.nombre}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.detalle}</p>
                  </div>
                  <span className={`text-[10px] font-black shrink-0 ${p.activo ? cat.color : 'text-gray-400'}`}>{p.hora}</span>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={load}
            className="mt-3 w-full text-[10px] text-slate-400 uppercase tracking-widest font-black py-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            ↻ Actualizar
          </button>
        </div>
      )}
    </div>
  );
}

export function ConsultaRapida() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest px-1">
        🔍 Consulta Rápida — Hoy
      </p>
      {CATS.map(cat => <Acordeon key={cat.key} cat={cat} />)}
    </div>
  );
}
