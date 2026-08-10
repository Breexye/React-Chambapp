import { ThemedText } from '@/components/themed-text';
import { stylesHome } from '@/constants/stylesHome';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';

export default function WorkerHome() {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <ScrollView style={stylesHome.landingScrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        {/* Tarjeta de Estatus de Disponibilidad */}
        <View style={stylesHome.statusCard}>
          <View style={stylesHome.statusInfo}>
            <View style={[stylesHome.statusDot, { backgroundColor: isAvailable ? '#2ecc71' : '#95a5a6' }]} />
            <View>
              <ThemedText style={stylesHome.statusTitle}>
                {isAvailable ? 'Disponible para clientes' : 'En pausa / Descansando'}
              </ThemedText>
              <ThemedText style={stylesHome.statusSubtitle}>
                {isAvailable ? 'Estás visible en el radar de la zona' : 'No recibirás nuevas alertas'}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#bdc3c7', true: '#a9dfbf' }}
            thumbColor={isAvailable ? '#2ecc71' : '#f1f2f6'}
          />
        </View>

        {/* Estado Vacío: Esperando Solicitudes */}
        <View style={stylesHome.emptyContainer}>
          <View style={stylesHome.iconCircle}>
            <Ionicons name="notifications-outline" size={48} color="#0077B6" />
          </View>
          <ThemedText style={stylesHome.emptyTitle}>Esperando solicitudes</ThemedText>
          <ThemedText style={stylesHome.emptyText}>
            Aún no tienes solicitudes pendientes. Mantén tu estatus activo y tu perfil actualizado para recibir avisos de clientes cercanos.
          </ThemedText>
        </View>

        {/* Resumen rápido de métricas */}
        <View style={stylesHome.statsRow}>
          <View style={stylesHome.statCard}>
            <Ionicons name="star" size={24} color="#f1c40f" />
            <ThemedText style={stylesHome.statNumber}>4.9</ThemedText>
            <ThemedText style={stylesHome.statLabel}>Calificación</ThemedText>
          </View>
          <View style={stylesHome.statCard}>
            <Ionicons name="briefcase-outline" size={24} color="#00B4D8" />
            <ThemedText style={stylesHome.statNumber}>12</ThemedText>
            <ThemedText style={stylesHome.statLabel}>Trabajos hechos</ThemedText>
          </View>
        </View>
      </View>

      {/* Pie de página institucional */}
      <View style={stylesHome.footer}>
        <View style={stylesHome.footerLogoRow}>
          <Ionicons name="briefcase" size={22} color="white" />
          <ThemedText style={stylesHome.footerBrandName}>ChambApp</ThemedText>
        </View>
        <ThemedText style={stylesHome.footerText}>Conectando talento con oportunidades.</ThemedText>
        <ThemedText style={stylesHome.footerCopyright}>© 2026 ChambApp. Todos los derechos reservados.</ThemedText>
      </View>
    </ScrollView>
  );
}