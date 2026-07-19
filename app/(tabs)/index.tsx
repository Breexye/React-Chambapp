import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import ClientHome from '@/components/Home/ClientHome';
import WorkerHome from '@/components/Home/WorkerHome';

import { stylesHome as styles } from '@/constants/stylesHome';
import { WorkerCard, Worker } from '@/components/WorkerCard';

const dataFromDb = {
  "trabajadores": [
    {
      "id": "1",
      "nombre": "Carlos Mendoza",
      "oficio": "Plomería",
      "calificacion": 4.9,
      "resenas": 32,
      "disponible": true,
      "descripcion": "Especialista en fugas de gas, instalaciones hidráulicas y reparación de boilers. Servicio garantizado.",
      "avatar": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150"
    },
    {
      "id": "2",
      "nombre": "Sofía Ramos",
      "oficio": "Electricista",
      "calificacion": 4.8,
      "resenas": 19,
      "disponible": true,
      "descripcion": "Cortocorticuitos, cableado residencial, instalación de centros de carga y luminarias inteligentes.",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  ]
};

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [currentRole, setCurrentRole] = useState<'landing' | 'cliente' | 'trabajador'>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    if (params.role === 'cliente' || params.role === 'trabajador') {
      setCurrentRole(params.role);
    }
  }, [params.role]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setCurrentRole('landing');
    setSearchQuery('');
    setFilteredWorkers([]);
    router.setParams({ role: '' });
  };

  const executeSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredWorkers([]);
    } else {
      const results = dataFromDb.trabajadores.filter(worker => 
        worker.oficio.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWorkers(results as Worker[]);
    }
  };

  const menuItems = currentRole === 'cliente' 
    ? [
        { id: 'perfil', title: 'Perfil', icon: 'person-outline' as const },
        { id: 'chats', title: 'Chats', icon: 'chatbubbles-outline' as const },
        { id: 'favoritos', title: 'Favoritos', icon: 'heart-outline' as const },
        { id: 'historias', title: 'Historias', icon: 'book-outline' as const },
      ]
    : [
        { id: 'perfil-w', title: 'Mi Perfil Profesional', icon: 'briefcase-outline' as const },
        { id: 'chats-w', title: 'Mis Mensajes / Chats', icon: 'chatbubbles-outline' as const },
        { id: 'calificaciones', title: 'Mis Calificaciones', icon: 'star-outline' as const },
        { id: 'historial-w', title: 'Historial de Trabajos', icon: 'document-text-outline' as const },
      ];

  if (currentRole === 'landing') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Ionicons name="briefcase" size={24} color="#FFFFFF" />
              <ThemedText style={styles.brandName}>ChambApp</ThemedText>
            </View>
            <View style={styles.authContainer}>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <ThemedText style={styles.loginText}>Entrar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/register')}>
                <ThemedText style={styles.registerButtonText}>Registrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerContent}>
            <ThemedText style={styles.greeting}>Encuentra tu chamba</ThemedText>
            <ThemedText style={styles.subGreeting}>Trabajadores expertos cerca de ti</ThemedText>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput 
                placeholder="Buscar plomero, electricista..." 
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(txt) => {
                  setSearchQuery(txt);
                  if(txt === '') setFilteredWorkers([]);
                }}
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => executeSearch(searchQuery)}>
                <ThemedText style={styles.searchButtonText}>Buscar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {filteredWorkers.length > 0 ? (
          <View style={[styles.section, styles.resultsSection]}>
            <ThemedText style={styles.sectionTitle}>Resultados para "{searchQuery}"</ThemedText>
            {filteredWorkers.map((worker) => (
              <WorkerCard 
                key={worker.id} 
                worker={worker} 
                onPress={() => console.log(`Abriendo perfil de ${worker.nombre}`)} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Oficios Populares</ThemedText>
            <View style={styles.grid}>
              {[
                { label: 'Plomería', icon: 'water-outline', jobs: '1 trabajos' },
                { label: 'Electricista', icon: 'flash-outline', jobs: '1 trabajos' },
                { label: 'Carpintería', icon: 'hammer-outline', jobs: '0 trabajos' },
                { label: 'Pintura', icon: 'brush-outline', jobs: '0 trabajos' },
                { label: 'Albañilería', icon: 'construct-outline', jobs: '0 trabajos' },
                { label: 'Jardinería', icon: 'leaf-outline', jobs: '0 trabajos' },
                { label: 'Limpieza', icon: 'sparkles-outline', jobs: '0 trabajos' },
                { label: 'Mecánica', icon: 'settings-outline', jobs: '0 trabajos' },
              ].map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.oficioCard}
                  onPress={() => executeSearch(item.label)}
                  activeOpacity={0.7}
                >
                  <View style={styles.oficioIconCircle}>
                    <Ionicons name={item.icon as any} size={24} color="#00B4D8" />
                  </View>
                  <ThemedText style={styles.oficioLabel}>{item.label}</ThemedText>
                  <ThemedText style={styles.oficioJobs}>{item.jobs}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: styles.section.paddingHorizontal }}>
          <View style={styles.workerCard}>
            <Ionicons name="construct-outline" size={40} color="#FFFFFF" />
            <ThemedText style={styles.workerTitle}>¿Eres Trabajador?</ThemedText>
            <ThemedText style={styles.workerSubtitle}>Únete y conecta con miles de clientes</ThemedText>
            <TouchableOpacity style={styles.workerRegisterButton} onPress={() => router.push('/register')}>
              <ThemedText style={styles.workerRegisterText}>Regístrate Gratis</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <Ionicons name="briefcase" size={22} color="white" />
            <ThemedText style={styles.footerBrandName}>ChambApp</ThemedText>
          </View>
          <ThemedText style={styles.footerText}>Conectando talento con oportunidades.</ThemedText>
          <ThemedText style={styles.footerCopyright}>© 2026 ChambApp. Todos los derechos reservados.</ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.globalHeaderTopRow}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerIconBtn}>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ThemedText style={styles.globalHeaderLogo}>ChambApp</ThemedText>

        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.globalWelcomeRow}>
        <ThemedText style={styles.globalWelcomeText}>¡Bienvenido, Usuario!</ThemedText>
      </View>

      {currentRole === 'cliente' ? <ClientHome /> : <WorkerHome />}

      <Modal transparent={true} visible={isMenuOpen} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeOverlay} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />
          
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <ThemedText style={styles.menuHeaderTitle}>
                {currentRole === 'cliente' ? 'Menú Cliente' : 'Panel de Trabajo'}
              </ThemedText>
            </View>

            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => setIsMenuOpen(false)}>
                <Ionicons name={item.icon} size={22} color="#00B4D8" style={{ marginRight: 15 }} />
                <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#FF4D4D" style={{ marginRight: 15 }} />
              <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}