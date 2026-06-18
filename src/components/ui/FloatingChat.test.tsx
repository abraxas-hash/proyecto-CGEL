import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FloatingChat } from './FloatingChat';
import { usePathname } from 'next/navigation';

// Mock de Next.js router
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('FloatingChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simular que estamos en el dashboard (donde sí se debe renderizar)
    (usePathname as any).mockReturnValue('/');
    
    // Mock de scrollIntoView (jsdom no lo soporta por defecto)
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock de fetch para simular la respuesta de la API de chat
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ content: 'Respuesta simulada de la IA' }),
      })
    ) as any;
  });

  it('no se renderiza en la página de /login', () => {
    (usePathname as any).mockReturnValue('/login');
    const { container } = render(<FloatingChat />);
    expect(container.firstChild).toBeNull();
  });

  it('no se renderiza en las páginas de /garita', () => {
    (usePathname as any).mockReturnValue('/garita/repartidores');
    const { container } = render(<FloatingChat />);
    expect(container.firstChild).toBeNull();
  });

  it('se renderiza en modo cerrado por defecto en el dashboard', () => {
    (usePathname as any).mockReturnValue('/');
    render(<FloatingChat />);
    
    // El botón lateral debe existir (tiene el texto NEXUS AI vertical)
    expect(screen.getByText('Nexus AI')).toBeInTheDocument();
    
    // La ventana del chat no debe estar abierta (buscamos el texto de bienvenida)
    expect(screen.queryByText('Hola, soy Nexus AI')).not.toBeInTheDocument();
  });

  it('abre la ventana de chat al hacer clic en el botón lateral', () => {
    render(<FloatingChat />);
    
    // Hacer clic en el botón para abrir
    const toggleButton = screen.getByRole('button', { name: /Abrir chat de ayuda/i });
    fireEvent.click(toggleButton);
    
    // Debe aparecer la ventana del chat con los textos iniciales
    expect(screen.getByText('Hola, soy Nexus AI')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pregunta o busca un DNI...')).toBeInTheDocument();
  });

  it('permite escribir y enviar un mensaje, recibiendo respuesta de la IA', async () => {
    render(<FloatingChat />);
    
    // Abrir el chat
    fireEvent.click(screen.getByRole('button', { name: /Abrir chat de ayuda/i }));
    
    // Encontrar el campo de texto
    const input = screen.getByPlaceholderText('Pregunta o busca un DNI...');
    
    // Escribir un mensaje
    fireEvent.change(input, { target: { value: 'DNI 12345678' } });
    expect(input).toHaveValue('DNI 12345678');
    
    // Enviar el mensaje presionando Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Validar que el mensaje del usuario aparece en pantalla
    await waitFor(() => {
      expect(screen.getByText('DNI 12345678')).toBeInTheDocument();
    });
    
    // Validar que se llamó al backend
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Validar que la respuesta de la IA aparece en pantalla
    await waitFor(() => {
      expect(screen.getByText('Respuesta simulada de la IA')).toBeInTheDocument();
    });
  });
});
