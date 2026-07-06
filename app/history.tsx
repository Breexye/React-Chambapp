import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ServiceCard, ServiceJob } from '../components/ServiceCard';

// Datos simulados con la estructura perfecta para tu base de datos PostgreSQL posterior
const TRABAJOS_MOCK: ServiceJob[] = [
  {
    id: '101',
    trabajador: 'Carlos Mendoza',
    oficio: 'Plomería',
    fecha: 'Hoy, 02:30 PM',
    status: 'En camino',
    costo: '$350 MXN'
  },
  {
    id: '102',
    trabajador: 'Sofía Ramos',
    oficio: 'Electricista',
    fecha: 'Ayer, 11:00 AM',
    status: 'En proceso',
    costo: '$450 MXN'
  },
  {
    id: '103',
    trabajador: 'Martín Islas',
    oficio: 'Carpintería',
    fecha: '28 Jun 2026',
    status: 'Completado',
    costo: '$1,200 MXN'
  },
  {
    id: '104',
    trabajador: 'Elena Gómez',
    oficio: 'Pintura',
    fecha: '15 Jun 2026',
    status: 'Cancelado',
    costo: '$0 MXN'
  }
];

export default function HistoryScreen() {
  const [jobs] = useState<ServiceJob[]>(TRABAJOS_MOCK);

  // Separamos los trabajos en dos listas usando filtros rápidos de JS
  const activos = jobs.filter(j => j.status === 'En camino' || j.status === 'En proceso');
  const pasados = jobs.filter(j => j.status === 'Completado' || j.status === 'Cancelado');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Servicios</Text>
        <Text style={styles.subtitle}>Historial y seguimiento de contratos</Text>
      </View>

      <FlatList
        data={[{ key: 'activos', data: activos, title: 'Servicios Activos' }, { key: 'pasados', data: pasados, title: 'Historial Pasado' }]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.length === 0 ? (
              <Text style={styles.emptyText}>No tienes servicios en esta sección.</Text>
            ) : (
              item.data.map(job => (
                <ServiceCard key={job.id} job={job} />
              ))
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
    marginBottom: 10,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 16,
    marginVertical: 8,
    fontStyle: 'italic',
  },
});