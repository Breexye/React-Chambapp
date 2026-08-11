import ClientHome from '@/components/Home/ClientHome';
import WorkerHome from '@/components/Home/WorkerHome';
import { ThemedText } from '@/components/themed-text';
import { Worker, WorkerCard } from '@/components/WorkerCard';
import { stylesHome as styles } from '@/constants/stylesHome';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<'landing' | 'cliente' | 'trabajador'>('landing');
  const [userName, setUserName] = useState('Usuario');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);

  const [popularTrades, setPopularTrades] = useState<Array<{ label: string; icon: string; jobs: string; count?: number }>>([
    { label: 'Plomeria', icon: 'water-outline', jobs: '0 trabajos' },
    { label: 'Electricista', icon: 'flash-outline', jobs: '0 trabajos' },
    { label: 'Carpintería', icon: 'hammer-outline', jobs: '0 trabajos' },
    { label: 'Fotógrafo', icon: 'camera-outline', jobs: '0 trabajos' },
    { label: 'Albañilería', icon: 'construct-outline', jobs: '0 trabajos' },
    { label: 'Jardinería', icon: 'leaf-outline', jobs: '0 trabajos' },
  ]);

  useEffect(() => {
    if (params.role === 'cliente' || params.role === 'trabajador') {
      setCurrentRole(params.role);
      if (params.nombre) {
        setUserName(params.nombre as string);
      }
    }
  }, [params.role, params.nombre]);

  useEffect(() => {
    if (currentRole === 'landing') {
      fetchPopularTradesAndWorkers();
    }
  }, [currentRole]);

  const mapSupabaseWorkerToCard = (item: any): Worker => ({
    id: String(item.id || Math.random()),
    name: item.name || 'Sin nombre',
    job_title: item.job_title || 'Independiente',
    calificacion: item.calificacion || 5.0,
    resenas: item.resenas || 0,
    disponible: true,
    job_description: item.job_description || 'Sin descripción disponible.',
    profile_image: item.profile_image || '',
  });

  const fetchPopularTradesAndWorkers = async () => {
    try {
      const baseCatalog = [
        { label: 'Plomeria', icon: 'water-outline' },
        { label: 'Electricista', icon: 'flash-outline' },
        { label: 'Carpintería', icon: 'hammer-outline' },
        { label: 'Fotógrafo', icon: 'camera-outline' },
        { label: 'Albañilería', icon: 'construct-outline' },
        { label: 'Jardinería', icon: 'leaf-outline' },
        { label: 'Herrería', icon: 'hardware-chip-outline' },
        { label: 'Limpieza', icon: 'sparkles-outline' },
      ];

      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        throw error;
      }

      const workersList = data || [];

      const counts: { [key: string]: number } = {};
      workersList.forEach((worker: any) => {
        if (worker.job_title) {
          const title = worker.job_title.trim();
          counts[title] = (counts[title] || 0) + 1;
        }
      });

      const combined = baseCatalog.map(item => ({
        ...item,
        count: counts[item.label] || 0,
        jobs: `${counts[item.label] || 0} ${counts[item.label] === 1 ? 'trabajo' : 'trabajos'}`
      }));

      combined.sort((a, b) => (b.count || 0) - (a.count || 0));
      setPopularTrades(combined.slice(0, 6));

      if (searchQuery.trim() !== '') {
        const results = workersList
          .filter((worker: any) => {
            const job = worker.job_title || '';
            const name = worker.name || '';
            return (
              job.toLowerCase().includes(searchQuery.toLowerCase()) ||
              name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
          .map(mapSupabaseWorkerToCard);
        setFilteredWorkers(results);
      }
    } catch (err) {
      console.error("Error en fetchPopularTradesAndWorkers:", err);
    }
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    setCurrentRole('landing');
    setUserName('Usuario');
    setSearchQuery('');
    setFilteredWorkers([]);
    router.setParams({ role: '', nombre: '' });
  };

  const executeSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredWorkers([]);
    } else {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('job_title', `%${text}%`);

        if (error) throw error;
        const formatted = (data || []).map(mapSupabaseWorkerToCard);
        setFilteredWorkers(formatted);
      } catch (err) {
        console.error("Error en executeSearch:", err);
      }
    }
  };

  const handleViewProfileProtected = () => {
    router.push('/login');
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
      <View style={styles.landingContainer}>
        <View style={styles.landingHeader}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Ionicons name="briefcase" size={24} color="#FFFFFF" />
              <ThemedText style={styles.brandName}>ChambApp</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => router.push('/login')} style={{ paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'transparent' }}>
                <ThemedText style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>Entrar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/register')} style={{ paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                <ThemedText style={{ color: '#0077B6', fontSize: 13, fontWeight: 'bold' }}>Registrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerContent}>
            <ThemedText style={styles.greeting}>Encuentra tu chamba</ThemedText>
            <ThemedText style={styles.subGreeting}>Trabajadores expertos cerca de ti</ThemedText>
          </View>
        </View>

        <ScrollView style={styles.landingScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.searchHeroBackground}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginLeft: 8 }} />
              <TextInput
                placeholder="Buscar plomero, fotógrafo..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(txt) => { setSearchQuery(txt); if (txt === '') setFilteredWorkers([]); }}
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => executeSearch(searchQuery)}>
                <ThemedText style={styles.searchButtonText}>Buscar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {filteredWorkers.length > 0 ? (
            <View style={styles.tradesSection}>
              <ThemedText style={styles.tradesTitle}>Resultados para "{searchQuery}"</ThemedText>
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} onPress={handleViewProfileProtected} />
              ))}
            </View>
          ) : (
            <View style={styles.tradesSection}>
              <ThemedText style={styles.tradesTitle}>Oficios Populares</ThemedText>
              <View style={styles.tradesGrid}>
                {popularTrades.map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.tradeCard} onPress={() => executeSearch(item.label)} activeOpacity={0.7}>
                    <View style={styles.tradeIconContainer}>
                      <Ionicons name={item.icon as any} size={24} color="#00B4D8" />
                    </View>
                    <ThemedText style={styles.tradeName}>{item.label}</ThemedText>
                    <ThemedText style={styles.tradeCount}>{item.jobs}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View style={styles.workerPromoCard}>
              <Ionicons name="construct-outline" size={40} color="#FFFFFF" />
              <ThemedText style={styles.workerPromoTitle}>¿Eres Trabajador?</ThemedText>
              <ThemedText style={styles.workerPromoSubtitle}>Únete y conecta con miles de clientes</ThemedText>
              <TouchableOpacity style={styles.workerRegisterButton} onPress={() => router.push('/register')}>
                <ThemedText style={styles.workerRegisterText}>Registrate Gratis</ThemedText>
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
      </View>
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
      {currentRole === 'cliente' ? <ClientHome userName={userName} /> : <WorkerHome />}
      <Modal transparent={true} visible={isMenuOpen} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeOverlay} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <ThemedText style={styles.menuHeaderTitle}>{currentRole === 'cliente' ? 'Menú Cliente' : 'Panel de Trabajo'}</ThemedText>
            </View>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => {
                setIsMenuOpen(false);
                if (item.id.includes('perfil')) router.push('/profile' as any);
                else if (item.id.includes('chats')) router.push('/chats' as any);
                else if (item.id === 'favoritos') router.push('/favorites' as any);
                else if (item.id.includes('historias')) router.push('/history' as any);
                else if (item.id === 'calificaciones') router.push('/ratings' as any);
              }}>
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