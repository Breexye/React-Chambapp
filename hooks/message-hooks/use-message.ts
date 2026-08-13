// hooks/message-hooks/use-message.ts

import { useAuth } from '@/src/authContext';
import { supabase } from '@/src/supabase';
import { useCallback, useEffect, useState } from 'react';

export interface Mensaje {
  id: string;
  id_emisor: string;
  id_receptor: string;
  message: string;
  time: string;
}

export const useConversation = (otherUserId: string) => {
  const { userId } = useAuth();

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener mensajes
  const fetchMensajes = useCallback(async () => {
    if (!userId || !otherUserId) {
      setMensajes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(id_emisor.eq.${userId},id_receptor.eq.${otherUserId}),and(id_emisor.eq.${otherUserId},id_receptor.eq.${userId})`
        )
        .order('time', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Error al obtener mensajes:',
          error.message
        );

        setMensajes([]);
        return;
      }

      setMensajes(data ?? []);

    } catch (error) {
      console.error(
        'Error inesperado:',
        error
      );

      setMensajes([]);

    } finally {
      setLoading(false);
    }

  }, [userId, otherUserId]);

  // Enviar mensaje
  const enviarMensaje = useCallback(
    async (texto: string) => {

      if (!userId || !otherUserId) {
        console.error(
          'Falta usuario emisor o receptor'
        );
        return;
      }

      const mensaje = texto.trim();

      if (!mensaje) return;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          id_emisor: userId,
          id_receptor: otherUserId,
          message: mensaje,
        })
        .select()
        .single();

      if (error) {
        console.error(
          'Error al enviar mensaje:',
          error.message
        );
        return;
      }

      if (data) {
        setMensajes((prev) => [
          ...prev,
          data,
        ]);
      }

    },
    [userId, otherUserId]
  );

  // Cargar mensajes al entrar
  useEffect(() => {
    fetchMensajes();
  }, [fetchMensajes]);

  return {
    mensajes,
    loading,
    enviarMensaje,
    refetch: fetchMensajes,
  };
};