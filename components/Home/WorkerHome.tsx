import { ThemedText } from '@/components/themed-text';
import { stylesHome } from '@/constants/stylesHome';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Switch, View } from 'react-native';

export default function WorkerHome() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Datos del trabajador
  const [workerName, setWorkerName] = useState('Cargando...');
  const [jobTitle, setJobTitle] = useState('Especialista');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Métricas y reseñas
  const [rating, setRating] = useState(5.0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

  // 1. Cargar datos del perfil del trabajador autenticado al iniciar
  useEffect(() => {
    fetchWorkerData();
  }, []);

  // 2. Manejar la ubicación en tiempo real cuando cambia la disponibilidad
  useEffect(() => {
    let locationSubscription: any = null;

    const handleLocationTracking = async () => {
      if (isAvailable) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación para aparecer en el mapa de los clientes.');
          setIsAvailable(false);
          return;
        }

        // Obtener ubicación actual y actualizar en Supabase
        const currentLocation = await Location.getCurrentPositionAsync({});
        await updateWorkerLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);

        // Opcional: Escuchar cambios de posición en tiempo real si se desplaza
        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 50 },
          (loc) => {
            updateWorkerLocation(loc.coords.latitude, loc.coords.longitude);
          }
        );
      } else {
        updateAvailabilityStatus(false);
      }
    };

    handleLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isAvailable]);

  const fetchWorkerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener info de la tabla users
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (userData) {
        setWorkerName(userData.name || 'Trabajador');
        setJobTitle(userData.job_title || 'Profesional Independiente');
        setProfileImage(userData.profile_image || null);
        
        setRating(userData.rating || 5.0);
        setTotalJobs(userData.total_jobs || 0);
      }

    } catch (error: any) {
      console.error("Error cargando perfil del trabajador:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkerLocation = async (latitude: number, longitude: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('users').update({
        latitude,
        longitude,
        is_available: true,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
    } catch (error) {
      console.error("Error actualizando ubicación:", error);
    }
  };

  const updateAvailabilityStatus = async (status: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('users').update({
        is_available: status,
      }).eq('id', user.id);
    } catch (error) {
      console.error("Error actualizando estatus:", error);
    }
  };

  return (
    <ScrollView style={stylesHome.landingScrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        
        {/* Cabecera Profesional con Datos a la Izquierda y Foto de Perfil en la parte Superior Derecha */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#FFF', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
          {/* Información del Trabajador (Nombre y Ocupación) */}
          <View style={{ flex: 1, marginRight: 15 }}>
            <ThemedText style={{ fontSize: 12, color: '#0077B6', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 }}>Panel de Profesional</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#03045E' }} numberOfLines={1}>{workerName}</ThemedText>
            <ThemedText style={{ fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 2 }} numberOfLines={1}>{jobTitle}</ThemedText>
          </View>

          {/* Foto de Perfil ubicada en la parte superior derecha */}
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#0077B6' }} 
            />
          ) : (
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0077B6' }}>
              <Ionicons name="person" size={28} color="#0077B6" />
            </View>
          )}
        </View>

        {/* Tarjeta de Estatus de Disponibilidad */}
        <View style={stylesHome.statusCard}>
          <View style={stylesHome.statusInfo}>
            <View style={[stylesHome.statusDot, { backgroundColor: isAvailable ? '#2ecc71' : '#95a5a6' }]} />
            <View>
              <ThemedText style={stylesHome.statusTitle}>
                {isAvailable ? 'Disponible para clientes' : 'En pausa / Descansando'}
              </ThemedText>
              <ThemedText style={stylesHome.statusSubtitle}>
                {isAvailable ? 'Estás visible en el radar y mapa' : 'No recibirás nuevas alertas'}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#bdc3c7', true: '#a9dfbf' }}
            thumbColor={isAvailable ? '#2ecc71' : '#f1f2f6'}
          />
        </View>

        {/* Resumen rápido de métricas (Calificación y Trabajos sumados) */}
        <View style={stylesHome.statsRow}>
          <View style={stylesHome.statCard}>
            <Ionicons name="star" size={24} color="#f1c40f" />
            <ThemedText style={stylesHome.statNumber}>{rating.toFixed(1)}</ThemedText>
            <ThemedText style={stylesHome.statLabel}>Calificación Final</ThemedText>
          </View>
          <View style={stylesHome.statCard}>
            <Ionicons name="briefcase-outline" size={24} color="#00B4D8" />
            <ThemedText style={stylesHome.statNumber}>{totalJobs}</ThemedText>
            <ThemedText style={stylesHome.statLabel}>Trabajos hechos</ThemedText>
          </View>
        </View>

        {/* Sección de Reseñas de Clientes */}
        <View style={{ marginTop: 20, backgroundColor: '#FFF', padding: 15, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#03045E' }}>Reseñas de Clientes</ThemedText>
            <Ionicons name="chatbubbles-outline" size={20} color="#0077B6" />
          </View>
          
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingVertical: 10 }}>
                <ThemedText style={{ fontWeight: 'bold', fontSize: 13, color: '#1F2937' }}>{rev.client_name}</ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{rev.comment}</ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', paddingVertical: 10 }}>
              Aún no tienes reseñas registradas. ¡Realiza tu primer trabajo para recibir opiniones!
            </ThemedText>
          )}
        </View>

        {/* Estado Vacío: Esperando Solicitudes */}
        <View style={[stylesHome.emptyContainer, { marginTop: 20 }]}>
          <View style={stylesHome.iconCircle}>
            <Ionicons name="notifications-outline" size={48} color="#0077B6" />
          </View>
          <ThemedText style={stylesHome.emptyTitle}>Esperando solicitudes</ThemedText>
          <ThemedText style={stylesHome.emptyText}>
            Aún no tienes solicitudes pendientes. Mantén tu estatus activo y tu ubicación encendida para aparecer en el mapa de los clientes cercanos.
          </ThemedText>
        </View>

      </View>

      {/* Pie de página institucional */}
      <View style={stylesHome.footer}>
        <View style={stylesHome.footerLogoRow}>
          <Ionicons name="briefcase" size={22} color="white" />
          <ThemedText style={stylesHome.footerBrandName}>ChambApp</ThemedText>
        </View>
        <ThemedText style={stylesHome.footerText}>Conectando talento con oportunidades.</ThemedText>
        <ThemedText style={stylesHome.footerCopyright}>© 2026 ChambApp. Todos los derechos reservados.</ThemedText>
      </View>
    </ScrollView>
  );
}