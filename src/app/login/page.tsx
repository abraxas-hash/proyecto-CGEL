'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldAlert, Lock, User, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Login "Kira Style" adaptado para CGEL Control
 * Diseño de pantalla dividida con panel vibrante y formulario oscuro.
 */
export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error de autenticación. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a] font-[family-name:var(--font-geist-sans)] dark">
      
      {/* SECCIÓN IZQUIERDA: Panel Vibrante (Inspirado en Kira) */}
      <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden">
        {/* Gradiente Orgánico de Fondo */}
        <div className="absolute inset-0 bg-[#050505]">
          <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,#00d4ff_0%,#0047AB_40%,#050505_80%)] opacity-40 blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,#00d4ff_0%,transparent_70%)] opacity-20 blur-[80px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Logo y Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-[0.2em] uppercase">CGEL CONTROL</span>
        </div>

        {/* Mensaje Principal */}
        <div className="relative z-10 max-w-lg mb-20">
          <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6">
            Inteligencia <br />
            Operativa <br />
            <span className="text-white/40">Sin Límites.</span>
          </h2>
          <p className="text-white/60 text-lg font-medium leading-relaxed">
            Gestión de seguridad y auditoría en tiempo real para el Centro de Distribución Sonepar.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-black text-white/40 uppercase tracking-[0.3em]">
            <span>Seguridad • Eficiencia • Control</span>
          </div>
        </div>

        {/* Footer Panel Izquierdo */}
        <div className="relative z-10">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">SISTEMA DE AUDITORÍA 2026</p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Decoración sutil de fondo para móvil */}
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_top,#00d4ff_0%,transparent_60%)] opacity-10"></div>
        
        <div className="w-full max-w-[400px] relative z-10">
          <div className="mb-10 lg:hidden flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-2xl flex items-center justify-center border border-[#00d4ff]/20 mb-6">
                <ShieldAlert className="w-8 h-8 text-[#00d4ff]" />
             </div>
             <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">CGEL CONTROL</h1>
          </div>

          <div className="mb-10 text-left">
            <h1 className="text-3xl font-black text-white mb-2">Acceso al Sistema</h1>
            <p className="text-gray-500 text-sm font-medium">Inicie sesión para acceder al panel operativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00d4ff] transition-colors" />
                <Input 
                  type="email" 
                  required
                  placeholder="usuario@cgel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#151515] border-white/5 h-14 rounded-xl pl-12 text-white focus:border-[#00d4ff]/40 focus:ring-0 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00d4ff] transition-colors" />
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Introduzca su clave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#151515] border-white/5 h-14 rounded-xl pl-12 pr-12 text-white focus:border-[#00d4ff]/40 focus:ring-0 transition-all font-mono placeholder:text-gray-600"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-black uppercase text-xs h-14 rounded-xl transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-[0.98] mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando Acceso...
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Ingresar al Sistema
                </div>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center lg:text-left">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">
              © 2026 CGEL Control • Todos los derechos reservados <br />
              Propiedad exclusiva de CGEL - Sonepar del Perú
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
