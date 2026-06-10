import { supabase } from './supabaseClient';

export async function uploadEvidence(folder: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error, data } = await supabase.storage
    .from('cgel-evidencias')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('cgel-evidencias')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
