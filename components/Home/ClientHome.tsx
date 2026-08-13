// app/(tabs)/index.tsx
import { WorkerCard } from '@/components/WorkerCard';
import { Colors } from '@/constants/colors';
import { stylesHome } from '@/constants/stylesHome';
import { useClientHome } from '@/hooks/use-ClienteHome';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface ClientWorker {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  job_title: string;
  job_description: string;
  profile_image?: string;
  ine_front_image?: string;
  ine_back_image?: string;
  calificacion: number;
  resenas: number;
  disponible: boolean;
  latitude: number;
  longitude: number;
}

const POPULAR_TRADES = [
  { id: '1', name: 'Plomería', icon: 'water-outline' },
  { id: '2', name: 'Electricista', icon: 'flash-outline' },
  { id: '3', name: 'Carpintería', icon: 'hammer-outline' },
  { id: '4', name: 'Fotógrafo', icon: 'camera-outline' },
  { id: '5', name: 'Albañilería', icon: 'construct-outline' },
  { id: '6', name: 'Jardinería', icon: 'leaf-outline' },
];

let NativeMapView: any = null;
if (Platform.OS !== 'web') {
  NativeMapView = require('react-native-maps');
}

interface ClientHomeProps {
  userName?: string;
}

export default function ClientHome({ userName }: ClientHomeProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [workersCount, setWorkersCount] = useState<{ [key: string]: number }>({});
  const [allWorkers, setAllWorkers] = useState<ClientWorker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  const {
    userLocation,
    loadingLocation,
    selectedWorker,
    setSelectedWorker,
    CHIHUAHUA_DEFAULT,
    GEOFENCE_RADIUS_METERS,
  } = useClientHome();

  useEffect(() => {
    fetchWorkersData();
  }, []);

  const fetchWorkersData = async () => {
    try {
      setLoadingWorkers(true);
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        return;
      }

      if (data) {
        // Sinónimos actualizados adaptados a cómo guardas la columna 'profession' en Supabase
        const synonyms: { [key: string]: string[] } = {
          'Plomería': ['plomero', 'fontanero', 'plomeria'],
          'Electricista': ['electricista', 'electrico', 'electricidad'],
          'Carpintería': ['carpintero', 'carpinteria'],
          'Fotógrafo': ['fotografo', 'fotografa', 'foto', 'fotografia'],
          'Albañilería': ['albañil', 'albanil', 'constructor', 'albanileria'],
          'Jardinería': ['jardinero', 'jardineria', 'jardin'],
        };

        const counts: { [key: string]: number } = {};
        POPULAR_TRADES.forEach(trade => {
          counts[trade.name] = data.filter((w: any) => {
            if (w.role !== 'trabajador') return false;
            // Leemos de 'profession' que es la columna real de tu base de datos
            const userProfession = (w.profession || w.job_title || '').toLowerCase().trim();
            const tradeName = trade.name.toLowerCase();

            if (userProfession.includes(tradeName.slice(0, 4))) return true;

            if (synonyms[trade.name] && synonyms[trade.name].some(s => userProfession.includes(s))) {
              return true;
            }

            return false;
          }).length;
        });

        setWorkersCount(counts);

        const formattedWorkers: ClientWorker[] = data
          .filter((w: any) => w.role === 'trabajador')
          .map((w: any) => ({
            id: w.id,
            name: w.name || 'Sin nombre',
            email: w.email || '',
            phone: w.phone || '',
            role: w.role || 'trabajador',
            job_title: w.profession || w.job_title || 'Profesional', // Mapeo correcto desde 'profession'
            job_description: w.job_description || w.about || 'Sin descripción disponible',
            profile_image: w.profile_image || null,
            ine_front_image: w.ine_front_image || null,
            ine_back_image: w.ine_back_image || null,
            calificacion: w.rating || 5,
            resenas: w.reviewsCount || 0,
            disponible: true,
            latitude: w.latitude || CHIHUAHUA_DEFAULT.latitude,
            longitude: w.longitude || CHIHUAHUA_DEFAULT.longitude,
          }));

        setAllWorkers(formattedWorkers);
      }
    } catch (e) {
      // Error silencioso
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleSelectTrade = (tradeName: string) => {
    setSearchQuery(tradeName);
  };

  const filteredWorkers = allWorkers.filter((worker) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = worker.name?.toLowerCase().includes(query);
    const jobTitleMatch = worker.job_title?.toLowerCase().includes(query);
    const descriptionMatch = worker.job_description?.toLowerCase().includes(query);
    return nameMatch || jobTitleMatch || descriptionMatch;
  });

  const renderWebMap = () => {
    const leafletHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html, #map { height: 100%; margin: 0; padding: 0; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${CHIHUAHUA_DEFAULT.latitude}, ${CHIHUAHUA_DEFAULT.longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          
          L.circle([${CHIHUAHUA_DEFAULT.latitude}, ${CHIHUAHUA_DEFAULT.longitude}], {
            color: '#00B4D8', fillColor: '#00B4D8', fillOpacity: 0.15, radius: 5000
          }).addTo(map);

          var workers = ${JSON.stringify(filteredWorkers)};
          workers.forEach(function(w) {
            L.marker([w.latitude, w.longitude]).addTo(map)
              .bindPopup('<b>' + w.name + '</b><br>' + w.job_title);
          });
        </script>
      </body>
      </html>
    `;

    return (
      <iframe
        title="Mapa Web Chihuahua"
        srcDoc={leafletHtml}
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 20 }}
      />
    );
  };

  const renderNativeMap = () => {
    if (!NativeMapView) return null;
    const MapView = NativeMapView.default || NativeMapView;
    const { Marker, Circle, PROVIDER_DEFAULT } = NativeMapView;

    return (
      <MapView
        provider={PROVIDER_DEFAULT}
        style={stylesHome.map}
        initialRegion={{
          latitude: userLocation?.latitude || CHIHUAHUA_DEFAULT.latitude,
          longitude: userLocation?.longitude || CHIHUAHUA_DEFAULT.longitude,
          latitudeDelta: CHIHUAHUA_DEFAULT.latitudeDelta,
          longitudeDelta: CHIHUAHUA_DEFAULT.longitudeDelta,
        }}
        showsUserLocation={true}
        onPress={() => setSelectedWorker(null)}
      >
        {userLocation && (
          <Circle
            center={userLocation}
            radius={GEOFENCE_RADIUS_METERS}
            fillColor="rgba(0, 180, 216, 0.15)"
            strokeColor={Colors.light.primary}
            strokeWidth={2}
          />
        )}
        {filteredWorkers.map((worker) => (
          <Marker
            key={worker.id}
            coordinate={{ latitude: worker.latitude, longitude: worker.longitude }}
            title={worker.name}
            description={worker.job_title}
            onPress={(e: any) => {
              e.stopPropagation?.();
              setSelectedWorker(worker as any);
            }}
          />
        ))}
      </MapView>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={stylesHome.clientMainLayout} 
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 5 }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Ionicons name="location-outline" size={14} color="#0088CC" />
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Chihuahua, Chih.
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '400' }}>Bienvenido de nuevo,</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#03045E', marginTop: 2 }}>
              {userName || 'Cliente'}
            </Text>
          </View>
        </View>
      </View>

      <View style={stylesHome.searchHeroBackground}>
        <View style={stylesHome.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginLeft: 12 }} />
          <TextInput
            style={stylesHome.searchInput}
            placeholder="Buscar plomero, fotógrafo..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity style={stylesHome.searchButton} onPress={() => setSearchQuery('')}>
              <Text style={stylesHome.searchButtonText}>Limpiar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={stylesHome.searchButton} onPress={() => {}}>
              <Text style={stylesHome.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.trim().length > 0 && (
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#03045E', marginBottom: 12 }}>
            Resultados para "{searchQuery}"
          </Text>
          {loadingWorkers ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <WorkerCard 
                key={worker.id}
                worker={worker as any}
                onPress={() => setSelectedWorker(worker as any)}
              />
            ))
          ) : (
            <Text style={{ color: '#64748B', fontStyle: 'italic', marginBottom: 10 }}>
              No se encontraron trabajadores con este criterio.
            </Text>
          )}
        </View>
      )}

      <View style={stylesHome.tradesSection}>
        <Text style={stylesHome.tradesTitle}>Oficios Populares</Text>
        <View style={stylesHome.tradesGrid}>
          {POPULAR_TRADES.map((trade) => {
            const count = workersCount[trade.name] || 0;
            return (
              <TouchableOpacity 
                key={trade.id} 
                style={[
                  stylesHome.tradeCard, 
                  searchQuery.toLowerCase() === trade.name.toLowerCase() && { borderColor: '#00B4D8', borderWidth: 2 }
                ]} 
                activeOpacity={0.7}
                onPress={() => handleSelectTrade(trade.name)}
              >
                <View style={stylesHome.tradeIconContainer}>
                  <Ionicons name={trade.icon as any} size={26} color="#0088CC" />
                </View>
                <Text style={stylesHome.tradeName}>{trade.name}</Text>
                <Text style={stylesHome.tradeCount}>
                  {count} {count === 1 ? 'trabajador' : 'trabajadores'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={stylesHome.mapSection}>
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#03045E' }}>
            Trabajadores Cerca de ti
          </Text>
          <Text style={{ fontSize: 13, color: '#64748B' }}>
            Toca un marcador en el mapa para ver sus opciones de contacto
          </Text>
        </View>

        <View style={[stylesHome.mapContainer, { position: 'relative' }]}>
          {loadingLocation ? (
            <ActivityIndicator size="large" color={Colors.light.primary} style={{ flex: 1 }} />
          ) : Platform.OS === 'web' ? (
            renderWebMap()
          ) : (
            renderNativeMap()
          )}

          {selectedWorker && (() => {
            const worker = selectedWorker as any;
            return (
              <View style={{
                position: 'absolute',
                bottom: 15,
                left: 15,
                right: 15,
                backgroundColor: 'white',
                borderRadius: 14,
                padding: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
                borderWidth: 1,
                borderColor: '#E2E8F0'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    {worker.profile_image ? (
                      <Image source={{ uri: worker.profile_image }} style={{ width: 45, height: 45, borderRadius: 22.5 }} />
                    ) : (
                      <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="person" size={22} color="#0077B6" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#03045E' }} numberOfLines={1}>
                        {worker.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: '#0088CC', fontWeight: '600' }}>
                        {worker.job_title}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedWorker(null)}>
                    <Ionicons name="close-circle" size={22} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }} numberOfLines={2}>
                  {worker.job_description}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#E0F2FE', paddingVertical: 9, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }}
                    onPress={() => {
                      alert(`Contactando a ${worker.name} al tel: ${worker.phone || 'No disponible'}`);
                    }}
                  >
                    <Text style={{ color: '#0077B6', fontWeight: 'bold', fontSize: 13 }}>Contactar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#007776', paddingVertical: 9, borderRadius: 8, alignItems: 'center' }}
                    onPress={() => {
                      router.push(`/(tabs)/Perfil/workerProfile?workerId=${worker.id}`);
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Ver Perfil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })()}
        </View>
      </View>

      <View style={stylesHome.footer}>
        <View style={stylesHome.footerLogoRow}>
          <Ionicons name="briefcase" size={22} color="white" />
          <Text style={stylesHome.footerBrandName}>ChambApp</Text>
        </View>
        <Text style={stylesHome.footerText}>Conectando talento con oportunidades.</Text>
        <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 10 }}>© 2026 ChambApp. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}