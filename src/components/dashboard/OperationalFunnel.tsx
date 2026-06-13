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
    <Card className="glass-panel bg-blue-50 dark:bg-[#00d4ff]/5 border-blue-200 dark:border-[#00d4ff]/20 overflow-hidden relative">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full relative z-10">
        
        {/* Encabezado minimalista */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#00d4ff]/10">
              <Filter className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white leading-none">Embudo de Operaciones</h3>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Flujo de Auditoría</p>
            </div>
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
        <div className="w-full h-[80px] -mx-2 -mb-2 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
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
