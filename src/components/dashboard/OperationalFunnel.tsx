'use client';

import React from 'react';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from 'lucide-react';

const funnelData = [
  { stage: 'ENTRADA', value: 450 },
  { stage: 'EN ESPERA', value: 380 },
  { stage: 'AUDITANDO', value: 240 },
  { stage: 'LIBERADO', value: 180 },
];

export function OperationalFunnel() {
  return (
    <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group">
      <CardContent className="p-0 sm:p-6 sm:pb-0 flex flex-col h-full relative z-10">
        
        {/* Encabezado minimalista */}
        <div className="flex items-center justify-between mb-4 sm:pt-0 pt-4 px-4 sm:px-0">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00d4ff]" />
              Embudo de Operaciones
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">Flujo y conversión de auditoría SOMA</p>
          </div>
        </div>

        {/* Métricas compactas */}
        <div className="flex justify-between items-end mb-2 z-10">
          {funnelData.map((item, idx) => (
            <div key={item.stage} className="flex flex-col text-center">
              <span className="text-xs sm:text-sm font-black text-black dark:text-white drop-shadow-sm">
                {item.value}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                {item.stage}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfica AreaChart como fondo/sparkline */}
        <div className="w-full h-[140px] -mx-2 -mb-2 mt-auto">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={funnelData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                cursor={{ stroke: 'rgba(0, 212, 255, 0.2)', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                itemStyle={{ color: '#00d4ff', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#00d4ff" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 4, fill: '#00d4ff', stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
