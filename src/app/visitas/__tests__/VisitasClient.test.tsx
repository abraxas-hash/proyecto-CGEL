import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VisitasClient from '../VisitasClient';
import { vi } from 'vitest';

// Datos mockeados
const mockVisitas = [
  {
    id: 1,
    fecha: new Date().toISOString().split('T')[0],
    nombre_completo: 'Juan Perez',
    dni_ce: '12345678',
    empresa: 'Constructora XYZ',
    referencia_visita: 'Planta 1',
    pase_devuelto_salida: false
  },
  {
    id: 2,
    fecha: new Date().toISOString().split('T')[0],
    nombre_completo: 'Maria Gomez',
    dni_ce: '87654321',
    empresa: 'Logistica ABC',
    referencia_visita: 'Almacen Principal',
    pase_devuelto_salida: true
  }
];

describe('VisitasClient', () => {
  it('renderiza la lista de visitas inicial para la fecha seleccionada', () => {
    render(<VisitasClient initialVisitas={mockVisitas} fichasDiarias={[]} />);
    
    // Al cargar por defecto selecciona la fecha de hoy, así que debería mostrar las visitas mockeadas
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
  });

  it('filtra visitas basado en el autocompletado (búsqueda)', async () => {
    render(<VisitasClient initialVisitas={mockVisitas} fichasDiarias={[]} />);

    const searchInput = screen.getByPlaceholderText('Buscar en la fecha...');
    
    // Buscar por DNI
    fireEvent.change(searchInput, { target: { value: '12345' } });
    
    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
      expect(screen.queryByText('Maria Gomez')).not.toBeInTheDocument();
    });

    // Buscar por Nombre
    fireEvent.change(searchInput, { target: { value: 'Maria' } });

    await waitFor(() => {
      expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument();
      expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    });
  });
});
