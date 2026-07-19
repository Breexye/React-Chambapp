import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function WorkerHome() {
  return (
    <View style={styles.contentContainer}>
      {/* Aqui se coloca los paneles de ganancias, switch de disponibilidad, etc. */}
      <ThemedText style={styles.placeholderText}>Contenido de inicio del Trabajador</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#9CA3AF', fontSize: 16 }
});