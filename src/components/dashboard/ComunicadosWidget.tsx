'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, AlertTriangle, MessageSquare, FileText, Download, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Comunicado {
  id: string;
  created_at: string;
  tipo: 'Alerta' | 'Mensaje' | 'Documento';
  titulo: string;
  contenido: string;
  autor_rol: string;
  enlace_documento: string | null;
}

export function ComunicadosWidget() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComunicados() {
      // Intentar obtener los comunicados. Si la tabla no existe, fallará de forma silenciosa.
      try {
        const { data, error } = await supabase
          .from('comunicados_oficiales')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!error && data) {
          setComunicados(data);
        }
      } catch (err) {
        console.error("Error cargando comunicados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComunicados();

    // Suscribirse a nuevos comunicados
    const channel = supabase
      .channel('comunicados_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comunicados_oficiales' }, (payload) => {
        setComunicados(prev => [payload.new as Comunicado, ...prev].slice(0, 3));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-48 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-gray-400 text-sm font-bold">Cargando comunicados...</p>
      </div>
    );
  }

  if (comunicados.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Comunicados Oficiales
        </h3>
        <p className="text-gray-500 text-sm">No hay comunicados recientes de Gerencia o SSOMA.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Bandeja Oficial
        </h3>
      </div>

      <div className="space-y-4">
        {comunicados.map((item) => {
          // Estilos según tipo
          const isAlerta = item.tipo === 'Alerta';
          const isDoc = item.tipo === 'Documento';
          
          const bgClass = isAlerta 
            ? 'bg-red-500/10 border-red-500/20' 
            : isDoc 
              ? 'bg-purple-500/10 border-purple-500/20'
              : 'bg-blue-500/5 border-blue-500/10 dark:border-white/5';

          const iconClass = isAlerta 
            ? 'text-red-500' 
            : isDoc 
              ? 'text-purple-500'
              : 'text-blue-500';

          const Icon = isAlerta ? AlertTriangle : isDoc ? FileText : ShieldCheck;

          return (
            <div key={item.id} className={`p-4 rounded-xl border ${bgClass} transition-all hover:scale-[1.01]`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAlerta ? 'bg-red-500/20' : isDoc ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                  <Icon className={`w-4 h-4 ${iconClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${isAlerta ? 'bg-red-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                      {item.autor_rol}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm md:text-base font-bold mb-1 ${isAlerta ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.titulo}
                  </h4>
                  
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {item.contenido}
                  </p>

                  {isDoc && item.enlace_documento && (
                    <a 
                      href={item.enlace_documento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Documento
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
