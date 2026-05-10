'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadialBarChart, RadialBar, Cell, Legend 
} from 'recharts';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, AlertTriangle, Users, Activity, 
  ArrowUpRight, Clock, Zap, Globe, HardHat
} from 'lucide-react';

// Colores del sistema CGEL (Paleta Shadboard)
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
 * Sección de Inteligencia Operativa CGEL
 * Inspirada en Shadboard (Qualiora)
 */
export default function AnalyticsSection({ data }: { data: any }) {
  // Procesar datos para la gráfica radial
  const radialData = [
    { name: 'Repartidores', value: data.counts.repartidores, fill: COLORS.blue },
    { name: 'Visitas', value: data.counts.visitas, fill: COLORS.purple },
    { name: 'Proveedores', value: data.counts.proveedores, fill: COLORS.green },
    { name: 'Contratistas', value: data.counts.contratistas, fill: COLORS.orange },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. TOP METRICS HUB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: 'Total Auditorías', val: data.counts.repartidores + data.counts.visitas + data.counts.proveedores + data.counts.contratistas, icon: Activity, color: COLORS.blue, trend: '+12.5%' },
          { title: 'Alertas Críticas', val: 12, icon: AlertTriangle, color: COLORS.red, trend: '3 Activas' },
          { title: 'Afluencia Promedio', val: ((data.counts.repartidores + data.counts.visitas + data.counts.proveedores + data.counts.contratistas) / 7).toFixed(1), icon: Users, color: COLORS.purple, trend: 'Ing/Día' },
          { title: 'Salud SCTR', val: '94%', icon: ShieldCheck, color: COLORS.green, trend: 'Sincronizado' }
        ].map((kpi, i) => (
          <Card key={i} className="bg-black/40 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-[#00d4ff]/30 transition-all p-3 sm:p-6">
            <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 -mr-4 -mt-4 sm:-mr-8 sm:-mt-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
              <kpi.icon className="w-full h-full" style={{ color: kpi.color }} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
              <CardTitle className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.2em] text-gray-500 truncate mr-1">{kpi.title}</CardTitle>
              <kpi.icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" style={{ color: kpi.color }} />
            </CardHeader>
            <CardContent className="p-0 pt-1 sm:pt-2">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{kpi.val}</div>
              <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mt-1 sm:mt-2">
                <span className="text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 inline-block w-fit" style={{ color: kpi.color }}>{kpi.trend}</span>
                <span className="hidden sm:inline-block text-[7px] sm:text-[9px] text-gray-600 font-medium uppercase tracking-widest truncate">Estado Nominal</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. ANALYTICS CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfica de Tendencia (Area Smooth) - 8 Columnas */}
        <Card className="lg:col-span-8 bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Performance Operativo</CardTitle>
              <CardDescription className="text-xs text-gray-500">Volumen de ingresos y auditorías por ciclo semanal</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
                <span className="text-[9px] font-black text-white uppercase">Ingresos</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: '900', fontSize: '9px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke={COLORS.blue} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución Radial (Concéntrica) - 4 Columnas */}
        <Card className="lg:col-span-4 bg-black/40 border-white/10 backdrop-blur-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Mix de Seguridad</CardTitle>
            <CardDescription className="text-xs text-gray-500">Distribución por categoría de ingreso</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="100%" 
                barSize={12} 
                data={radialData}
                startAngle={90}
                endAngle={450}
              >
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 9, fontWeight: 900 }}
                  background={{ fill: 'rgba(255,255,255,0.03)' }}
                  dataKey="value"
                  cornerRadius={10}
                  animationDuration={1500}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend 
                  iconSize={8} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value) => <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">{value}</span>}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. ACTIVITY FEED & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline de Actividad (Shadboard Style) */}
        <Card className="lg:col-span-2 bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Zap className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Eventos Críticos en Tiempo Real</CardTitle>
                <CardDescription className="text-xs text-gray-500">Reporte de discrepancias y alertas de seguridad</CardDescription>
              </div>
            </div>
            <Button variant="ghost" className="text-[10px] font-black text-[#00d4ff] hover:bg-[#00d4ff]/5 uppercase tracking-widest">
              Live Feed
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
              {[
                { user: 'JUAN PEREZ', role: 'REPARTIDOR', id: 'R-1024', status: 'CRITICO', msg: 'SCTR Vencido - Acceso denegado en Garita', time: '10:15 AM', color: COLORS.red },
                { user: 'CARLOS DIAZ', role: 'VISITA', id: 'V-0892', status: 'AUDITADO', msg: 'Ingreso autorizado por Gerencia Comercial', time: '09:45 AM', color: COLORS.blue },
                { user: 'FERREYROS', role: 'PROVEEDOR', id: 'P-0341', status: 'OBSERVADO', msg: 'Epps Incompletos - Se provee kit temporal', time: '08:30 AM', color: COLORS.orange },
                { user: 'MANASA S.A.', role: 'CONTRATISTA', id: 'C-0012', status: 'OK', msg: 'Personal y herramientas verificadas en Nave 2', time: '07:50 AM', color: COLORS.green },
              ].map((row, i) => (
                <div key={i} className="relative group">
                  <div className={`absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#050505] z-10 transition-transform group-hover:scale-150`} style={{ backgroundColor: row.color }}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white">{row.user}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ color: row.color, backgroundColor: `${row.color}15` }}>{row.role}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{row.msg}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden md:block">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">{row.status}</p>
                        <p className="text-[10px] text-gray-600 font-bold">{row.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Security Metrics (Shadboard Style) */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 to-transparent opacity-50"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00d4ff]" />
                Presencia en Planta
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              {[
                { label: 'Repartidores', count: data.counts.repartidores, percent: 65, color: COLORS.blue },
                { label: 'Contratistas', count: data.counts.contratistas, percent: 15, color: COLORS.orange },
                { label: 'Visitas', count: data.counts.visitas, percent: 20, color: COLORS.purple }
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white">{item.count} PAX</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/20 via-black/40 to-black/40 border-red-500/20 backdrop-blur-xl border-t-4 border-t-red-500">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                <HardHat className="w-4 h-4" />
                Auditoría SOMA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                Se detectaron <span className="text-white font-black underline">3 brechas críticas</span> de seguridad en el patio de maniobras (Nave 1) durante el último ciclo de recojo.
              </p>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-black text-[9px] font-black uppercase tracking-[0.2em] h-10 transition-all shadow-lg shadow-red-500/20">
                ACTUALIZAR IPERC
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
