import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, destination: string) => {
    if (!email || !password) {
      setError('Por favor complete su correo y contraseña.');
      return false;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Restricciones de acceso basadas en el rol/correo
      if (data.user?.email === 'ssoma@cgel.com' && destination === '/garita') {
        await supabase.auth.signOut();
        throw new Error('Acceso denegado: El departamento SSOMA no tiene autorización para acceder al módulo operativo de Garita.');
      }

      // Redirección exitosa
      window.location.replace(destination);
      return true;

    } catch (err: any) {
      setError(err.message || 'Error de autenticación. Verifique sus credenciales.');
      setLoading(false);
      return false;
    }
  };

  return {
    login,
    loading,
    error,
    setError, // Opcional, por si la vista quiere limpiar el error manualmente
  };
}
