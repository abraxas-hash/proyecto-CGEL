'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Users, Briefcase, PiggyBank, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Datos de prueba (Mock) basados en las métricas de la foto
const data = [
  {
    name: 'Registro',
    year: '2020',
    value: 25,
    fill: '#b499c7', // Morado
    icon: Users,
    desc: 'Visitas y Proveedores registrados'
  },
  {
    name: 'Auditoría',
    year: '2021',
    value: 70,
    fill: '#49d0b5', // Verde aqua
    icon: Briefcase,
    desc: 'Auditorías SOMA superadas'
  },
  {
    name: 'Proceso',
    year: '2022',
    value: 75,
    fill: '#fcb145', // Naranja/Amarillo
    icon: PiggyBank,
    desc: 'Eficiencia en tiempo de espera'
  },
  {
    name: 'Ingreso',
    year: '2023',
    value: 100,
    fill: '#ef6f6a', // Rojo
    icon: Target,
    desc: 'Operaciones exitosas liberadas'
  },
];

// --- Custom Shapes para Recharts ---

// Barra personalizada con texto vertical
const CustomBar = (props: any) => {
  const { x, y, width, height, fill, value } = props;
  const radius = 6;
  
  // No renderizar si no hay altura
  if (height === undefined || height <= 0) return null;

  return (
    <g>
      {/* Rectángulo principal de la barra (con borde superior redondeado) */}
      <path
        d={`M${x},${y + radius} A${radius},${radius},0,0,1,${x + radius},${y} L${x + width - radius},${y} A${radius},${radius},0,0,1,${x + width},${y + radius} L${x + width},${y + height} L${x},${y + height} Z`}
        fill={fill}
      />
      {/* Texto Vertical del porcentaje dentro de la barra */}
      <text
        x={x + width / 2}
        y={y + height - 20}
        fill="#ffffff"
        textAnchor="start"
        alignmentBaseline="middle"
        transform={`rotate(-90, ${x + width / 2}, ${y + height - 20})`}
        className="text-2xl font-black tracking-widest drop-shadow-md"
      >
        {value}%
      </text>
      
      {/* Texto del "Año" encima de la barra */}
      <text
        x={x + width / 2}
        y={y - 15}
        fill="#ffffff"
        textAnchor="middle"
        className="text-sm font-bold"
      >
        {props.payload.year}
      </text>
    </g>
  );
};

// Burbuja/Pin de Mapa personalizado para los puntos de la línea
const CustomDot = (props: any) => {
  const { cx, cy, payload, value } = props;
  
  if (cx === undefined || cy === undefined) return null;

  const IconComponent = payload.icon;

  return (
    <g>
      {/* Punto central en la línea */}
      <circle cx={cx} cy={cy} r={4} fill="#ffffff" stroke={payload.fill} strokeWidth={2} />
      
      {/* Forma de "Pin/Gota" SVG (Invertido hacia abajo) */}
      <path
        d={`M${cx},${cy - 10} C${cx - 30},${cy - 40} ${cx - 25},${cy - 70} ${cx},${cy - 70} C${cx + 25},${cy - 70} ${cx + 30},${cy - 40} ${cx},${cy - 10} Z`}
        fill={payload.fill}
        className="drop-shadow-lg"
      />
      
      {/* Círculo interno blanco */}
      <circle cx={cx} cy={cy - 45} r={14} fill="rgba(255,255,255,0.2)" />
      
      {/* Icono Lucide */}
      <foreignObject x={cx - 10} y={cy - 55} width="20" height="20">
        <IconComponent size={20} color="#ffffff" />
      </foreignObject>
    </g>
  );
};

// Custom Eje X para simular la línea de tiempo
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const index = data.findIndex(d => d.name === payload.value);
  const isLast = index === data.length - 1;
  const itemColor = data[index]?.fill || '#fff';

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Línea conectora base del timeline */}
      {!isLast && (
        <line x1={0} y1={15} x2={100} y2={15} stroke="#334155" strokeWidth={4} />
      )}
      {/* Línea coloreada de progreso (Timeline) */}
      <line x1={-50} y1={15} x2={0} y2={15} stroke={itemColor} strokeWidth={4} strokeLinecap="round" />
      
      {/* Punto (Nudo) en el timeline */}
      <circle cx={0} cy={15} r={4} fill="#ffffff" />
      
      {/* Texto de la categoría */}
      <text x={0} y={0} dy={0} textAnchor="middle" fill="#f8fafc" className="text-sm font-bold uppercase tracking-widest">
        {payload.value}
      </text>
      
      {/* Texto descriptivo pequeñito debajo */}
      <text x={0} y={30} textAnchor="middle" fill="#94a3b8" className="text-[7px] max-w-[80px]">
        Flujo de control
      </text>
    </g>
  );
};

export function InfographicChart() {
  return (
    <Card className="bg-[#2c4046] border-none shadow-2xl relative overflow-hidden group">
      
      {/* Background Decorativo de Cuadrícula (simulando papel milimetrado) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <CardHeader className="relative z-10 p-6 pb-0">
        <CardTitle className="text-lg font-bold text-white tracking-widest uppercase flex gap-1">
          <span>OPERATIONAL</span> <span className="text-[#ef6f6a]">MILESTONES</span>
        </CardTitle>
        <CardDescription className="text-xs text-slate-300 mt-2 max-w-sm">
          "Visualización del avance progresivo en las etapas de control y auditoría a lo largo del tiempo. Las barras representan la conversión porcentual de las operaciones."
        </CardDescription>
      </CardHeader>
      
      <CardContent className="h-[250px] mt-2 relative z-10 w-full p-0 sm:p-2 sm:pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 60, right: 20, bottom: 20, left: 20 }}
          >
            {/* Ocultamos el eje Y visualmente */}
            <YAxis domain={[0, 110]} hide />
            
            {/* Eje X con renderizado personalizado para hacer el timeline inferior */}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={<CustomXAxisTick />} 
              height={60}
            />
            
            {/* Tooltip desactivado o muy simple porque la info está integrada */}
            <Tooltip 
               cursor={{ fill: 'rgba(255,255,255,0.05)' }}
               contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
            />

            {/* La línea diagonal conectando los puntos (usando monotone o linear) */}
            <Line 
              type="linear" 
              dataKey="value" 
              stroke="#ffffff" 
              strokeWidth={3} 
              dot={<CustomDot />} 
              activeDot={false}
              isAnimationActive={true}
            />

            {/* Las barras coloridas con texto vertical */}
            <Bar 
              dataKey="value" 
              barSize={45} 
              shape={<CustomBar />}
              isAnimationActive={true}
            />
            
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
