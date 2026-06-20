'use server';

import { createAdminClient } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function marcarTiempoRepartidor(id: string, columna: 'hora_llegada' | 'hora_inicio_carga' | 'hora_fin_carga') {
  try {
    const supabase = createAdminClient();
    
    // Obtener la hora actual en formato peruano
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const horaActual = formatter.format(now);

    const { data, error } = await supabase
      .from('registro_diario_repartidores')
      .update({ [columna]: horaActual })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/repartidores');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al actualizar tiempo:', error);
    return { success: false, error: 'No se pudo actualizar el tiempo' };
  }
}
