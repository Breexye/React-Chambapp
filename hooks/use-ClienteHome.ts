import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

const CHIHUAHUA_DEFAULT = {
  latitude: 28.6353,
  longitude: -106.0889,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MOCK_WORKERS = [
  { id: 'w1', name: 'Carlos Mendoza', profession: 'Plomero Certificado', rating: '4.9 ⭐', latitude: 28.6380, longitude: -106.0850 },
  { id: 'w2', name: 'Ana Lucía Gómez', profession: 'Electricista Residencial', rating: '4.8 ⭐', latitude: 28.6300, longitude: -106.0920 },
  { id: 'w3', name: 'Roberto Fierro', profession: 'Carpintero', rating: '5.0 ⭐', latitude: 28.6420, longitude: -106.0780 },
  { id: 'w4', name: 'Marcos Delgado', profession: 'Pintor', rating: '4.7 ⭐', latitude: 28.6390, longitude: -106.0810 },
];

export const POPULAR_TRADES = [
  { id: '1', name: 'Plomería', count: '1 trabajos', icon: 'water-outline' },
  { id: '2', name: 'Electricista', count: '1 trabajos', icon: 'flash-outline' },
  { id: '3', name: 'Carpintería', count: '0 trabajos', icon: 'hammer-outline' },
  { id: '4', name: 'Pintura', count: '0 trabajos', icon: 'color-palette-outline' },
  { id: '5', name: 'Albañilería', count: '0 trabajos', icon: 'construct-outline' },
  { id: '6', name: 'Jardinería', count: '0 trabajos', icon: 'leaf-outline' },
];

export interface Worker {
  id: string;
  name: string;
  profession: string;
  rating: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

export function useClientHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [nearbyWorkers, setNearbyWorkers] = useState<Worker[]>([]);

  const GEOFENCE_RADIUS_METERS = 5000;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  useEffect(() => {
    (async () => {
      let coords = { latitude: CHIHUAHUA_DEFAULT.latitude, longitude: CHIHUAHUA_DEFAULT.longitude };

      if (Platform.OS !== 'web') {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          }
        } catch (e) {
          console.log('Error GPS');
        }
      }

      setUserLocation(coords);
      setLoadingLocation(false);

      const filtered = MOCK_WORKERS.map((worker) => {
        const dist = calculateDistance(coords.latitude, coords.longitude, worker.latitude, worker.longitude);
        return { ...worker, distanceKm: dist };
      }).filter((worker) => (worker.distanceKm ?? 0) <= GEOFENCE_RADIUS_METERS / 1000);

      setNearbyWorkers(filtered);
    })();
  }, []);

  const handleSearch = () => {
    console.log('Buscando:', searchQuery);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    userLocation,
    loadingLocation,
    selectedWorker,
    setSelectedWorker,
    nearbyWorkers,
    CHIHUAHUA_DEFAULT,
    GEOFENCE_RADIUS_METERS,
  };
}