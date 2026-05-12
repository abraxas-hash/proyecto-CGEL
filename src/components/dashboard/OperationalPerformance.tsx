'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
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
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Rendimiento Operativo Semanal</CardTitle>
          <CardDescription className="text-xs text-gray-500">Volumen consolidado de ingresos por categoría</CardDescription>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
              <span className="text-[8px] font-bold text-gray-400 uppercase">REP</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-[8px] font-bold text-gray-400 uppercase">CON</span>
           </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
              />
              <Area
                type="monotone"
                dataKey="repartidores"
                stroke="#00d4ff"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRep)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="contratistas"
                stroke="#a855f7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCon)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
