'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const weeklyData = [
  { day: 'Lun', repartidores: 45, contratistas: 20, visitas: 15 },
  { day: 'Mar', repartidores: 52, contratistas: 25, visitas: 12 },
  { day: 'Mie', repartidores: 48, contratistas: 30, visitas: 18 },
  { day: 'Jue', repartidores: 61, contratistas: 35, visitas: 25 },
  { day: 'Vie', repartidores: 55, contratistas: 28, visitas: 20 },
  { day: 'Sab', repartidores: 20, contratistas: 10, visitas: 5 },
  { day: 'Dom', repartidores: 10, contratistas: 5, visitas: 2 },
];

const chartConfig = {
  repartidores: {
    label: "Repartidores",
    color: "var(--chart-1)",
  },
  contratistas: {
    label: "Contratistas",
    color: "var(--chart-2)",
  },
  visitas: {
    label: "Visitas",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function OperationalPerformance() {
  return (
    <Card className="bg-white/60 dark:bg-black/40 border-black/10 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-none h-full">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white">
          Rendimiento Operativo Semanal
        </CardTitle>
        <CardDescription className="text-xs text-gray-600 dark:text-gray-500">
          Volumen consolidado de ingresos por categoría
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={weeklyData} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-repartidores)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-repartidores)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillCon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-contratistas)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-contratistas)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillVis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visitas)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-visitas)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
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
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="repartidores"
              stroke="var(--color-repartidores)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillRep)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="contratistas"
              stroke="var(--color-contratistas)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillCon)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="visitas"
              stroke="var(--color-visitas)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillVis)"
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
