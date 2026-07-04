import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Worker, WorkerCard } from '../../components/WorkerCard';
import db from '../../db.json';

// Reemplazar esto con la URL real de la API/Backend (ej. en desarrollo local suele ser http://10.0.2.2:5000/api o tu IP)
const API_URL = 'https://tu-api-chambapp.com/api/trabajadores';

export default function ExploreScreen() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // 1. Cacha el oficio que mandas desde el Home
  const params = useLocalSearchParams<{ category?: string }>();
  
  // 2. Guarda el oficio seleccionado (por defecto es 'Todos')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(params.category || 'Todos');

  // 3. Si cambias de oficio en el Home, este efecto actualiza el estado
  useEffect(() => {
    if (params.category) {
      setCategoriaSeleccionada(params.category);
    }
  }, [params.category]);

  // 4. AQUÍ DECLARAMOS LA VARIABLE QUE LE FALTABA A TU FLATLIST:
  const trabajadoresFiltrados = categoriaSeleccionada === 'Todos'
    ? workers
    : workers.filter(w => w.oficio === categoriaSeleccionada);

  // Función para obtener los trabajadores desde el backend
 const fetchWorkers = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // 1. Simulamos un retraso de 1 segundo para que alcances a ver la animación de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. En lugar de buscar en internet con "fetch(API_URL)", le asignamos los datos de tu db.json
      setWorkers(db.trabajadores);
    } catch (err: any) {
      setError('Ocurrió un error al cargar los datos locales.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  //
  // Se ejecuta automáticamente al montar la pantalla
  useEffect(() => {
    fetchWorkers();
  }, []);

  // Función para cuando el usuario desliza hacia abajo para refrescar manualmente
  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkers();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trabajadores Disponibles</Text>
        <Text style={styles.subtitle}>Conectado a la base de datos en tiempo real</Text>
      </View>

      {/* Pantalla de carga mientras responde la API */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0085FF" />
          <Text style={styles.loadingText}>Buscando chambeadores...</Text>
        </View>
      ) : error ? (
        /* Manejo de errores por si el servidor se cae */
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.retryText} onPress={fetchWorkers}>Tocá aquí para reintentar</Text>
        </View>
      ) : (
        /* Lista conectada a los datos reales */
        <FlatList
          data={trabajadoresFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <WorkerCard 
              worker={item} 
              onPress={() => console.log('Abrir perfil de:', item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0085FF']} />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No hay trabajadores registrados por el momento.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1931',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  retryText: {
    color: '#0085FF',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 15,
  },
});
