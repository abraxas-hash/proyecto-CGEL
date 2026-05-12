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
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 w-full select-none">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black text-white uppercase tracking-widest truncate">
          {monthName} {year}
        </h4>
        <div className="flex gap-1">
          <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
          <div key={d} className="text-[9px] font-black text-gray-600 text-center py-1 uppercase">{d}</div>
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
              className={`h-8 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center relative group ${
                active 
                ? 'bg-white text-black' 
                : dataAvailable 
                  ? 'bg-white/5 text-white hover:bg-white/10' 
                  : 'text-gray-600 hover:text-gray-400'
              } ${isToday && !active ? 'ring-1 ring-white/20' : ''}`}
            >
              {day.getDate()}
              {dataAvailable && !active && (
                <div 
                  className="absolute bottom-1 w-1 h-1 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                ></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Días con registros</span>
        </div>
      </div>
    </div>
  );
}
