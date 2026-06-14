'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Send, UploadCloud, FileText, AlertTriangle, MessageSquare, Loader2, Home } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ComunicadosPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'Mensaje' | 'Alerta' | 'Documento'>('Mensaje');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [autorRol, setAutorRol] = useState('Gerencia'); // Puede ser 'Gerencia' o 'SSOMA'
  
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );

  // Opcional: verificar rol al cargar
  useEffect(() => {
    // Si quisieras bloquear la página para quienes no sean gerencia/ssoma:
    // supabase.auth.getUser() ...
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let enlace_documento = null;

      // 1. Si hay archivo y el tipo es Documento, subirlo a Storage
      if (tipo === 'Documento' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('documentos')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Error al subir archivo: ${uploadError.message}`);
        }

        // Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('documentos')
          .getPublicUrl(filePath);
          
        enlace_documento = publicUrl;
      }

      // 2. Guardar en la tabla comunicados_oficiales
      const { error: dbError } = await supabase
        .from('comunicados_oficiales')
        .insert([{
          tipo,
          titulo,
          contenido,
          autor_rol: autorRol,
          enlace_documento
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      // Reset form
      setTitulo('');
      setContenido('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al enviar el comunicado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-800 dark:text-white p-4 md:p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Send className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Emitir Comunicado</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Portal exclusivo para Gerencia y SSOMA</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="border-white/10 text-slate-800 dark:text-white hover:bg-white/10 gap-2">
            <Home className="w-4 h-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-[#151515] border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl">
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-sm font-bold">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p>Comunicado publicado exitosamente. Redirigiendo al dashboard...</p>
          </div>
        )}

        {/* Autor */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Emitido Por</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAutorRol('Gerencia')}
              className={`flex-1 py-3 rounded-xl border font-bold transition-all ${autorRol === 'Gerencia' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-black/20 border-white/10 text-slate-500 dark:text-gray-400 hover:bg-white/5'}`}
            >
              Gerencia General
            </button>
            <button
              type="button"
              onClick={() => setAutorRol('SSOMA')}
              className={`flex-1 py-3 rounded-xl border font-bold transition-all ${autorRol === 'SSOMA' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/20 border-white/10 text-slate-500 dark:text-gray-400 hover:bg-white/5'}`}
            >
              Dpto. SSOMA
            </button>
          </div>
        </div>

        {/* Tipo de Comunicado */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Tipo de Comunicado</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setTipo('Mensaje')}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${tipo === 'Mensaje' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-black/20 border-white/10 text-slate-500 dark:text-gray-400 hover:bg-white/5'}`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="font-bold">Mensaje Normal</span>
            </div>
            <div 
              onClick={() => setTipo('Alerta')}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${tipo === 'Alerta' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/20 border-white/10 text-slate-500 dark:text-gray-400 hover:bg-white/5'}`}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="font-bold">Alerta de Seguridad</span>
            </div>
            <div 
              onClick={() => setTipo('Documento')}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${tipo === 'Documento' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/20 border-white/10 text-slate-500 dark:text-gray-400 hover:bg-white/5'}`}
            >
              <FileText className="w-6 h-6" />
              <span className="font-bold">Documento / Política</span>
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Título del Comunicado</label>
          <input 
            type="text" 
            required
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Ej: Nuevas normas de EPP en almacén principal"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-800 dark:text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Contenido */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Cuerpo del Mensaje</label>
          <textarea 
            required
            rows={5}
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            placeholder="Escriba los detalles aquí..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-800 dark:text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Subir Documento (Solo si tipo === Documento) */}
        {tipo === 'Documento' && (
          <div className="mb-8 p-6 border border-dashed border-purple-500/40 rounded-xl bg-purple-500/5 text-center">
            <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-sm text-purple-300 font-bold mb-4">Adjuntar Documento PDF (Requerido)</p>
            <input 
              type="file" 
              required={tipo === 'Documento'}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              ref={fileInputRef}
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 w-full max-w-xs mx-auto"
            />
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || success}
          className="w-full h-14 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black font-black uppercase tracking-widest rounded-xl text-sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
            </span>
          ) : (
             <span className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Publicar Comunicado
             </span>
          )}
        </Button>

      </form>
    </div>
  );
}
