'use server';

import { createAdminClient } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function changeUserRole(userId: string, newRole: string) {
  try {
    const supabase = createAdminClient();
    
    // Usamos upsert por si el perfil no existe
    const { error } = await supabase
      .from('perfiles')
      .upsert({ id: userId, rol: newRole });
      
    if (error) {
      console.error('Error updating role:', error);
      return { success: false, error: error.message };
    }
    
    // Revalidar para que cambie la interfaz
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Server action error:', error);
    return { success: false, error: error.message };
  }
}
