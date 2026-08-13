// services/reviewService.ts
import { supabase } from '../src/supabase';

export const reviewService = {
  /**
   * Obtiene reseñas de un trabajador específico (Ordenadas por fecha descendente)
   */
  getReviewsByWorker: async (workerId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Inserta una nueva reseña (Debe llamarse después de subir la imagen si existe)
   * (Guarda cambios en tabla public.reviews)
   */
  createReview: async (reviewData: { worker_id: string; client_id: string; rating: number; comment: string; image_url?: string }) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};