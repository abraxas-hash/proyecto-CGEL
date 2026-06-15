'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, AlertTriangle, MessageSquare, FileText, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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
        <p className="text-slate-500 dark:text-gray-400 text-sm font-bold">Cargando comunicados...</p>
      </div>
    );
  }

  if (comunicados.length === 0) {
    return (
      <Card className="glass-panel border-slate-400 dark:border-slate-700 dark:border-slate-700 relative overflow-hidden group w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-black dark:text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-800 dark:text-white" />
            Bandeja Oficial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">No hay comunicados recientes de Gerencia o SSOMA.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-slate-400 dark:border-slate-700 dark:border-slate-700 relative overflow-hidden group w-full mb-8">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-2">
        <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest text-black dark:text-slate-800 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-800 dark:text-white" />
          Bandeja Oficial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        {comunicados.map((item) => {
          // Estilos según tipo
          const isAlerta = item.tipo === 'Alerta';
          const isDoc = item.tipo === 'Documento';
          
          const bgClass = isAlerta 
            ? 'bg-red-500/10 border-red-500/20' 
            : isDoc 
              ? 'bg-purple-500/10 border-purple-500/20'
              : 'bg-blue-500/5 border-blue-500/10 dark:border-slate-700';

          const iconClass = isAlerta 
            ? 'text-red-500' 
            : isDoc 
              ? 'text-purple-500'
              : 'text-blue-500';

          const Icon = isAlerta ? AlertTriangle : isDoc ? FileText : ShieldCheck;

          return (
            <div key={item.id} className={`relative p-4 rounded-xl border ${bgClass} backdrop-blur-md transition-all hover:bg-white/[0.04] dark:hover:bg-white/[0.02] overflow-hidden`}>
              {/* Efecto de parpadeo (Pulse) solo para Alertas */}
              {isAlerta && (
                <div className="absolute inset-0 rounded-xl border-2 border-red-500/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] animate-pulse pointer-events-none"></div>
              )}
              
              <div className="flex items-start gap-3 relative z-10">
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAlerta ? 'bg-red-500/20' : isDoc ? 'bg-purple-500/20' : 'bg-[#00d4ff]/20'}`}>
                  <Icon className={`w-4 h-4 ${iconClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${isAlerta ? 'bg-red-500 text-black' : 'bg-black/10 dark:bg-white/10 text-gray-600 dark:text-slate-600 dark:text-gray-300'}`}>
                      {item.autor_rol}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm font-black mb-1.5 tracking-wide ${isAlerta ? 'text-red-500' : 'text-black dark:text-slate-800 dark:text-white'}`}>
                    {item.titulo}
                  </h4>
                  
                  <p className="text-xs text-gray-600 dark:text-slate-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">
                    {item.contenido}
                  </p>

                  {isDoc && item.enlace_documento && (
                    <a 
                      href={item.enlace_documento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
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
      </CardContent>
    </Card>
  );
}
