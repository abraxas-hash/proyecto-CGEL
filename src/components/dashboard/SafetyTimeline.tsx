'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: "EPP Completo - Contratista Obras",
    description: "Verificación de casco, guantes y botas de seguridad en el ingreso Nave 1.",
    time: "Hace 15 min",
    status: "done",
    icon: CheckCircle2,
    color: "text-green-400"
  },
  {
    id: 2,
    title: "Alerta de Velocidad - Camión T-50",
    description: "Ingreso detectado a 25km/h en zona de maniobras (Límite 10km/h).",
    time: "Hace 45 min",
    status: "error",
    icon: ShieldAlert,
    color: "text-red-400"
  },
  {
    id: 3,
    title: "Auditoría de Documentos SCTR",
    description: "Validación de vigencia para 15 operarios de mantenimiento nocturno.",
    time: "Hace 2 horas",
    status: "current",
    icon: Info,
    color: "text-cyan-400"
  }
];

export function SafetyTimeline() {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Línea de Tiempo SSOMA</CardTitle>
        <CardDescription className="text-xs text-gray-500">Eventos críticos de seguridad y auditoría en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Línea vertical de fondo */}
          <div className="absolute left-[11px] top-2 bottom-0 w-[1px] bg-white/5" />
          
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative pl-8 group">
                {/* Punto en la línea */}
                <div className={`absolute left-0 top-1 p-1 rounded-full bg-black border border-white/10 z-10 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-3 h-3 ${activity.color}`} />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{activity.title}</h4>
                    <span className="text-[9px] font-bold text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-[250px]">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-6 py-2 text-[10px] font-black text-cyan-400/60 uppercase tracking-widest border border-white/5 rounded-lg hover:bg-white/5 transition-all">
          Ver Historial Completo
        </button>
      </CardContent>
    </Card>
  );
}
