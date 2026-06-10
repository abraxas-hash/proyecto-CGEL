'use client';

import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
    label: "Operaciones",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function OperationalFunnel() {
  return (
    <Card className="bg-white/60 dark:bg-black/40 border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-lg dark:shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white">
          Embudo de Operaciones
        </CardTitle>
        <CardDescription className="text-xs text-gray-600 dark:text-gray-500">
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
                className="text-xl font-black leading-tight text-cyan-600 dark:text-cyan-400"
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfica Lineal */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full px-2 sm:px-6 pb-4">
          <LineChart
            accessibilityLayer
            data={funnelData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-value)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
