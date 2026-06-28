'use server';

import { createAdminClient } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function updateRecordTime(table: string, id: string, column: string, timeValue: string) {
  try {
    const supabase = createAdminClient();
    
    // Ensure the time format is valid if provided
    if (timeValue && !/^\d{2}:\d{2}$/.test(timeValue) && !/^\d{2}:\d{2}:\d{2}$/.test(timeValue)) {
      throw new Error('Formato de hora inválido');
    }
    
    const valueToSet = timeValue || null;

    const { data, error } = await supabase
      .from(table)
      .update({ [column]: valueToSet })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate main paths just in case
    revalidatePath('/repartidores');
    revalidatePath('/proveedores');
    revalidatePath('/visitas');
    revalidatePath('/contratistas');
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al actualizar tiempo:', error);
    return { success: false, error: 'No se pudo actualizar el tiempo' };
  }
}
