import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

export async function uploadEvidence(folder: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  let finalFile = file;

  // Solo comprimimos si es imagen
  if (file.type.startsWith('image/')) {
    const options = {
      maxSizeMB: 0.15, // 150 KB
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      initialQuality: 0.8
    };
    try {
      finalFile = await imageCompression(file, options);
    } catch (err) {
      console.warn("No se pudo comprimir la imagen, subiendo original", err);
    }
  }

  const { error, data } = await supabase.storage
    .from('cgel-evidencias')
    .upload(filePath, finalFile, {
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
