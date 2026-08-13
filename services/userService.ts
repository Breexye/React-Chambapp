// services/userService.ts
import { supabase } from '../src/supabase';

export const userService = {
  /**
   * Obtiene datos completos de un usuario (tabla public.users) por ID
   */
  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Actualiza datos específicos del perfil del TRABAJADOR
   * (Guarda cambios en tabla public.users)
   */
  updateWorkerProfile: async (userId: string, updates: { about?: string; profile_image?: string }) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Actualiza datos del perfil del CLIENTE (En tabla public.users y Supabase Auth si aplica)
   */
  updateClientProfile: async (userId: string, updates: { name?: string; phone?: string; profile_image?: string; email?: string }) => {
    // 1. Crear un objeto de actualización filtrando solo los campos de public.users que vienen definidos
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.profile_image !== undefined) dbUpdates.profile_image = updates.profile_image;

    // Solo ejecutamos el update si hay campos para actualizar en la tabla users
    if (Object.keys(dbUpdates).length > 0) {
      const { error: publicError } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', userId);

      if (publicError) throw publicError;
    }

    // 2. Si se cambió el email, actualizar Supabase Auth (requiere confirmación)
    if (updates.email) {
      const { error: authError } = await supabase.auth.updateUser({ email: updates.email });
      if (authError) throw authError;
    }
    
    return true;
  },
};