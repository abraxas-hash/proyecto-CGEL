'use client';

import React from 'react';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from 'lucide-react';

const weeklyData = [
  { day: 'Lun', repartidores: 45, contratistas: 20, visitas: 15 },
  { day: 'Mar', repartidores: 52, contratistas: 25, visitas: 12 },
  { day: 'Mie', repartidores: 48, contratistas: 30, visitas: 18 },
  { day: 'Jue', repartidores: 61, contratistas: 35, visitas: 25 },
  { day: 'Vie', repartidores: 55, contratistas: 28, visitas: 20 },
  { day: 'Sab', repartidores: 20, contratistas: 10, visitas: 5 },
  { day: 'Dom', repartidores: 10, contratistas: 5, visitas: 2 },
];

export function OperationalPerformance() {
  return (
    <Card className="glass-panel overflow-hidden border-black/5 dark:border-white/5 relative">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full relative z-10">
        
        {/* Encabezado minimalista */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white leading-none">Rendimiento Semanal</h3>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Volumen Consolidado</p>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"></div> Rep
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div> Con
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></div> Vis
             </div>
          </div>
        </div>

        {/* Gráfica Minimalista */}
        <div className="w-full h-[100px] -mx-2 -mb-2 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillCon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 9, fontWeight: 'bold' }}
                dy={5}
              />
              <Tooltip 
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="repartidores"
                stroke="#00d4ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillRep)"
                stackId="1"
                activeDot={{ r: 3, fill: '#00d4ff', stroke: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="contratistas"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillCon)"
                stackId="1"
                activeDot={{ r: 3, fill: '#f97316', stroke: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="visitas"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillVis)"
                stackId="1"
                activeDot={{ r: 3, fill: '#a855f7', stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
