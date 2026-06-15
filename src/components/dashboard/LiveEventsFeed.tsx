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
    <Card className="glass-panel border-slate-400 dark:border-slate-700 dark:border-slate-700 relative overflow-hidden group h-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 relative gap-3">
        <div>
          <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest text-black dark:text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            Eventos Críticos en Tiempo Real
          </CardTitle>
          <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">Reporte de discrepancias y alertas de seguridad</CardDescription>
        </div>
        <Button variant="ghost" className="text-[10px] font-black text-slate-800 dark:text-white hover:bg-[#00d4ff]/5 uppercase tracking-widest">
          Live Feed
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {LIVE_EVENTS.map((row, i) => (
            <div key={i} className="flex flex-col p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-slate-400 dark:border-slate-700 dark:border-slate-700 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
              {/* Línea indicadora de color a la izquierda */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-50 transition-opacity group-hover:opacity-100" 
                style={{ backgroundColor: row.color }}
              />
              
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-white truncate">{row.user}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter shrink-0" style={{ color: row.color }}>{row.status}</span>
              </div>
              
              <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed mb-3 flex-grow line-clamp-2" title={row.msg}>
                {row.msg}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-400 dark:border-slate-700 dark:border-slate-700">
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ color: row.color, backgroundColor: `${row.color}15` }}>
                  {row.role}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">{row.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
