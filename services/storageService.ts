// services/storageService.ts
import * as FileSystem from 'expo-file-system';
import { supabase } from '../src/supabase';

export const storageService = {
  /**
   * Sube una imagen a Supabase Storage usando el bucket 'documents' que ya tienes creado
   */
  uploadImage: async (uri: string, folder: string, userId: string): Promise<string> => {
    try {
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`; // Ejemplo: profiles/id_timestamp.jpg

      const file = new FileSystem.File(uri);
      const arrayBuffer = await file.bytes();

      // Apuntamos al bucket 'documents' que es el que tienes activo en Supabase
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath);
      return publicUrlData.publicUrl;

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  },
};