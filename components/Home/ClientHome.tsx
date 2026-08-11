import { WorkerCard } from '@/components/WorkerCard';
import { Colors } from '@/constants/colors';
import { stylesHome } from '@/constants/stylesHome';
import { useClientHome } from '@/hooks/use-ClienteHome';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [workersCount, setWorkersCount] = useState<{ [key: string]: number }>({});
  const [allWorkers, setAllWorkers] = useState<any[]>([]);
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

      if (error) return;

      if (data) {
        const counts: { [key: string]: number } = {};
        POPULAR_TRADES.forEach(trade => {
          const targetName = trade.name.toLowerCase();
          
          counts[trade.name] = data.filter(w => {
            if (w.role !== 'trabajador') return false;
            const userJob = (w.job_title || w.profession || '').toLowerCase().trim();
            const target = targetName.trim();

            if (target === 'fotógrafo') {
              return userJob === 'fotógrafo' || userJob === 'fotografo' || userJob.includes('foto');
            }
            return userJob.includes(target.slice(0, 4));
          }).length;
        });

        setWorkersCount(counts);

        const formattedWorkers = data
          .filter(w => w.role === 'trabajador')
          .map(w => ({
            id: w.id,
            name: w.name,
            profession: w.job_title || w.profession || 'Profesional',
            job_description: w.job_description || 'Sin descripción disponible',
            rating: w.rating || 5,
            reviewsCount: w.reviewsCount || 0,
            status: w.status || 'Disponible',
            profile_image: w.profile_image,
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
    const professionMatch = worker.profession?.toLowerCase().includes(query);
    return nameMatch || professionMatch;
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
              .bindPopup('<b>' + w.name + '</b><br>' + w.profession);
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
            description={worker.profession}
            onPress={() => setSelectedWorker(worker)}
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
                worker={worker}
                onPress={() => setSelectedWorker(worker)}
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
        <View style={stylesHome.mapContainer}>
          {loadingLocation ? (
            <ActivityIndicator size="large" color={Colors.light.primary} style={{ flex: 1 }} />
          ) : Platform.OS === 'web' ? (
            renderWebMap()
          ) : (
            renderNativeMap()
          )}
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