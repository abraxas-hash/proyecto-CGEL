'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from 'lucide-react';

const COLORS = {
  blue: '#00d4ff',
  orange: '#f97316',
  purple: '#a855f7',
  red: '#ef4444',
  green: '#22c55e',
  gray: '#6b7280'
};

const LIVE_EVENTS = [
  { user: 'JUAN PEREZ', role: 'REPARTIDOR', id: 'R-1024', status: 'CRITICO', msg: 'SCTR Vencido - Acceso denegado en Garita', time: '10:15 AM', color: COLORS.red },
  { user: 'CARLOS DIAZ', role: 'VISITA', id: 'V-0892', status: 'AUDITADO', msg: 'Ingreso autorizado por Gerencia Comercial', time: '09:45 AM', color: COLORS.blue },
  { user: 'FERREYROS', role: 'PROVEEDOR', id: 'P-0341', status: 'OBSERVADO', msg: 'Epps Incompletos - Se provee kit temporal', time: '08:30 AM', color: COLORS.orange },
  { user: 'MANASA S.A.', role: 'CONTRATISTA', id: 'C-0012', status: 'OK', msg: 'Personal y herramientas verificadas en Nave 2', time: '07:50 AM', color: COLORS.green },
];

export function LiveEventsFeed() {
  return (
    <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group h-full">
      <CardHeader className="flex flex-row items-center justify-between z-10 relative">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            Eventos Críticos en Tiempo Real
          </CardTitle>
          <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Reporte de discrepancias y alertas de seguridad</CardDescription>
        </div>
        <Button variant="ghost" className="text-[10px] font-black text-[#00d4ff] hover:bg-[#00d4ff]/5 uppercase tracking-widest">
          Live Feed
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-4 before:absolute before:left-[15px] before:top-6 before:bottom-6 before:w-[2px] before:bg-black/10 dark:before:bg-white/10">
          {LIVE_EVENTS.map((row, i) => (
            <div key={i} className="relative group">
              {/* Dot centered on the vertical line and aligned with the text vertically */}
              <div 
                className={`absolute -left-[22px] top-[22px] w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#050505] z-10 transition-transform group-hover:scale-150 shadow-sm`} 
                style={{ backgroundColor: row.color }}
              ></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-2xl bg-white/[0.02] border border-black/5 dark:border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-black dark:text-white">{row.user}</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ color: row.color, backgroundColor: `${row.color}15` }}>{row.role}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{row.msg}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-tighter">{row.status}</p>
                    <p className="text-[10px] text-gray-600 font-bold">{row.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
