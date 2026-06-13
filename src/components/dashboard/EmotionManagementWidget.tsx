'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, MessageCircleHeart, ShieldAlert, Sparkles, RefreshCcw } from 'lucide-react';

const TACTICAL_RESPONSES = [
  {
    category: "Desescalada verbal",
    context: "Conductor alterado por demora",
    phrase: "«Comprendo su frustración y la urgencia. Mi objetivo es procesar su ingreso de manera segura. Ayúdeme con estos documentos para agilizarlo.»",
    icon: MessageCircleHeart,
    color: "#00d4ff"
  },
  {
    category: "Límites asertivos",
    context: "Personal negándose a usar EPPs",
    phrase: "«Entiendo que el casco puede ser incómodo, pero por política estricta de seguridad (SOMA), no puedo autorizar el ingreso sin él. Es por su bienestar.»",
    icon: ShieldAlert,
    color: "#f97316"
  },
  {
    category: "Autorregulación",
    context: "Sobrecarga en garita",
    phrase: "Técnica STOP: Detente 3 segundos, Toma aire, Observa la situación, Procede priorizando la seguridad y no la presión del entorno.",
    icon: BrainCircuit,
    color: "#a855f7"
  },
  {
    category: "Empatía firme",
    context: "Visita sin pase autorizado",
    phrase: "«Lamento el inconveniente, pero no tengo su autorización en sistema. Permítame llamar a su contacto interno para solucionarlo en lugar de discutir.»",
    icon: Sparkles,
    color: "#22c55e"
  }
];

export function EmotionManagementWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate responses every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TACTICAL_RESPONSES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TACTICAL_RESPONSES.length);
  };

  const activeResponse = TACTICAL_RESPONSES[currentIndex];
  const ActiveIcon = activeResponse.icon;

  return (
    <Card className="glass-panel border-black/5 dark:border-white/5 relative overflow-hidden group h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between z-10 relative pb-2">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#a855f7]" />
            Gestión Emocional
          </CardTitle>
          <CardDescription className="text-xs text-gray-600 dark:text-gray-500 mt-1">
            Respuestas tácticas para el control de garita
          </CardDescription>
        </div>
        <button 
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-[#a855f7]"
          title="Siguiente consejo"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center p-6 pt-2 z-10 relative">
        <div className="relative animate-in fade-in slide-in-from-right-4 duration-500" key={currentIndex}>
          <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: activeResponse.color }}></div>
          <div className="pl-4">
            <div className="flex items-center gap-2 mb-2">
              <ActiveIcon className="w-4 h-4" style={{ color: activeResponse.color }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: activeResponse.color }}>
                {activeResponse.category}
              </span>
            </div>
            
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Situación: {activeResponse.context}
            </p>
            
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/10 backdrop-blur-md relative">
              <div className="absolute -top-3 -left-2 text-4xl text-gray-300 dark:text-gray-700/50 font-serif leading-none">"</div>
              <p className="text-sm md:text-base font-medium text-black dark:text-white leading-relaxed relative z-10 italic">
                {activeResponse.phrase}
              </p>
            </div>
          </div>
        </div>
        
        {/* Indicadores de progreso */}
        <div className="flex justify-center gap-1.5 mt-6">
          {TACTICAL_RESPONSES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-[#a855f7]' : 'w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
              }`}
              aria-label={`Ver consejo ${idx + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
