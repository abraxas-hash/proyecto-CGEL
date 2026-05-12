'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: 'ENTRADA', value: 450, fill: '#00d4ff' },
  { name: 'EN ESPERA', value: 380, fill: '#a855f7' },
  { name: 'AUDITANDO', value: 240, fill: '#22c55e' },
  { name: 'LIBERADO', value: 180, fill: '#f97316' },
];

export function OperationalFunnel() {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Embudo de Operaciones</CardTitle>
        <CardDescription className="text-xs text-gray-500">Eficiencia del flujo de auditoría (Pipeline)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 gap-4 px-6 mb-4">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
              <span className="text-xl font-black text-white leading-tight">{item.value}</span>
            </div>
          ))}
        </div>
        
        <div style={{ width: '100%', height: 160 }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/90 border border-white/10 p-2 rounded-lg backdrop-blur-md">
                        <p className="text-[10px] font-black text-white">{payload[0].payload.name}</p>
                        <p className="text-[12px] font-bold text-cyan-400">{payload[0].value} UNIDADES</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                dataKey="value"
                type="bump"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#funnelGradient)"
                fillOpacity={1}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
