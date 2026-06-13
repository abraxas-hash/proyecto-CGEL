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
        <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between z-10 relative">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00d4ff]" />
                Performance Operativo
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Volumen de ingresos y auditorías por ciclo semanal</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00d4ff]/10 rounded-full border border-[#00d4ff]/20">
                <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse"></div>
                <span className="text-[9px] font-black text-[#00d4ff] uppercase tracking-widest">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] mt-4 z-10 relative p-0 sm:p-6 sm:pt-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data.weekly} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={15}
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(0, 212, 255, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)', padding: '12px', boxShadow: '0 10px 25px -5px rgba(0, 212, 255, 0.2)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: '900', color: '#00d4ff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke={COLORS.blue} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, fill: '#000', stroke: '#00d4ff', strokeWidth: 3, filter: 'url(#glow)' }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución Radial (Concéntrica) -> Convertida a Donut interactivo */}
        <Card className="h-full glass-panel border-black/5 dark:border-white/5 flex flex-col justify-center relative overflow-hidden group">
          <CardHeader className="pb-2 z-10 relative">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Mix de Seguridad</CardTitle>
            <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Distribución por categoría</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-6 flex flex-col items-center justify-center z-10 relative">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  data={[
                    { name: 'Repartidores', value: data.counts.repartidores || 1, fill: COLORS.blue },
                    { name: 'Visitas', value: data.counts.visitas || 1, fill: COLORS.purple },
                    { name: 'Proveedores', value: data.counts.proveedores || 1, fill: COLORS.green },
                    { name: 'Contratistas', value: data.counts.contratistas || 1, fill: COLORS.orange },
                  ]} 
                  innerRadius="30%" 
                  outerRadius="100%" 
                  barSize={12} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.05)" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', padding: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <RadialBar 
                    background={{ fill: 'rgba(255,255,255,0.02)' }} 
                    dataKey="value" 
                    cornerRadius={10} 
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div><span className="text-[10px] text-gray-400 font-bold uppercase">Repartidores</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.repartidores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a855f7]"></div><span className="text-[10px] text-gray-400 font-bold uppercase">Visitas</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.visitas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22c55e]"></div><span className="text-[10px] text-gray-400 font-bold uppercase">Proveedores</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.proveedores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f97316]"></div><span className="text-[10px] text-gray-400 font-bold uppercase">Contratistas</span></div>
                <span className="text-[10px] text-white font-black">{data.counts.contratistas}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. SCATTER PLOT & ACTIVITY FEED (2 Columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Mapa de Calor */}
        <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group">
        <CardHeader className="flex flex-row items-center justify-between z-10 relative">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#f97316]" />
              Mapa de Calor de Ingresos
            </CardTitle>
            <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Densidad operativa y detección de anomalías por franja horaria</CardDescription>
          </div>
          <div className="hidden sm:flex gap-3">
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div> Rep
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> Vis
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div> Pro
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div> Con
             </div>
          </div>
        </CardHeader>
        <CardContent className="h-[250px] mt-2 relative z-10 p-0 sm:p-6 sm:pt-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
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
                      <div className="bg-black/90 border border-white/10 p-4 rounded-xl backdrop-blur-xl shadow-2xl" style={{ boxShadow: `0 10px 30px -10px ${data.fill}50` }}>
                        <p className="text-[12px] font-black text-white uppercase mb-2 leading-none" style={{ color: data.fill }}>{data.name}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.category}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">HORA REGISTRADA: <span className="text-white ml-1">{data.hour}:00</span></p>
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

        {/* Timeline de Actividad (Shadboard Style) */}
        <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group h-full">
          <CardHeader className="flex flex-row items-center justify-between z-10 relative">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" />
                Eventos Críticos en Tiempo Real
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Reporte de discrepancias y alertas de seguridad</CardDescription>
            </div>
            <Button variant="ghost" className="text-[10px] font-black text-[#00d4ff] hover:bg-[#00d4ff]/5 uppercase tracking-widest">
              Live Feed
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-black/5 dark:bg-white/5">
              {[
                { user: 'JUAN PEREZ', role: 'REPARTIDOR', id: 'R-1024', status: 'CRITICO', msg: 'SCTR Vencido - Acceso denegado en Garita', time: '10:15 AM', color: COLORS.red },
                { user: 'CARLOS DIAZ', role: 'VISITA', id: 'V-0892', status: 'AUDITADO', msg: 'Ingreso autorizado por Gerencia Comercial', time: '09:45 AM', color: COLORS.blue },
                { user: 'FERREYROS', role: 'PROVEEDOR', id: 'P-0341', status: 'OBSERVADO', msg: 'Epps Incompletos - Se provee kit temporal', time: '08:30 AM', color: COLORS.orange },
                { user: 'MANASA S.A.', role: 'CONTRATISTA', id: 'C-0012', status: 'OK', msg: 'Personal y herramientas verificadas en Nave 2', time: '07:50 AM', color: COLORS.green },
              ].map((row, i) => (
                <div key={i} className="relative group">
                  <div className={`absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#050505] z-10 transition-transform group-hover:scale-150`} style={{ backgroundColor: row.color }}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-2xl bg-white/[0.02] border border-black/5 dark:border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-black dark:text-white">{row.user}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ color: row.color, backgroundColor: `${row.color}15` }}>{row.role}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{row.msg}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden md:block">
                        <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-tighter">{row.status}</p>
                        <p className="text-[10px] text-gray-600 font-bold">{row.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
