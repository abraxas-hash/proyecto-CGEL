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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

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
