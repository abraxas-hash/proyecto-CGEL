'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  RadialBarChart, RadialBar, PolarGrid,
  ScatterChart, Scatter, YAxis, ZAxis, Cell
} from 'recharts';

import { Activity } from 'lucide-react';

// Colores del sistema Nexus ajustados para modo oscuro sin tarjeta de fondo
const COLORS = {
  blue: '#38bdf8', // light blue
  purple: '#c084fc', // light purple
  green: '#4ade80', // light green
  orange: '#fb923c', // light orange
};

export default function MiniAnalytics({ data }: { data: any }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-8 px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Gráfica de Tendencia (Area Smooth) Mini */}
        <div className="relative group">
          <div className="flex flex-row items-center justify-between mb-4">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
                <Activity className="w-3 h-3 text-slate-800 dark:text-white" />
                Performance Semanal
              </h3>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
              <AreaChart data={data.weekly} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotalMini" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={9} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(56, 189, 248, 0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)', padding: '8px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', color: COLORS.blue }}
                  labelStyle={{ color: '#cbd5e1', marginBottom: '4px', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke={COLORS.blue} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotalMini)" 
                  activeDot={{ r: 4, fill: '#000', stroke: COLORS.blue, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución Radial Mini */}
        <div className="relative group flex flex-col justify-center">
          <div className="mb-2">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Mix Operativo</h3>
          </div>
          <div className="flex items-center">
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
                  <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.03)" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '6px' }}
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
            <div className="w-1/2 grid grid-cols-1 gap-y-2 pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS.blue}}></div><span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase">Rep</span></div>
                <span className="text-[9px] text-slate-800 dark:text-white font-black">{data.counts.repartidores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS.purple}}></div><span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase">Vis</span></div>
                <span className="text-[9px] text-slate-800 dark:text-white font-black">{data.counts.visitas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS.green}}></div><span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase">Pro</span></div>
                <span className="text-[9px] text-slate-800 dark:text-white font-black">{data.counts.proveedores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS.orange}}></div><span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase">Con</span></div>
                <span className="text-[9px] text-slate-800 dark:text-white font-black">{data.counts.contratistas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3. SCATTER PLOT Mini (Full Width) */}
      <div className="mt-8 relative group">
        <div className="mb-2">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-3 h-3 text-orange-400" />
            Mapa de Calor Operacional
          </h3>
        </div>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <XAxis 
                type="number" 
                dataKey="hour" 
                domain={[0, 24]} 
                stroke="#475569" 
                fontSize={9} 
                fontWeight="bold"
                axisLine={false}
                tickLine={false}
                tickMargin={5}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis 
                type="number" 
                dataKey="index" 
                domain={[0, 5]} 
                ticks={[1, 2, 3, 4]}
                tickFormatter={(val) => {
                  if (val === 1) return 'R';
                  if (val === 2) return 'V';
                  if (val === 3) return 'P';
                  if (val === 4) return 'C';
                  return '';
                }}
                stroke="#475569" 
                fontSize={8} 
                fontWeight="900"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <ZAxis type="number" dataKey="size" range={[20, 150]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-black/90 border border-white/10 p-2 rounded-lg backdrop-blur-xl">
                        <p className="text-[9px] font-black text-slate-800 dark:text-white uppercase leading-none" style={{ color: d.fill }}>{d.name}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Ingresos" 
                data={[
                  { hour: 8, index: 1, size: 40, name: 'Repartidor', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 9, index: 1, size: 60, name: 'Repartidor', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 11, index: 1, size: 30, name: 'Repartidor', category: 'Repartidor', fill: COLORS.blue },
                  { hour: 15, index: 1, size: 80, name: 'Repartidor', category: 'Repartidor', fill: COLORS.blue },
                  
                  { hour: 10, index: 2, size: 50, name: 'Visita', category: 'Visita', fill: COLORS.purple },
                  { hour: 14, index: 2, size: 30, name: 'Visita', category: 'Visita', fill: COLORS.purple },
                  { hour: 16, index: 2, size: 70, name: 'Visita', category: 'Visita', fill: COLORS.purple },
                  
                  { hour: 7, index: 3, size: 100, name: 'Proveedor', category: 'Proveedor', fill: COLORS.green },
                  { hour: 12, index: 3, size: 80, name: 'Proveedor', category: 'Proveedor', fill: COLORS.green },
                  { hour: 13, index: 3, size: 40, name: 'Proveedor', category: 'Proveedor', fill: COLORS.green },
                  
                  { hour: 8, index: 4, size: 60, name: 'Contratista', category: 'Contratista', fill: COLORS.orange },
                  { hour: 17, index: 4, size: 50, name: 'Contratista', category: 'Contratista', fill: COLORS.orange },
                  { hour: 21, index: 4, size: 30, name: 'Contratista', category: 'Contratista', fill: COLORS.orange },
                ]} 
              >
                {Array.from({ length: 13 }).map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
