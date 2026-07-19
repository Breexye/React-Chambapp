import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function ClientHome() {
  return (
    <View style={styles.contentContainer}>
      {/* Aqui se coloca el buscador interno y demás elementos visuales del cliente */}
      <ThemedText style={styles.placeholderText}>Contenido de inicio del Cliente</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#9CA3AF', fontSize: 16 }
});