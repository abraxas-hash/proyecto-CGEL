import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Hacemos un mock del cliente de supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabaseClient';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiamos el mock de window.location.replace que configuramos en vitest.setup.ts
    (window.location.replace as any).mockClear();
  });

  it('debería inicializar con loading falso y sin errores', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar un error si los campos están vacíos', async () => {
    const { result } = renderHook(() => useAuth());
    
    let success = true;
    await act(async () => {
      success = await result.current.login('', '', '/garita');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Por favor complete su correo y contraseña.');
    expect(result.current.loading).toBe(false);
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('debería manejar un error de autenticación desde Supabase', async () => {
    // Simulamos que supabase devuelve un error
    (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
      error: { message: 'Credenciales inválidas' },
    });

    const { result } = renderHook(() => useAuth());

    let success = true;
    await act(async () => {
      success = await result.current.login('test@cgel.com', 'badpassword', '/garita');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Credenciales inválidas');
    expect(result.current.loading).toBe(false);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@cgel.com',
      password: 'badpassword',
    });
  });

  it('debería redirigir al usuario cuando la autenticación es exitosa', async () => {
    // Simulamos login exitoso
    (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
      error: null,
      data: { user: { id: '123' } },
    });

    const { result } = renderHook(() => useAuth());

    let success = false;
    await act(async () => {
      success = await result.current.login('admin@cgel.com', '123456', '/visitas');
    });

    expect(success).toBe(true);
    // Verificamos que se haya intentado redirigir a /visitas
    expect(window.location.replace).toHaveBeenCalledWith('/visitas');
  });
});
