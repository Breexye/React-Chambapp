import React from 'react';
import { ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryCard } from '@/components/CategoryCard'; 
import { stylesHome } from '@/constants/stylesHome';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={stylesHome.container} showsVerticalScrollIndicator={false}>
      
      {/* Header General con nuevo azul #0077B6 */}
      <View style={stylesHome.header}>
        <View style={stylesHome.topRow}>
          <View style={stylesHome.logoContainer}>
             <Ionicons name="briefcase" size={24} color="white" />
             <ThemedText style={stylesHome.brandName}>ChambApp</ThemedText>
          </View>
          
          <View style={stylesHome.authContainer}>
            <TouchableOpacity>
              <ThemedText style={stylesHome.loginText}>Entrar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={stylesHome.registerButton} 
              onPress={() => router.push('/register')}
            >
              <ThemedText style={stylesHome.registerButtonText}>Registrar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buscador y Frase de Bienvenida */}
        <View style={stylesHome.headerContent}>
          <ThemedText style={stylesHome.greeting}>Encuentra tu chamba</ThemedText>
          <ThemedText style={stylesHome.subGreeting}>Trabajadores expertos cerca de ti</ThemedText>
          
          <View style={stylesHome.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Buscar plomero, electricista..." 
              style={stylesHome.searchInput}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={stylesHome.searchButton}>
              <ThemedText style={stylesHome.searchButtonText}>Buscar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Grid de Oficios Populares */}
      <ThemedView style={stylesHome.section}>
        <ThemedText type="subtitle" style={stylesHome.sectionTitle}>Oficios Populares</ThemedText>
        <View style={stylesHome.grid}>
          <CategoryCard name="Plomería" icon="water-outline" count={245} />
          <CategoryCard name="Electricista" icon="flash-outline" count={198} />
          <CategoryCard name="Carpintería" icon="hammer-outline" count={167} />
          <CategoryCard name="Pintura" icon="brush-outline" count={156} />
          <CategoryCard name="Albañilería" icon="construct-outline" count={134} />
          <CategoryCard name="Jardinería" icon="leaf-outline" count={112} />
          <CategoryCard name="Limpieza" icon="sparkles-outline" count={203} />
          <CategoryCard name="Mecánica" icon="settings-outline" count={89} />
        </View>

        {/* Sección ¿Eres Trabajador? transformado a la nueva paleta */}
        <View style={stylesHome.workerCard}>
          <Ionicons name="construct" size={40} color="white" />
          <ThemedText style={stylesHome.workerTitle}>¿Eres Trabajador?</ThemedText>
          <ThemedText style={stylesHome.workerSubtitle}>Únete y conecta con clientes</ThemedText>
          <TouchableOpacity 
            style={stylesHome.workerRegisterButton} 
            onPress={() => router.push('/register')}
          >
            <ThemedText style={stylesHome.workerRegisterText}>Regístrate Gratis</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Footer Final usando el azul más profundo #03045E */}
      <View style={stylesHome.footer}>
        <View style={stylesHome.footerLogoRow}>
          <Ionicons name="briefcase" size={20} color="white" />
          <ThemedText style={stylesHome.footerBrandName}>ChambApp</ThemedText>
        </View>
        <ThemedText style={stylesHome.footerText}>Tu plataforma de chambas en México</ThemedText>
        <ThemedText style={stylesHome.footerCopyright}>© 2026 ChambApp</ThemedText>
      </View>

    </ScrollView>
  );
}