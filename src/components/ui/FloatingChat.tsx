'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const userText = input.trim();
    if (!userText || isLoading) return;

    // Añadir mensaje del usuario a la UI inmediatamente
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Placeholder del asistente para ir rellenando con streaming
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        // Intentar leer el mensaje de error del servidor
        let errMsg = `Error del servidor (HTTP ${res.status})`;
        try {
          const errJson = await res.json();
          errMsg = errJson.details || errJson.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      // Leer la respuesta JSON simple
      const data = await res.json();
      const responseText = data.text || '';

      if (!responseText) {
        throw new Error('La IA no generó respuesta');
      }

      // Simular efecto de escritura letra por letra
      let displayed = '';
      for (let i = 0; i < responseText.length; i++) {
        displayed += responseText[i];
        const snap = displayed;
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: snap } : m)
        );
        // Pequeña pausa para el efecto typewriter (~15ms por carácter)
        if (i % 3 === 0) await new Promise(r => setTimeout(r, 12));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? {
          ...m,
          content: '⚠️ No pude conectarme con el asistente en este momento. Por favor intenta de nuevo en unos segundos.'
        } : m)
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[520px] max-h-[80vh] flex flex-col glass-panel rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header del Chat */}
          <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 bg-gradient-to-r from-blue-600/20 to-purple-600/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">Nexus AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-widest">En línea</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/60 dark:bg-black/20">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs mt-8 px-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-blue-500/60" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Hola, soy Nexus AI</p>
                <p className="mt-1 text-slate-500">Estoy aquí para ayudarte con el sistema de control operativo. ¿En qué te puedo asistir?</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mt-1">
                    <Bot className="w-3 h-3 text-blue-500" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm shadow-blue-500/20' 
                    : 'bg-white dark:bg-[#1e1e1e] text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/5 rounded-tl-sm shadow-sm'
                }`}>
                  {m.content ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <span className="flex gap-1 py-0.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mt-1">
                    <User className="w-3 h-3 text-slate-500" />
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-[#0d0d0d] border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                className="flex-1 bg-slate-100 dark:bg-[#1a1a1a] border border-transparent focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors placeholder:text-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre el sistema..."
                disabled={isLoading}
                autoComplete="off"
                aria-label="Pregunta sobre el sistema"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat de ayuda" : "Abrir chat de ayuda"}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-slate-700 dark:bg-slate-600 shadow-slate-500/20 text-white' 
            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30 text-white'
        }`}
      >
        <div className={`transition-all duration-200 ${isOpen ? 'rotate-0' : 'rotate-0'}`}>
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </div>
        {/* Pulso animado cuando está cerrado */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
        )}
      </button>
    </div>
  );
}
