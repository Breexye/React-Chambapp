import { useRouter } from 'expo-router';

export interface Worker {
  id: string;
  name: string;
  profession: string;
  profile_image?: string;
}

export const useContactWorker = () => {
  const router = useRouter();

  const contactarTrabajador = (worker: Worker) => {
    router.push({
      pathname: '/(tabs)/chats/conversations',
      params: {
        userId: worker.id,
        name: worker.name,
        profession: worker.profession,
        profile_image: worker.profile_image ?? '',
      },
    });
  };

  return { contactarTrabajador };
};