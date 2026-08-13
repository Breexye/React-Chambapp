// app/(tabs)/favorites.tsx
import { stylesGeneral } from '@/constants/stylesGeneral';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface FavoriteWorker {
  id: string | number;
  worker_id: string;
  name: string;
  job_title: string;
  profile_image: string | null;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteWorker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuario no autenticado");

      const { data: favsData, error: favsError } = await supabase
        .from('favorites')
        .select('id, worker_id')
        .eq('client_id', user.id);

      if (favsError) throw favsError;

      if (!favsData || favsData.length === 0) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      const formattedList: FavoriteWorker[] = [];
      for (const fav of favsData) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, job_title, profile_image')
          .eq('id', fav.worker_id)
          .single();

        if (!userError && userData) {
          formattedList.push({
            id: fav.id,
            worker_id: fav.worker_id,
            name: userData.name || 'Profesional',
            job_title: userData.job_title || 'Independiente',
            profile_image: userData.profile_image || null,
          });
        }
      }

      setFavorites(formattedList);
    } catch (error: any) {
      console.error("Error al cargar favoritos:", error.message);
      Alert.alert('Error', 'No se pudieron cargar tus favoritos.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (workerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('client_id', user.id)
        .eq('worker_id', workerId);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.worker_id !== workerId));
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error.message);
      Alert.alert('Error', 'No se pudo eliminar de favoritos.');
    }
  };

  if (isLoading) {
    return (
      <View style={[stylesGeneral.container, stylesGeneral.center]}>
        <ActivityIndicator size="large" color="#00b4d8" />
      </View>
    );
  }

  return (
    <View style={stylesGeneral.container}>
      <View style={stylesGeneral.navBarContainer}>
        <TouchableOpacity style={stylesGeneral.headerIconBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={stylesGeneral.logoText}>ChambApp</Text>
        <TouchableOpacity style={stylesGeneral.headerIconBtn}>
          <Ionicons name="heart" size={26} color="#ff4d6d" />
        </TouchableOpacity>
      </View>

      <View style={stylesGeneral.subHeaderRow}>
        <Text style={stylesGeneral.subHeaderText}>Mis Trabajadores Favoritos</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={[stylesGeneral.center, { flex: 1, paddingHorizontal: 20 }]}>
          <Ionicons name="heart-dislike-outline" size={64} color="#adb5bd" />
          <Text style={{ color: '#adb5bd', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
            Aún no tienes trabajadores guardados en favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={() => router.push({ pathname: '/(tabs)/Perfil/workerProfile', params: { workerId: item.worker_id } })}
            >
              <Image
                source={{ uri: item.profile_image || 'https://via.placeholder.com/150' }}
                style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0d1b2a' }}>{item.name}</Text>
                <Text style={{ fontSize: 13, color: '#6c757d', marginTop: 2 }}>{item.job_title}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.worker_id)} style={{ padding: 8 }}>
                <Ionicons name="heart" size={24} color="#ff4d6d" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}