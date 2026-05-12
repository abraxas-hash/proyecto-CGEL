'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const funnelData = [
  { stage: 'ENTRADA', value: 450 },
  { stage: 'EN ESPERA', value: 380 },
  { stage: 'AUDITANDO', value: 240 },
  { stage: 'LIBERADO', value: 180 },
];

const chartConfig = {
  value: {
    label: "Unidades",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function OperationalFunnel() {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-white">
          Embudo de Operaciones
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Eficiencia del flujo de auditoría (Pipeline)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Métricas por etapa */}
        <div className="grid grid-cols-4 gap-4 px-6 mb-4">
          {funnelData.map((item, idx) => (
            <div key={item.stage} className="flex flex-col">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                {item.stage}
              </span>
              <span
                className="text-xl font-black leading-tight"
                style={{ color: `hsl(var(--chart-${idx + 1}))` }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfica bump área */}
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <AreaChart data={funnelData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="funnelFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="stage" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="value"
              type="bump"
              stroke="var(--color-value)"
              strokeWidth={2.5}
              fill="url(#funnelFill)"
              fillOpacity={1}
              animationDuration={1500}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
