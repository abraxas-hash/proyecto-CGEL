'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';

interface ChartProps {
  distribution: any[];
  hourly: any[];
  weekly: any[];
}

const COLORS = ['#00d4ff', '#a855f7', '#22c55e', '#f97316'];

export default function DashboardCharts({ distribution, hourly, weekly }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfica de Torta: Distribución de Operaciones */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-black/5 dark:border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <h3 className="text-xs font-black text-gray-600 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Distribución de Carga</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {distribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfica de Áreas: Flujo Horario */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-black/5 dark:border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-gray-600 dark:text-gray-500 uppercase tracking-[0.2em]">Flujo de Ingresos (Picos de Carga)</h3>
            <span className="px-2 py-1 bg-[#00d4ff]/10 text-[#00d4ff] text-[10px] font-bold rounded uppercase">Hoy</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00d4ff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="#00d4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfica de Barras: Afluencia Semanal */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-black/5 dark:border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-black text-gray-600 dark:text-gray-500 uppercase tracking-[0.2em]">Análisis de Afluencia Semanal</h3>
              <p className="text-[10px] text-gray-600 mt-1 uppercase font-bold">Total de registros por día de la semana</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400 opacity-50" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Análisis y Resumen Mensual */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 bg-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
          
          <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Inteligencia Mensual
          </h3>

          <div className="space-y-6">
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-[10px] font-black text-gray-300 uppercase">Resumen de Operaciones</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Este mes se observa un incremento del **12%** en el flujo de **Proveedores**. El día de mayor afluencia promedio ha sido el **Lunes**, concentrando el **28%** de los ingresos totales.
              </p>
            </div>

            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-black text-gray-300 uppercase">Alertas de Seguridad</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Se detectaron **4 incidencias** menores relacionadas con SCTR vencido en contratistas. Se recomienda reforzar la validación previa vía Telegram.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
              <div className="text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Total Mes</p>
                <p className="text-2xl font-black text-black dark:text-white">1,248</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Promedio Día</p>
                <p className="text-2xl font-black text-[#00d4ff]">42</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Auditados</p>
                <p className="text-2xl font-black text-green-400">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
