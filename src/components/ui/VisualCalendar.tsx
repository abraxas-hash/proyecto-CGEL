'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VisualCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  availableDates: string[]; // ['YYYY-MM-DD', ...]
  accentColor?: string;
}

export default function VisualCalendar({ 
  selectedDate, 
  onDateSelect, 
  availableDates,
  accentColor = '#00d4ff' 
}: VisualCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
  const year = currentMonth.getFullYear();

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    const d = date.toISOString().split('T')[0];
    return d === selectedDate;
  };

  const hasData = (date: Date) => {
    const d = date.toISOString().split('T')[0];
    return availableDates.includes(d);
  };

  return (
    <div className="bg-black/[0.03] dark:bg-white/[0.03] border border-slate-400 dark:border-slate-700 dark:border-slate-700 rounded-2xl p-4 w-full select-none">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black text-black dark:text-slate-800 dark:text-white uppercase tracking-widest truncate">
          {monthName} {year}
        </h4>
        <div className="flex gap-1">
          <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-black dark:hover:text-slate-800 dark:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-black dark:hover:text-slate-800 dark:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-gray-600 text-center py-1 uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-8"></div>;
          
          const active = isSelected(day);
          const dataAvailable = hasData(day);
          const dateStr = day.toISOString().split('T')[0];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <button
              key={idx}
              onClick={() => onDateSelect(dateStr)}
              style={active ? {
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                borderColor: `${accentColor}60`,
                color: accentColor,
                boxShadow: `0 0 12px ${accentColor}30, inset 0 1px 0 ${accentColor}20`,
              } : {}}
              className={`
                h-8 w-full rounded-lg text-[10px] font-black transition-all duration-200
                flex flex-col items-center justify-center relative select-none
                ${active
                  ? 'border border-solid scale-105'
                  : dataAvailable
                    ? 'bg-black/[0.04] dark:bg-white/[0.04] text-black dark:text-slate-800 dark:text-white border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 hover:border-black/20 dark:hover:border-white/20'
                    : isToday
                      ? 'text-gray-600 dark:text-slate-500 dark:text-gray-400 border border-dashed border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-slate-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-slate-500 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                }
              `}
            >
              <span className="relative z-10 leading-none">{day.getDate()}</span>

              {/* Punto pulsante para días con datos */}
              {dataAvailable && !active && (
                <span
                  className="absolute bottom-[3px] w-[5px] h-[5px] rounded-full animate-pulse"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 6px ${accentColor}`,
                  }}
                />
              )}

              {/* Halo radial para el día de hoy */}
              {isToday && !active && (
                <span
                  className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-400 dark:border-slate-700 dark:border-slate-700 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
          <span className="text-[9px] text-gray-600 dark:text-gray-500 font-bold uppercase tracking-widest">Días con registros</span>
        </div>
      </div>
    </div>
  );
}
