import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ServiceJob {
  id: string;
  trabajador: string;
  oficio: string;
  fecha: string;
  status: 'En camino' | 'En proceso' | 'Completado' | 'Cancelado';
  costo?: string;
}

interface ServiceCardProps {
  job: ServiceJob;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ job }) => {
  // Asignamos un color según el estatus del trabajo
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'En camino': return { bg: '#FFF9C4', text: '#F57F17' }; // Amarillo
      case 'En proceso': return { bg: '#E3F2FD', text: '#0D47A1' }; // Azul
      case 'Completado': return { bg: '#E8F5E9', text: '#2E7D32' }; // Verde
      default: return { bg: '#FFEBEE', text: '#C62828' }; // Rojo/Cancelado
    }
  };

  const statusColor = getStatusStyle(job.status);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.trabajador}>{job.trabajador}</Text>
          <Text style={styles.oficio}>{job.oficio}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.badgeText, { color: statusColor.text }]}>{job.status}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.fecha}>📅 {job.fecha}</Text>
        {job.costo && <Text style={styles.costo}>Total: {job.costo}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trabajador: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1931',
  },
  oficio: {
    fontSize: 13,
    color: '#0085FF',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
  },
  fecha: {
    fontSize: 12,
    color: '#666',
  },
  costo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});