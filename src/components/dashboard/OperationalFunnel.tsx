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
    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 shadow-lg relative overflow-hidden group">
      <CardContent className="p-4 flex flex-col h-full relative z-10">
        
        {/* Encabezado minimalista */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Embudo de Operaciones
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Flujo y conversión de auditoría SOMA</p>
          </div>
        </div>

        {/* Métricas compactas */}
        <div className="flex justify-between items-end mb-2 z-10 px-2">
          {funnelData.map((item, idx) => (
            <div key={item.stage} className="flex flex-col text-center">
              <span className="text-lg font-black text-white drop-shadow-sm">
                {item.value}
              </span>
              <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest mt-0.5">
                {item.stage}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfica AreaChart como fondo/sparkline */}
        <div className="w-full h-[80px] -mx-4 -mb-4 mt-auto">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={funnelData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                cursor={{ stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 1, strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '8px', fontSize: '10px', color: '#fff', padding: '4px 8px' }}
                itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22d3ee" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 3, fill: '#22d3ee', stroke: '#fff', strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
