import { Colors } from '@/constants/colors';
import { stylesHome } from '@/constants/stylesHome';
import { useClientHome } from '@/hooks/use-ClienteHome';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Datos de oficios populares
const POPULAR_TRADES = [
  { id: '1', name: 'Plomería', count: '1 trabajos', icon: 'water-outline' },
  { id: '2', name: 'Electricista', count: '1 trabajos', icon: 'flash-outline' },
  { id: '3', name: 'Carpintería', count: '0 trabajos', icon: 'hammer-outline' },
  { id: '4', name: 'Pintura', count: '0 trabajos', icon: 'color-palette-outline' },
  { id: '5', name: 'Albañilería', count: '0 trabajos', icon: 'construct-outline' },
  { id: '6', name: 'Jardinería', count: '0 trabajos', icon: 'leaf-outline' },
];

// Importación condicional protegida para móviles
let NativeMapView: any = null;
if (Platform.OS !== 'web') {
  NativeMapView = require('react-native-maps');
}

export default function ClientHome() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    userLocation,
    loadingLocation,
    selectedWorker,
    setSelectedWorker,
    nearbyWorkers,
    CHIHUAHUA_DEFAULT,
    GEOFENCE_RADIUS_METERS,
  } = useClientHome();

  // Renderizado del Mapa Web
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

          var workers = ${JSON.stringify(nearbyWorkers)};
          workers.forEach(function(w) {
            L.marker([w.latitude, w.longitude]).addTo(map)
              .bindPopup('<b>' + w.name + '</b><br>' + w.profession + ' (' + w.rating + ')');
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

  // Renderizado del Mapa Nativo (Android / iOS)
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
        {nearbyWorkers.map((worker) => (
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
      {/* SECCIÓN BUSCADOR */}
      <View style={stylesHome.searchHeroBackground}>
        <View style={stylesHome.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginLeft: 12 }} />
          <TextInput
            style={stylesHome.searchInput}
            placeholder="Buscar plomero, electricista..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={stylesHome.searchButton}>
            <Text style={stylesHome.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN OFICIOS POPULARES */}
      <View style={stylesHome.tradesSection}>
        <Text style={stylesHome.tradesTitle}>Oficios Populares</Text>
        <View style={stylesHome.tradesGrid}>
          {POPULAR_TRADES.map((trade) => (
            <TouchableOpacity key={trade.id} style={stylesHome.tradeCard} activeOpacity={0.7}>
              <View style={stylesHome.tradeIconContainer}>
                <Ionicons name={trade.icon as any} size={26} color="#0088CC" />
              </View>
              <Text style={stylesHome.tradeName}>{trade.name}</Text>
              <Text style={stylesHome.tradeCount}>{trade.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECCIÓN DEL MAPA */}
      <View style={stylesHome.mapSection}>
        <View style={stylesHome.mapContainer}>
          {loadingLocation ? (
            <ActivityIndicator size="large" color={Colors.light.primary} style={{ flex: 1 }} />
          ) : Platform.OS === 'web' ? (
            renderWebMap()
          ) : (
            renderNativeMap()
          )}

          {/* TARJETA FLOTANTE DE VISTA PREVIA DEL TRABAJADOR */}
          {selectedWorker && (
            <View style={stylesHome.calloutCard}>
              <TouchableOpacity
                style={stylesHome.closeCalloutBtn}
                onPress={() => setSelectedWorker(null)}
              >
                <Text style={stylesHome.closeCalloutText}>✕</Text>
              </TouchableOpacity>

              <View style={stylesHome.calloutAvatar}>
                <Text style={stylesHome.calloutAvatarText}>
                  {selectedWorker.name.charAt(0)}
                </Text>
              </View>

              <View style={stylesHome.calloutInfo}>
                <Text style={stylesHome.calloutName}>{selectedWorker.name}</Text>
                <Text style={stylesHome.calloutProfession}>
                  {selectedWorker.profession} • {selectedWorker.rating}
                </Text>
                <View style={stylesHome.calloutBadge}>
                  <Text style={stylesHome.calloutBadgeText}>
                    A {selectedWorker.distanceKm} km de ti
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={stylesHome.calloutButton}>
                <Text style={stylesHome.calloutButtonText}>Ver Perfil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}