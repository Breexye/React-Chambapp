// app/(tabs)/Perfil/workerProfile.tsx
// app/(tabs)/Perfil/worker.tsx (o workerProfile.tsx dependiendo de tu estructura de carpetas)
import { stylesGeneral } from '@/constants/stylesGeneral';
import { stylesWorker as styles } from '@/constants/stylesWorker';
import { reviewService } from '@/services/reviewService';
import { storageService } from '@/services/storageService';
import { userService } from '@/services/userService';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ReviewUI {
  id: string;
  userName: string;
  userImage?: string | null;
  date: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}

export default function WorkerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [workerData, setWorkerData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
  const [aboutText, setAboutText] = useState<string>('');
  const [isEditingAbout, setIsEditingAbout] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewUI[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [params?.workerId]);

  useEffect(() => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalSum / reviews.length;
    setAverageRating(Math.round(avg * 10) / 10);
  }, [reviews]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuario no autenticado");
      
      setCurrentUserId(user.id);
      const targetWorkerId = (params?.workerId as string) || user.id;
      const own = targetWorkerId === user.id;
      setIsOwnProfile(own);

      const data = await userService.getUserById(targetWorkerId);
      setWorkerData(data);
      if (data?.profile_image) setProfileImage(data.profile_image);
      setAboutText(data?.about || 'Sin descripción.');

      // Verificar si ya es favorito
      if (!own) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('client_id', user.id)
          .eq('worker_id', targetWorkerId)
          .maybeSingle();

        setIsFavorite(!!favData);
      }

      const { data: rawReviews, error: revError } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, image_url, created_at, client_id,
          users:client_id (name, profile_image)
        `)
        .eq('worker_id', targetWorkerId)
        .order('created_at', { ascending: false });

      if (revError) throw revError;

      const formattedReviews: ReviewUI[] = (rawReviews || []).map((rev: any) => ({
        id: rev.id,
        userName: rev.users?.name || 'Usuario',
        userImage: rev.users?.profile_image || null,
        date: new Date(rev.created_at).toLocaleDateString(),
        rating: rev.rating,
        comment: rev.comment,
        imageUrl: rev.image_url,
      }));

      setReviews(formattedReviews);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUserId || !params?.workerId) {
      console.log("Faltan datos de sesión o workerId:", { currentUserId, workerId: params?.workerId });
      return;
    }
    const targetWorkerId = params.workerId as string;
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('client_id', currentUserId)
          .eq('worker_id', targetWorkerId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ client_id: currentUserId, worker_id: targetWorkerId }]);

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error: any) {
      console.error("Error detallado en favoritos:", error);
      Alert.alert('Error', 'No se pudo actualizar favoritos: ' + (error.message || error));
    }
  };

  const handlePickProfileImage = async () => {
    if (!isOwnProfile || !currentUserId) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      try {
        Alert.alert('Actualizando...', 'Subiendo nueva foto de perfil.');
        const publicUrl = await storageService.uploadImage(imageUri, 'profiles', currentUserId);
        await userService.updateWorkerProfile(currentUserId, { profile_image: publicUrl });
        Alert.alert('Éxito!', 'Foto de perfil actualizada.');
      } catch (error: any) {
        Alert.alert('Error', 'No se pudo guardar la foto.');
        setProfileImage(workerData?.profile_image || 'https://via.placeholder.com/150');
      }
    }
  };

  const handleSaveAbout = async () => {
    if (!isOwnProfile || !currentUserId) return;
    setIsEditingAbout(false);
    if (aboutText === workerData?.about) return;
    try {
      await userService.updateWorkerProfile(currentUserId, { about: aboutText });
      setWorkerData({ ...workerData, about: aboutText });
      Alert.alert('Éxito!', 'Descripción actualizada.');
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo guardar la descripción.');
      setAboutText(workerData?.about || '');
    }
  };

  const handlePickReviewImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setReviewImage(result.assets[0].uri);
    }
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      Alert.alert('Atención', 'Por favor escribe un comentario.');
      return;
    }
    if (!currentUserId || !workerData) return;

    try {
      setIsSubmittingReview(true);
      let uploadedImageUrl: string | null = null;
      if (reviewImage) {
        uploadedImageUrl = await storageService.uploadImage(
          reviewImage,
          'reviews',
          `${currentUserId}_${Date.now()}`
        );
      }

      await reviewService.createReview({
        worker_id: workerData.id || params?.workerId,
        client_id: currentUserId,
        rating: newRating,
        comment: newComment,
        image_url: uploadedImageUrl || undefined,
      });

      Alert.alert('Éxito!', 'Tu opinión ha sido publicada.');
      setNewComment('');
      setReviewImage(null);
      setNewRating(5);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo enviar la reseña.');
    } finally {
      setIsSubmittingReview(false);
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
        {/* Ruta corregida para evitar el error de ruta no encontrada */}
        <TouchableOpacity 
          style={stylesGeneral.headerIconBtn} 
          onPress={() => router.push({ pathname: '/(tabs)/Perfil/workerProfile', params: { workerId: currentUserId } })}
        >
          <Ionicons name="person-circle-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={stylesGeneral.subHeaderRow}>
        <Text style={stylesGeneral.subHeaderText}>
          {isOwnProfile ? 'Mi Perfil Profesional' : 'Perfil del Trabajador'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={stylesGeneral.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            {isOwnProfile && (
              <TouchableOpacity style={styles.cameraBadge} onPress={handlePickProfileImage}>
                <Ionicons name="camera" size={18} color="#0d1b2a" />
              </TouchableOpacity>
            )}
          </View>

          {/* Botón de Favorito */}
          {!isOwnProfile && (
            <TouchableOpacity onPress={toggleFavorite} style={{ marginTop: 10 }}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={30}
                color={isFavorite ? '#ff4d6d' : '#00b4d8'}
              />
            </TouchableOpacity>
          )}

          <Text style={styles.workerName}>{workerData?.name || 'Cargando...'}</Text>
          <Text style={styles.workerProfession}>
            {workerData?.job_title || 'Profesional independiente'}
          </Text>

          <View style={stylesGeneral.ratingRow}>
            <Ionicons name="star" size={18} color="#ffd166" />
            <Text style={stylesGeneral.ratingText}>
              {reviews.length === 0 ? 'Nuevo' : averageRating.toFixed(1)} ({reviews.length} opiniones)
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acerca de mí</Text>
        </View>

        <View style={styles.aboutBox}>
          {isOwnProfile && isEditingAbout ? (
            <TextInput
              style={styles.aboutInput}
              value={aboutText}
              onChangeText={setAboutText}
              multiline
              autoFocus
              maxLength={200}
            />
          ) : (
            <Text style={styles.aboutText}>{aboutText}</Text>
          )}
          {isOwnProfile && (
            <TouchableOpacity
              onPress={isEditingAbout ? handleSaveAbout : () => setIsEditingAbout(true)}
            >
              <Ionicons
                name={isEditingAbout ? 'checkmark-circle' : 'pencil'}
                size={18}
                color="#00b4d8"
              />
            </TouchableOpacity>
          )}
        </View>

        {!isOwnProfile && (
          <View style={{ marginTop: 24, marginBottom: 12 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Escribe tu opinión</Text>
            </View>
            <View style={styles.reviewForm}>
              <Text style={{ fontSize: 13, color: '#495057', marginBottom: 6, fontWeight: '600' }}>
                Calificación:
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <Ionicons
                      name={star <= newRating ? 'star' : 'star-outline'}
                      size={26}
                      color="#ffd166"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.inputComment}
                placeholder="¿Cómo fue tu experiencia con este trabajador?"
                placeholderTextColor="#adb5bd"
                multiline
                value={newComment}
                onChangeText={setNewComment}
              />

              {reviewImage && (
                <View style={{ position: 'relative', marginVertical: 8 }}>
                  <Image source={{ uri: reviewImage }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: 12,
                      padding: 4,
                    }}
                    onPress={() => setReviewImage(null)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                  onPress={handlePickReviewImage}
                >
                  <Ionicons name="image-outline" size={20} color="#00b4d8" />
                  <Text style={{ color: '#00b4d8', fontSize: 13, fontWeight: '600' }}>Agregar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#00b4d8',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                  onPress={handleSubmitReview}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Enviar Opinión</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isOwnProfile ? 'Mis Opiniones Recibidas' : 'Opiniones del Trabajador'}
          </Text>
        </View>

        {reviews.length === 0 ? (
          <Text style={styles.emptyReviewsText}>Aún no hay reseñas registradas.</Text>
        ) : (
          reviews.map((item) => (
            <View key={item.id} style={stylesGeneral.reviewCard}>
              <View style={stylesGeneral.reviewHeader}>
                <View style={stylesGeneral.reviewerInfo}>
                  {item.userImage ? (
                    <Image source={{ uri: item.userImage }} style={styles.reviewerAvatarImage} />
                  ) : (
                    <View style={stylesGeneral.avatarPlaceholder}>
                      <Text style={stylesGeneral.avatarLetter}>{item.userName.charAt(0)}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={stylesGeneral.reviewerName}>{item.userName}</Text>
                    <Text style={stylesGeneral.reviewDate}>{item.date}</Text>
                  </View>
                </View>
                <View style={stylesGeneral.ratingBadge}>
                  <Ionicons name="star" size={12} color="#ffd166" />
                  <Text style={stylesGeneral.ratingBadgeText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={stylesGeneral.reviewComment}>{item.comment}</Text>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={stylesGeneral.reviewAttachedImage} resizeMode="cover" />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}