import { ThemedText } from '@/components/themed-text';
import { stylesHome as styles } from '@/constants/stylesHome';
import { workerProfileStyles as profileStyles } from '@/constants/workerProfileStyles'; 
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, TouchableOpacity, View } from 'react-native';

export default function WorkerProfileScreen() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'perfil-w', title: 'Mi Perfil Profesional', icon: 'briefcase-outline' as const },
    { id: 'chats-w', title: 'Mis Mensajes / Chats', icon: 'chatbubbles-outline' as const },
    { id: 'calificaciones', title: 'Mis Calificaciones', icon: 'star-outline' as const },
    { id: 'historial-w', title: 'Historial de Trabajos', icon: 'document-text-outline' as const },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('No hay una sesión activa.');
      }

      const { data, error: dbError } = await supabase
        .from('users')
        .select('name, email, phone, role, job_title, job_description, profile_image')
        .eq('id', user.id)
        .single();

      if (dbError) throw dbError;

      setUserData(data);
    } catch (error: any) {
      console.error('Error cargando perfil:', error);
      Alert.alert('Error', 'No se pudieron obtener los datos de tu perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await supabase.auth.signOut();
    router.replace('/login' as any);
  };

  if (loading) {
    return (
      <View style={[styles.appContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00B4D8" />
        <ThemedText style={{ color: '#FFFFFF', marginTop: 10 }}>Cargando perfil...</ThemedText>
      </View>
    );
  }

  const defaultAvatar = 'https://static.vecteezy.com/system/resources/previews/015/272/327/non_2x/construction-worker-icon-person-profile-avatar-with-hard-helmet-and-jacket-builder-man-in-a-helmet-icon-illustration-vector.jpg';

  return (
    <View style={styles.appContainer}>
      {/* ENCABEZADO SUPERIOR CON MENÚ HAMBURGUESA */}
      <View style={styles.globalHeaderTopRow}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerIconBtn}>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ThemedText style={styles.globalHeaderLogo}>ChambApp</ThemedText>

        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.globalWelcomeRow}>
        <ThemedText style={styles.globalWelcomeText}>Perfil del Trabajador</ThemedText>
      </View>

      {/* CONTENIDO DEL PERFIL */}
      <ScrollView style={profileStyles.container} showsVerticalScrollIndicator={false}>
        <View style={profileStyles.profileHeaderContainer}>
          <Image 
            source={{ uri: userData?.profile_image || defaultAvatar }} 
            style={profileStyles.avatar} 
          />
          <ThemedText style={profileStyles.workerName}>
            {userData?.name || 'Nombre no disponible'}
          </ThemedText>
          <ThemedText style={profileStyles.workerProfession}>
            {userData?.job_title || 'Especialidad no registrada'}
          </ThemedText>
          
          <View style={profileStyles.ratingRow}>
            <Ionicons name="star" size={18} color="#FACC15" />
            <ThemedText style={profileStyles.ratingText}> 4.8 </ThemedText>
            <ThemedText style={profileStyles.reviewsText}>(34 opiniones)</ThemedText>
          </View>
        </View>

        <View style={profileStyles.actionButtonsRow}>
          <TouchableOpacity style={profileStyles.contactButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <ThemedText style={profileStyles.buttonText}>Contactar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={profileStyles.hireButton}>
            <Ionicons name="briefcase-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <ThemedText style={profileStyles.buttonText}>Contratar Servicio</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={profileStyles.sectionContainer}>
          <ThemedText style={profileStyles.sectionTitle}>Acerca de mí</ThemedText>
          <View style={profileStyles.cardBox}>
            <ThemedText style={profileStyles.cardText}>
              {userData?.job_description || 'Sin descripción disponible.'}
            </ThemedText>
          </View>
        </View>

        <View style={profileStyles.sectionContainer}>
          <View style={profileStyles.reviewsHeaderRow}>
            <ThemedText style={profileStyles.sectionTitle}>Opiniones y Trabajos Realizados</ThemedText>
            <TouchableOpacity>
              <ThemedText style={profileStyles.writeReviewText}>Escribir reseña</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={profileStyles.reviewCard}>
            <View style={profileStyles.reviewUserRow}>
              <View style={profileStyles.smallAvatar}>
                <ThemedText style={profileStyles.smallAvatarText}>M</ThemedText>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <ThemedText style={profileStyles.reviewUserName}>María Eugenia Soto</ThemedText>
                <ThemedText style={profileStyles.reviewDate}>Ayer</ThemedText>
              </View>
              <View style={profileStyles.miniRatingBadge}>
                <Ionicons name="star" size={14} color="#FACC15" />
                <ThemedText style={profileStyles.miniRatingText}> 5</ThemedText>
              </View>
            </View>
            <ThemedText style={profileStyles.reviewComment}>
              Excelente servicio, muy puntual y dejó todo limpio después de realizar el trabajo.
            </ThemedText>
            <Image 
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqDxHItx-SXJy7Sa7zl15mS5oOFXF4wIMpZ302DCeyx-buh5hgnBOCLbM&s=10' }} 
              style={profileStyles.reviewImage} 
            />
          </View>
        </View>
      </ScrollView>

      {/* MODAL DEL MENÚ DESPLEGABLE */}
      <Modal transparent={true} visible={isMenuOpen} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeOverlay} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />
          
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <ThemedText style={styles.menuHeaderTitle}>Panel de Trabajo</ThemedText>
            </View>

            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem} 
                onPress={() => {
                  setIsMenuOpen(false);
                  if (item.id === 'perfil-w') {
                    router.push('/(tabs)/Perfil/workerProfile' as any);
                  } else if (item.id === 'chats-w') {
                    router.push('/chats' as any);
                  } else if (item.id === 'calificaciones') {
                    router.push('/ratings' as any);
                  } else if (item.id === 'historial-w') {
                    router.push('/history' as any);
                  }
                }}
              >
                <Ionicons name={item.icon} size={22} color="#00B4D8" style={{ marginRight: 15 }} />
                <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#FF4D4D" style={{ marginRight: 15 }} />
              <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}