import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Worker {
  id: string;
  nombre: string;
  oficio: string;
  calificacion: number;
  resenas: number;
  disponible: boolean;
  descripcion: string;
  avatar: string;
}

interface WorkerCardProps {
  worker: Worker;
  onPress?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Image source={{ uri: worker.avatar }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.nombre}>{worker.nombre}</Text>
            {worker.disponible && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Disponible</Text>
              </View>
            )}
          </View>
          <Text style={styles.oficio}>{worker.oficio}</Text>
          <Text style={styles.rating}>
            ⭐ {worker.calificacion} <Text style={styles.resenas}>({worker.resenas} reseñas)</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.descripcion} numberOfLines={2}>
        {worker.descripcion}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.btnSecundario}>
          <Text style={styles.btnTextSecundario}>Ver perfil</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1931',
  },
  oficio: {
    fontSize: 14,
    color: '#0085FF',
    fontWeight: '500',
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  resenas: {
    fontWeight: '400',
    color: '#666',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '600',
  },
  descripcion: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 12,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  btnSecundario: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A1931',
  },
  btnTextSecundario: {
    color: '#0A1931',
    fontWeight: '600',
    fontSize: 13,
  },
});