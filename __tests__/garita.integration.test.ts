/**
 * Tests de integración para todas las secciones de Garita.
 * Usa los nombres de tabla y columnas REALES de Supabase.
 * Ejecutar con: npm test
 */

import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, afterAll } from 'vitest';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TODAY      = new Date().toISOString().split('T')[0];
const NOW_TIME   = new Date().toTimeString().split(' ')[0];
const TAG        = 'TEST_AUTO'; // Marcador para limpiar al final

// ─────────────────────────────────────────────────────────────────────────────
describe('🚪 GARITA — Tests de integración con Supabase', () => {

  // ── 1. REPARTIDORES ────────────────────────────────────────────────────────
  // Tabla real: registro_diario_repartidores
  describe('🚚 Repartidores → registro_diario_repartidores', () => {
    it('registra un repartidor correctamente', async () => {
      const { data, error } = await supabase
        .from('registro_diario_repartidores')
        .insert({
          fecha:               TODAY,
          turno:               'DIURNO',
          empresa_abreviatura: TAG,
          placa:               'TT-TEST-01',
          conductor_apellido:  'PRUEBA CONDUCTOR',
          sctr_ok:             true,
          epp_ok:              true,
          entrada_1:           NOW_TIME,
          observaciones:       null,
        })
        .select('id, placa, empresa_abreviatura')
        .single();

      console.log('  INSERT:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.placa).toBe('TT-TEST-01');
      expect(data?.empresa_abreviatura).toBe(TAG);
    });

    it('lee el repartidor registrado', async () => {
      const { data, error } = await supabase
        .from('registro_diario_repartidores')
        .select('placa, conductor_apellido')
        .eq('empresa_abreviatura', TAG)
        .eq('fecha', TODAY)
        .limit(1)
        .single();

      console.log('  READ:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.placa).toBe('TT-TEST-01');
    });
  });

  // ── 2. VISITAS ─────────────────────────────────────────────────────────────
  // Tabla real: registro_visitas  | columnas: visitante_nombre, empresa, motivo, autorizado_por, epp_ok
  describe('👥 Visitas → registro_visitas', () => {
    it('registra una visita correctamente', async () => {
      const { data, error } = await supabase
        .from('registro_visitas')
        .insert({
          fecha:            TODAY,
          hora_ingreso:     NOW_TIME,
          dni:              '22222222',
          visitante_nombre: 'PRUEBA VISITA',
          empresa:          TAG,
          motivo:           'TEST AUTOMATIZADO',
          autorizado_por:   'SISTEMA',
          epp_ok:           true,
          observaciones:    null,
        })
        .select('id, visitante_nombre, empresa')
        .single();

      console.log('  INSERT:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.visitante_nombre).toBe('PRUEBA VISITA');
      expect(data?.empresa).toBe(TAG);
    });

    it('lee la visita registrada', async () => {
      const { data, error } = await supabase
        .from('registro_visitas')
        .select('visitante_nombre, motivo')
        .eq('empresa', TAG)
        .eq('fecha', TODAY)
        .limit(1)
        .single();

      console.log('  READ:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.motivo).toBe('TEST AUTOMATIZADO');
    });
  });

  // ── 3. PROVEEDORES ─────────────────────────────────────────────────────────
  // Tabla real: registro_proveedores_carga ✅ (ya funcionó en tests anteriores)
  describe('🏭 Proveedores → registro_proveedores_carga', () => {
    it('registra un proveedor correctamente', async () => {
      const { data, error } = await supabase
        .from('registro_proveedores_carga')
        .insert({
          fecha:             TODAY,
          hora_llegada:      NOW_TIME,
          empresa:           TAG,
          placa:             'TT-PROV-02',
          conductor_nombre:  'PRUEBA PROVEEDOR',
          dni:               '33333333',
          tipo_carga:        'CARGA DE PRUEBA',
          sctr_ok:           true,
          epp_ok:            true,
          observaciones:     null,
        })
        .select('id, placa, empresa')
        .single();

      console.log('  INSERT:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.placa).toBe('TT-PROV-02');
    });

    it('lee el proveedor registrado', async () => {
      const { data, error } = await supabase
        .from('registro_proveedores_carga')
        .select('empresa, placa, conductor_nombre')
        .eq('empresa', TAG)
        .eq('fecha', TODAY)
        .limit(1)
        .single();

      console.log('  READ:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.conductor_nombre).toBe('PRUEBA PROVEEDOR');
    });
  });

  // ── 4. CONTRATISTAS ────────────────────────────────────────────────────────
  // Tabla real: registro_contratistas | columnas: empresa, supervisor, actividad, hora_inicio, hora_fin
  describe('🪖 Contratistas → registro_contratistas', () => {
    it('registra un contratista correctamente', async () => {
      const { data, error } = await supabase
        .from('registro_contratistas')
        .insert({
          fecha:       TODAY,
          empresa:     TAG,
          supervisor:  'JEFE PRUEBA',
          actividad:   'TEST AUTOMATIZADO DE SISTEMAS',
          hora_inicio: NOW_TIME,
          observaciones: 'Registro de prueba',
        })
        .select('id, empresa, actividad')
        .single();

      console.log('  INSERT:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.empresa).toBe(TAG);
      expect(data?.actividad).toBe('TEST AUTOMATIZADO DE SISTEMAS');
    });

    it('lee el contratista registrado', async () => {
      const { data, error } = await supabase
        .from('registro_contratistas')
        .select('empresa, supervisor, actividad')
        .eq('empresa', TAG)
        .eq('fecha', TODAY)
        .limit(1)
        .single();

      console.log('  READ:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.supervisor).toBe('JEFE PRUEBA');
    });
  });

  // ── 5. RETIRO DE PRODUCTOS ─────────────────────────────────────────────────
  // Tabla real: registro_retiro_clientes ✅ (ya funcionó en tests anteriores)
  describe('🛍️ Retiro de Productos → registro_retiro_clientes', () => {
    it('registra un retiro de cliente correctamente', async () => {
      const { data, error } = await supabase
        .from('registro_retiro_clientes')
        .insert({
          fecha:          TODAY,
          hora_ingreso:   NOW_TIME,
          dni:            '44444444',
          nombre_cliente: 'PRUEBA CLIENTE',
          orden_venta:    `OV-${TAG}-001`,
          observaciones:  'Test automatizado',
        })
        .select('id, nombre_cliente, orden_venta')
        .single();

      console.log('  INSERT:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.nombre_cliente).toBe('PRUEBA CLIENTE');
      expect(data?.orden_venta).toBe(`OV-${TAG}-001`);
    });

    it('verifica autocompletado por DNI', async () => {
      const { data, error } = await supabase
        .from('registro_retiro_clientes')
        .select('nombre_cliente')
        .eq('dni', '44444444')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('  DNI LOOKUP:', data, '| ERROR:', error);
      expect(error).toBeNull();
      expect(data?.nombre_cliente).toBe('PRUEBA CLIENTE');
    });
  });

  // ── LIMPIEZA FINAL ─────────────────────────────────────────────────────────
  afterAll(async () => {
    console.log('\n🧹 Eliminando registros de prueba...');
    await Promise.all([
      supabase.from('registro_diario_repartidores').delete().eq('empresa_abreviatura', TAG),
      supabase.from('registro_visitas').delete().eq('empresa', TAG),
      supabase.from('registro_proveedores_carga').delete().eq('empresa', TAG),
      supabase.from('registro_contratistas').delete().eq('empresa', TAG),
      supabase.from('registro_retiro_clientes').delete().like('orden_venta', `%${TAG}%`),
    ]);
    console.log('🧹 ¡Limpieza completada!');
  });
});
