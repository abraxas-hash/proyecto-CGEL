import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FichaDiariaForm } from '../FichaDiariaForm';
import { supabase } from '@/lib/supabaseClient';
import { vi } from 'vitest';

// Mock del ImageUpload ya que usa APIs de cámara que no funcionan en JSDOM
vi.mock('@/components/ui/ImageUpload', () => ({
  ImageUpload: ({ onImageCaptured }: any) => (
    <div data-testid="mock-image-upload">
      <button 
        data-testid="mock-capture-btn"
        onClick={() => onImageCaptured(new File([''], 'test.jpg', { type: 'image/jpeg' }))}
      >
        Capturar
      </button>
    </div>
  )
}));

describe('FichaDiariaForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(<FichaDiariaForm tipoFicha="VISITAS" />);
    expect(screen.getByText('Foto de Ficha de visitas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar ficha/i })).toBeDisabled();
  });

  it('permite subir foto y enviar el formulario', async () => {
    render(<FichaDiariaForm tipoFicha="VISITAS" />);

    // 1. Botón Guardar debe estar deshabilitado al inicio
    const submitBtn = screen.getByRole('button', { name: /guardar ficha/i });
    expect(submitBtn).toBeDisabled();

    // 2. Simulamos la captura de foto
    fireEvent.click(screen.getByTestId('mock-capture-btn'));

    // 3. Agregamos observaciones
    const obsTextarea = screen.getByPlaceholderText('Algún detalle adicional...');
    fireEvent.change(obsTextarea, { target: { value: 'Todo normal' } });

    // 4. Botón debe habilitarse
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    // 5. Enviamos form
    fireEvent.click(submitBtn);

    // 6. Verificamos que se haya llamado a Supabase
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('fichas_diarias');
      expect(supabase.from('fichas_diarias').insert).toHaveBeenCalled();
      
      const insertCall = (supabase.from('fichas_diarias').insert as any).mock.calls[0][0];
      expect(insertCall.turno).toBe('MAÑANA');
      expect(insertCall.url_foto).toBe('http://mock.url/path.jpg');
      expect(JSON.parse(insertCall.observaciones).tipo).toBe('VISITAS');
      expect(JSON.parse(insertCall.observaciones).nota).toBe('Todo normal');
    });

    // 7. Verifica mensaje de éxito
    expect(screen.getByText('¡Ficha Subida!')).toBeInTheDocument();
  });
});
