// components/WorkerCard.tsx
import { supabase } from '@/src/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Worker {
  id: string;
  name: string;
  job_title: string;
  calificacion: number;
  resenas: number;
  disponible: boolean;
  job_description: string;
  profile_image: string;
}

interface WorkerCardProps {
  worker: Worker;
  onPress?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onPress }) => {
  const router = useRouter();

  const [calificacion, setCalificacion] = useState<number>(worker.calificacion ?? 5.0);
  const [resenasCount, setResenasCount] = useState<number>(worker.resenas ?? 0);

  useEffect(() => {
    const fetchWorkerReviews = async () => {
      if (!worker.id) return;
      try {
        const { data: reviewsData, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('worker_id', worker.id);

        if (!error && reviewsData && reviewsData.length > 0) {
          const total = reviewsData.length;
          const suma = reviewsData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          const promedio = Number((suma / total).toFixed(1));

          setCalificacion(promedio);
          setResenasCount(total);
        } else if (reviewsData && reviewsData.length === 0) {
          setCalificacion(5.0);
          setResenasCount(0);
        }
      } catch (err) {
        console.error("Error al obtener reseñas en WorkerCard:", err);
      }
    };

    fetchWorkerReviews();
  }, [worker.id]);

  const handleViewProfile = async () => {
    try {
      // Validamos si hay una sesión activa en Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // Si no está registrado / no hay sesión, lo mandamos a iniciar sesión
        router.push('/login');
        return;
      }

      // Si ya tiene sesión, lo mandamos al perfil del trabajador
      router.push(`/(tabs)/Perfil/workerProfile?workerId=${worker.id}`);
    } catch (err) {
      console.error("Error al verificar sesión:", err);
      router.push('/login');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Image 
          source={{ uri: worker.profile_image || 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{worker.name}</Text>
          <Text style={styles.oficio}>{worker.job_title}</Text>

          <View style={styles.detailsRow}>
            <Text style={styles.rating}>
              ⭐ {calificacion} <Text style={styles.resenas}>({resenasCount} reseñas)</Text>
            </Text>
            {worker.disponible && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Disponible</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.descripcion} numberOfLines={2}>
        {worker.job_description || 'Sin descripción disponible.'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btnSecundario} onPress={handleViewProfile} activeOpacity={0.7}>
          <Text style={styles.btnTextSecundario}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1931',
    marginBottom: 2,
  },
  oficio: {
    fontSize: 14,
    color: '#0085FF',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  resenas: {
    fontWeight: '400',
    color: '#666',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '600',
  },
  descripcion: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 12,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  btnSecundario: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A1931',
  },
  btnTextSecundario: {
    color: '#0A1931',
    fontWeight: '600',
    fontSize: 13,
  },
});