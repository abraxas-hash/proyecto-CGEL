'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Lock, User, Eye, EyeOff, Loader2, LayoutDashboard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AsciiArt } from "@/components/ui/ascii-art";

// Importamos nuestro custom hook que maneja toda la lógica (SRP)
import { useAuth } from '@/hooks/useAuth';

/**
 * Página de Login del Sistema CGEL - Aplicativo de Garita
 * Ahora completamente modularizada respetando el principio SOLID (SRP).
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Protección contra fuerza bruta (cliente)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0); // segundos restantes de bloqueo

  // Por defecto, si se da Enter en el form, entraremos a garita
  const [defaultDestino, setDefaultDestino] = useState<'/garita' | '/'>('/garita');

  // Lógica abstraída al Hook
  const { login, loading, error, setError } = useAuth();

  // Temporizador de cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Capturar el evento de instalación PWA
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const executeLogin = async (destino: '/garita' | '/visitas' | '/') => {
    if (cooldown > 0) return;
    const ok = await login(email, password, destino);
    if (ok === false) {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      // Bloquear 30s tras 3 intentos fallidos
      if (next >= 3) {
        setCooldown(30);
        setFailedAttempts(0);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(defaultDestino);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a] font-[family-name:var(--font-geist-sans)] dark">

      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-[#000000] z-0 opacity-40">
          <AsciiArt
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            resolution={50}
            charset="blocks"
            color="var(--color-cyan-500, #00d4ff)"
            inverted={true}
            animated={true}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <ShieldAlert className="w-6 h-6 text-slate-800 dark:text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 dark:text-white tracking-[0.2em] uppercase">NEXUS CONTROL</span>
        </div>

        <div className="relative z-10 max-w-lg mb-20">
          <h2 className="text-6xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tighter mb-6">
            Inteligencia <br />
            Operativa <br />
            <span className="text-white/40">Sin Límites.</span>
          </h2>
          <p className="text-white/60 text-lg font-medium leading-relaxed">
            Gestión de seguridad y auditoría en tiempo real para el Centro de Distribución Principal.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-black text-white/40 uppercase tracking-[0.3em]">
            <span>Seguridad • Eficiencia • Control</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">SISTEMA DE AUDITORÍA 2026</p>
        </div>
      </div>

      {/* PANEL DERECHO: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_top,#00d4ff_0%,transparent_60%)] opacity-10"></div>

        <div className="w-full max-w-[400px] relative z-10">

          {/* Logo móvil */}
          <div className="mb-10 lg:hidden flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-2xl flex items-center justify-center border border-[#00d4ff]/20 mb-6">
              <ShieldAlert className="w-8 h-8 text-slate-800 dark:text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">NEXUS CONTROL</h1>
          </div>

          <div className="mb-10 text-left">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Acceso al Sistema</h1>
            <p className="text-gray-500 text-sm font-medium">Inicie sesión para acceder al panel de garita</p>
          </div>

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-slate-800 dark:text-white transition-colors" />
                <Input
                  type="email"
                  required
                  placeholder="usuario@cgel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#151515] border-slate-700 h-14 rounded-xl pl-12 text-slate-800 dark:text-white focus:border-[#00d4ff]/40 focus:ring-0 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-slate-800 dark:text-white transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Introduzca su clave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#151515] border-slate-700 h-14 rounded-xl pl-12 pr-12 text-slate-800 dark:text-white focus:border-[#00d4ff]/40 focus:ring-0 transition-all font-mono placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-800 dark:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">
                  {error}
                  {failedAttempts > 0 && failedAttempts < 3 && (
                    <span className="ml-2 text-orange-400">· Intento {failedAttempts}/3</span>
                  )}
                </p>
              </div>
            )}

            {/* Bloqueo temporal por fuerza bruta */}
            {cooldown > 0 && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                <p className="text-orange-400 text-[10px] font-black uppercase tracking-tight">
                  Acceso bloqueado temporalmente · Espere {cooldown}s
                </p>
              </div>
            )}

            {/* Botones de acceso por rol */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* Agente de Garita */}
              <Button
                type="submit" // Al ser el primer submit, tomará el "Enter" por defecto si no se cambia
                disabled={loading}
                onClick={() => executeLogin('/garita')}
                onMouseEnter={() => setDefaultDestino('/garita')}
                className="w-full bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black font-black uppercase text-[10px] h-16 rounded-xl transition-all shadow-[0_10px_30px_rgba(0,212,255,0.15)] active:scale-[0.98] flex flex-col gap-1"
              >
                {loading && defaultDestino === '/garita' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
                <span>Agente Garita</span>
              </Button>

              {/* Supervisor */}
              <Button
                type="button"
                disabled={loading}
                onClick={() => executeLogin('/')}
                onMouseEnter={() => setDefaultDestino('/')}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-800 dark:text-white font-black uppercase text-[10px] h-16 rounded-xl transition-all active:scale-[0.98] flex flex-col gap-1"
              >
                {loading && defaultDestino === '/' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LayoutDashboard className="w-5 h-5" />
                )}
                <span>Supervisor</span>
              </Button>
            </div>
          </form>

          {/* Botón de instalación PWA */}
          {!isInstalled && installPrompt && (
            <button
              onClick={handleInstall}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/5 hover:bg-[#00d4ff]/10 text-[#00d4ff] text-[11px] font-black uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Instalar App en este dispositivo
            </button>
          )}
          {isInstalled && (
            <p className="mt-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              ✓ App instalada en este dispositivo
            </p>
          )}

          <div className="mt-8 text-center lg:text-left">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">
              © 2026 Nexus Control | Todos los derechos reservados <br />
              Sistema Operativo de Seguridad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
