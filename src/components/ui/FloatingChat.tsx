'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';

export function FloatingChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const [messages, setMessages] = useState<Array<{role: string, content: string, id: string}>>([]);
  const [myInput, setMyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Configuración de Reconocimiento de Voz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMyInput((prev) => prev ? prev + ' ' + transcript : transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        setMyInput(''); // Limpiar antes de grabar
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert('Tu navegador no soporta dictado por voz. Usa Google Chrome o Edge.');
      }
    }
  };

  const sendMessage = async () => {
    if (!myInput.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role: 'user', content: myInput };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = myInput;
    setMyInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      // Leer como texto primero para evitar fallos al parsear errores HTML/texto plano
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error('[Chat] Respuesta no es JSON:', rawText.substring(0, 200));
        throw new Error('El servidor no respondió correctamente. Intenta de nuevo.');
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || `Error ${res.status} del servidor`);
      }

      setMessages(prev => [...prev, { id: Date.now().toString() + '1', role: 'assistant', content: data.content }]);
    } catch (error: any) {
      console.error('[Chat] Error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString() + 'e', role: 'assistant', content: '⚠️ ' + (error.message || 'Error de conexión. Intenta de nuevo.') }]);
      setMyInput(currentInput);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onSafeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  // Ocultar el chat flotante en la página de login o en la app de garita
  if (pathname === '/login' || pathname?.startsWith('/garita')) {
    return null;
  }

  return (
    <>
      {/* Botón Lateral (Tab Vertical) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat de ayuda" : "Abrir chat de ayuda"}
        className={`fixed top-1/2 right-0 -translate-y-1/2 z-50 flex flex-col items-center justify-center py-4 px-2 rounded-l-xl shadow-[-4px_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-x-1 active:scale-95 ${
          isOpen 
            ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-none' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
        }`}
      >
        <div className="relative">
          {isOpen ? <X className="w-5 h-5 mb-3" /> : <MessageSquare className="w-5 h-5 mb-3" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse border border-blue-600"></span>
          )}
        </div>
        <span 
          className="text-[10px] font-black uppercase tracking-widest text-white" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Nexus AI
        </span>
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-12 z-50 flex flex-col items-end animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="mb-4 w-80 sm:w-96 h-[520px] max-h-[80vh] flex flex-col glass-panel rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
          
          {/* Header del Chat */}
          <div className="flex items-center justify-between p-4 border-b border-slate-400 dark:border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-4 h-4 text-slate-800 dark:text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-800 dark:text-white leading-none">Nexus AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-widest">En línea</span>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/60 dark:bg-black/20">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xs mt-8 px-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-blue-500/60" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">Hola, soy Nexus AI</p>
                <p className="mt-1 text-slate-500">Puedes dictarme audios o preguntarme sobre el dashboard y los accesos de garita en tiempo real.</p>
              </div>
            )}
            
            {messages.map((m) => {
              const isUser = m.role === 'user';

              return (
                <div key={m.id} className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                      isUser ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-600/20 border border-blue-500/30'
                    }`}>
                      {isUser ? <User className="w-3 h-3 text-slate-500" /> : <Bot className="w-3 h-3 text-blue-500" />}
                    </div>
                    
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-blue-600 text-slate-800 dark:text-white rounded-tr-sm shadow-sm shadow-blue-500/20' 
                        : 'bg-white dark:bg-[#1e1e1e] text-slate-700 dark:text-slate-200 border border-slate-400 dark:border-slate-700 rounded-tl-sm shadow-sm'
                    }`}>
                      {m.content && <p className="whitespace-pre-wrap">{m.content}</p>}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mt-1">
                  <Bot className="w-3 h-3 text-blue-500" />
                </div>
                <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 bg-white dark:bg-[#1e1e1e] border border-slate-400 dark:border-slate-700 rounded-tl-sm shadow-sm flex items-center">
                   <span className="flex gap-1 py-0.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={onSafeSubmit} className="p-3 bg-white dark:bg-[#0d0d0d] border-t border-slate-400 dark:border-slate-700 relative">
            {isRecording && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full animate-pulse flex items-center gap-1 font-bold tracking-widest shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                ESCUCHANDO...
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' 
                    : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
                title="Dictar por voz"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                className={`flex-1 bg-slate-100 dark:bg-[#1a1a1a] border border-transparent focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors placeholder:text-slate-400 ${isRecording ? 'opacity-50' : ''}`}
                value={myInput}
                onChange={(e) => setMyInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Habla ahora..." : "Pregunta o busca un DNI..."}
                disabled={isLoading || isRecording}
                autoComplete="off"
              />
              
              <button 
                type="submit"
                disabled={!myInput.trim() || isLoading || isRecording}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
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
        </div>
      )}
    </>
  );
}
