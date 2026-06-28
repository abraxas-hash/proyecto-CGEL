'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { Clock, Check, X, Loader2, Edit2 } from 'lucide-react';
import { updateRecordTime } from '@/app/actions/time';

interface EditableTimeProps {
  id: string;
  table: string;
  column: string;
  initialTime: string | null;
  label?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function EditableTime({ id, table, column, initialTime, label, onSuccess, className = '' }: EditableTimeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [timeValue, setTimeValue] = useState(initialTime?.slice(0, 5) || '');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeValue(initialTime?.slice(0, 5) || '');
  }, [initialTime]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateRecordTime(table, id, column, timeValue);
      if (result.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        alert(result.error);
      }
    });
  };

  const handleCancel = () => {
    setTimeValue(initialTime?.slice(0, 5) || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/20 ${className}`}>
        <input 
          ref={inputRef}
          type="time" 
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="bg-transparent text-slate-800 dark:text-white font-mono text-xs w-[70px] outline-none"
        />
        <button 
          onClick={handleSave} 
          disabled={isPending}
          className="p-1 hover:bg-green-500/20 text-green-500 rounded"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        </button>
        <button 
          onClick={handleCancel} 
          disabled={isPending}
          className="p-1 hover:bg-red-500/20 text-red-500 rounded"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`group cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors ${className}`}
      title="Editar Hora"
    >
      {label && <span className="text-[10px] uppercase font-bold text-slate-500">{label}:</span>}
      <Clock className="w-3 h-3 text-slate-500" />
      <span className="text-xs font-bold font-mono text-slate-800 dark:text-white">
        {initialTime ? initialTime.slice(0, 5) : '--:--'}
      </span>
      <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
