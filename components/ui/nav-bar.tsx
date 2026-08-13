import ClientHome from '@/components/Home/ClientHome';
import WorkerHome from '@/components/Home/WorkerHome';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

import { Worker, WorkerCard } from '@/components/WorkerCard';
import { stylesHome as styles } from '@/constants/stylesHome';

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
      "descripcion": "Cortocircuitos, cableado residencial, instalación de centros de carga y luminarias inteligentes.",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  ]
};

export function NavBar() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [currentRole, setCurrentRole] = useState<'landing' | 'cliente' | 'trabajador'>('landing');
    const [userName, setUserName] = useState('Usuario');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
    
    useEffect(() => {
        if (params.role === 'cliente' || params.role === 'trabajador') {
          setCurrentRole(params.role);
        }
        if (params.nombre) {
          setUserName(params.nombre as string);
        }
      }, [params.role, params.nombre]);

    const handleLogout = () => {
        setIsMenuOpen(false);
        setCurrentRole('landing');
        setUserName('Usuario');
        setSearchQuery('');
        setFilteredWorkers([]);
        router.setParams({ role: '', nombre: '' });
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
            {/* CUADRO AZUL SUPERIOR FIJO */}
            <View style={styles.landingHeader}>
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
                </View>
            </View>
        </View>
    );
    }

    // MODO USUARIO LOGUEADO (CLIENTE O TRABAJADOR)
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
            <ThemedText style={styles.globalWelcomeText}>¡Bienvenido, {userName}!</ThemedText>
        </View>

        {currentRole === 'cliente' ? <ClientHome userName={userName} /> : <WorkerHome />}

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
                    <TouchableOpacity 
                    key={item.id} 
                    style={styles.menuItem} 
                    onPress={() => {
                        setIsMenuOpen(false);

                        // MODIFICA AQUÍ LAS RUTAS SEGÚN LAS PANTALLAS CORRESPONDIENTES
                        if (item.id === 'perfil' || item.id === 'perfil-w') {
                        router.push('/profile' as any);
                        } else if (item.id === 'chats' || item.id === 'chats-w') {
                        router.push('/chats' as any);
                        } else if (item.id === 'favoritos') {
                        router.push('/favorites' as any);
                        } else if (item.id === 'historias' || item.id === 'historial-w') {
                        router.push('/history' as any);
                        } else if (item.id === 'calificaciones') {
                        router.push('/ratings' as any);
                        }
                    }}
                    >
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