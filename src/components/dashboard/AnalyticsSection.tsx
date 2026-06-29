'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadialBarChart, RadialBar, Cell, Legend, PolarGrid,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, AlertTriangle, Users, Activity, 
  ArrowUpRight, Clock, Zap
} from 'lucide-react';
import { InfographicChart } from './InfographicChart';

// Colores del sistema Nexus (Paleta Shadboard)
const COLORS = {
  blue: '#00d4ff',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444',
  yellow: '#eab308',
  gray: '#64748b'
};

/**
 * Sección de Inteligencia Operativa Nexus
 * Inspirada en Shadboard (Qualiora)
 */
export default function AnalyticsSection({ data }: { data: any }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  // Procesar datos para la gráfica radial
  const radialData = [
    { category: 'repartidores', value: data.counts.repartidores, fill: "var(--color-repartidores)" },
    { category: 'visitas', value: data.counts.visitas, fill: "var(--color-visitas)" },
    { category: 'proveedores', value: data.counts.proveedores, fill: "var(--color-proveedores)" },
    { category: 'contratistas', value: data.counts.contratistas, fill: "var(--color-contratistas)" },
  ].sort((a, b) => b.value - a.value);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      

      {/* 2. ANALYTICS CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica de Tendencia (Area Smooth) */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 shadow-lg relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between z-10 relative p-4 pb-2">
            <div>
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Performance Operativo
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 mt-0.5">Volumen de ingresos por ciclo</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[140px] mt-2 z-10 relative p-0 sm:p-4 sm:pt-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
              <AreaChart data={data.weekly} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={9} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={5}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(34, 211, 238, 0.2)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '8px', padding: '6px' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '900', color: '#22d3ee' }}
                  labelStyle={{ color: '#cbd5e1', marginBottom: '4px', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 4, fill: '#0f172a', stroke: '#22d3ee', strokeWidth: 2, filter: 'url(#glow)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución Radial (Concéntrica) -> Convertida a Donut interactivo */}
        <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 shadow-lg flex flex-col justify-center relative overflow-hidden group">
          <CardHeader className="p-4 pb-0 z-10 relative">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-white">Mix de Seguridad</CardTitle>
            <CardDescription className="text-[10px] text-slate-400 mt-0.5">Distribución por categoría</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-row items-center justify-center z-10 relative gap-4">
            <div className="h-[120px] w-1/2">
              <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
                <RadialBarChart 
                  data={[
                    { name: 'Repartidores', value: data.counts.repartidores || 1, fill: COLORS.blue },
                    { name: 'Visitas', value: data.counts.visitas || 1, fill: COLORS.purple },
                    { name: 'Proveedores', value: data.counts.proveedores || 1, fill: COLORS.green },
                    { name: 'Contratistas', value: data.counts.contratistas || 1, fill: COLORS.orange },
                  ]} 
                  innerRadius="30%" 
                  outerRadius="100%" 
                  barSize={8} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.02)" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '6px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <RadialBar 
                    background={{ fill: 'rgba(255,255,255,0.02)' }} 
                    dataKey="value" 
                    cornerRadius={10} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend Horizontal */}
            <div className="grid grid-cols-1 gap-y-2 w-1/2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"></div><span className="text-[9px] text-slate-400 font-bold uppercase">Rep</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.repartidores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></div><span className="text-[9px] text-slate-400 font-bold uppercase">Vis</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.visitas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div><span className="text-[9px] text-slate-400 font-bold uppercase">Pro</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.proveedores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div><span className="text-[9px] text-slate-400 font-bold uppercase">Con</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.contratistas}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. SCATTER PLOT & INFOGRAPHIC (2 Columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Mapa de Calor */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 shadow-lg relative overflow-hidden group">
        <CardHeader className="flex flex-row items-center justify-between z-10 relative p-4 pb-2">
          <div>
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#f97316]" />
              Mapa de Calor Operativo
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-400 mt-0.5">Densidad por franja horaria</CardDescription>
          </div>
          <div className="hidden sm:flex gap-3">
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div> Rep
             </div>
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> Vis
             </div>
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div> Pro
             </div>
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div> Con
             </div>
          </div>
        </CardHeader>
        <CardContent className="h-[250px] mt-2 relative z-10 p-0 sm:p-4 sm:pt-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <defs>
                <filter id="glow-scatter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <XAxis 
                type="number" 
                dataKey="hour" 
                name="Hora" 
                unit=":00" 
                domain={[0, 24]} 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="bold"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey="index" 
                name="Categoría" 
                domain={[0, 5]} 
                ticks={[1, 2, 3, 4]}
                tickFormatter={(val) => {
                  if (val === 1) return 'REP';
                  if (val === 2) return 'VIS';
                  if (val === 3) return 'PRO';
                  if (val === 4) return 'CON';
                  return '';
                }}
                stroke="#475569" 
                fontSize={9} 
                fontWeight="900"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b' }}
              />
              <ZAxis type="number" dataKey="size" range={[80, 500]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg backdrop-blur-md shadow-lg" style={{ boxShadow: `0 4px 12px -4px ${data.fill}40` }}>
                        <p className="text-[10px] font-black text-white uppercase mb-1 leading-none" style={{ color: data.fill }}>{data.name}</p>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{data.category}</span>
                        </div>
                        <p className="text-[8px] text-slate-500 font-bold">HORA: <span className="text-white ml-1">{data.hour}:00</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Ingresos" 
                data={[
                  // Mock Data para el Scatter
                  { hour: 8, index: 1, size: 100, name: 'Juan Perez', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 9, index: 1, size: 150, name: 'R-1024', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 11, index: 1, size: 80, name: 'T&F-851', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 15, index: 1, size: 200, name: 'A2B-244', category: 'Repartidor', fill: COLORS.blue },
                  
                  { hour: 10, index: 2, size: 120, name: 'Visita Comercial', category: 'Visita', fill: COLORS.purple },
                  { hour: 14, index: 2, size: 90, name: 'Auditoría Externa', category: 'Visita', fill: COLORS.purple },
                  { hour: 16, index: 2, size: 180, name: 'Proveedor IT', category: 'Visita', fill: COLORS.purple },
                  
                  { hour: 7, index: 3, size: 300, name: 'Ferreyros S.A.', category: 'Proveedor', fill: COLORS.green },
                  { hour: 12, index: 3, size: 250, name: 'Manasa', category: 'Proveedor', fill: COLORS.green },
                  { hour: 13, index: 3, size: 100, name: 'SiderPeru', category: 'Proveedor', fill: COLORS.green },
                  
                  { hour: 8, index: 4, size: 150, name: 'Obras Civiles', category: 'Contratista', fill: COLORS.orange },
                  { hour: 17, index: 4, size: 120, name: 'Mantenimiento Nave 1', category: 'Contratista', fill: COLORS.orange },
                  { hour: 21, index: 4, size: 80, name: 'Seguridad Nocturna', category: 'Contratista', fill: COLORS.orange },
                ]} 
              >
                {/* Efecto de Brillo para los puntos */}
                {Array.from({ length: 13 }).map((_, index) => (
                  <Cell key={`cell-${index}`} style={{ filter: 'url(#glow-scatter)' }} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. INFOGRAPHIC PROGRESS CHART */}
      <InfographicChart />

    </div>
  );
}
