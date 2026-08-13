// hooks/messages/use-chat-partner.ts
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/supabase';

interface ChatPartner {
  id: string;
  name: string;
  profession: string;
  profile_image: string;
}

export const useChatPartner = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, name, profession, profile_image')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener datos del trabajador:', error.message);
      }

      setPartner(data);
      setLoading(false);
    };

    fetchPartner();
  }, [userId]);

  return { otherUserId: userId, partner, loading };
};