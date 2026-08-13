// hooks/message-hooks/use-chat.ts

import { useAuth } from '@/src/authContext';
import { supabase } from '@/src/supabase';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface Chat {
  userId: string;
  name: string;
  profession: string;
  profile_image?: string;
  ultimoMensaje: string;
  time: string;
}

export const useChats = () => {

  const { userId } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchChats = useCallback(async () => {

    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {

      setLoading(true);

      const {
        data: mensajes,
        error: mensajesError,
      } = await supabase
        .from('messages')
        .select(`
          id,
          id_emisor,
          id_receptor,
          message,
          time
        `)
        .or(
          `id_emisor.eq.${userId},id_receptor.eq.${userId}`
        )
        .order('time', {
          ascending: false,
        });


      if (mensajesError) {

        console.error(
          'Error al obtener mensajes:',
          mensajesError.message
        );

        setChats([]);

        return;
      }


      const conversaciones = new Map<
        string,
        {
          message: string;
          time: string;
        }
      >();


      (mensajes ?? []).forEach((mensaje) => {

        const otroUsuario =
          mensaje.id_emisor === userId
            ? mensaje.id_receptor
            : mensaje.id_emisor;


        if (!conversaciones.has(otroUsuario)) {

          conversaciones.set(
            otroUsuario,
            {
              message: mensaje.message,
              time: mensaje.time,
            }
          );

        }

      });


      const userIds =
        Array.from(conversaciones.keys());


      if (userIds.length === 0) {

        setChats([]);

        return;
      }


      const {
        data: usuarios,
        error: usuariosError,
      } = await supabase
        .from('users')
        .select(`
          id,
          name,
          profession,
          profile_image
        `)
        .in('id', userIds);


      if (usuariosError) {

        console.error(
          'Error al obtener usuarios:',
          usuariosError.message
        );

        setChats([]);

        return;
      }


      const listaChats: Chat[] =
        userIds.map((id) => {

          const usuario =
            usuarios?.find(
              (u) => u.id === id
            );

          const conversacion =
            conversaciones.get(id);


          return {

            userId: id,

            name:
              usuario?.name ??
              'Usuario',

            profession:
              usuario?.profession ??
              'Sin profesión',

            profile_image:
              usuario?.profile_image ??
              '',

            ultimoMensaje:
              conversacion?.message ??
              '',

            time:
              conversacion?.time
                ? new Date(
                    conversacion.time
                  ).toLocaleTimeString(
                    [],
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )
                : '',

          };

        });


      setChats(listaChats);

    } catch (error) {

      console.error(
        'Error inesperado:',
        error
      );

      setChats([]);

    } finally {

      setLoading(false);

    }

  }, [userId]);


  useEffect(() => {

    fetchChats();

  }, [fetchChats]);


  return {
    chats,
    loading,
    refetch: fetchChats,
  };

};