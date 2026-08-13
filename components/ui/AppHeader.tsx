import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/src/authContext';
import { stylesHome as styles } from '@/constants/stylesHome';

export function AppHeader() {
    const router = useRouter();
    const { userRole, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        await signOut();
        router.replace('/login');
    };

    const menuItems = userRole === 'cliente'
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

    return (
    <>
        <View style={styles.globalHeaderTopRow}>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerIconBtn}>
                <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <ThemedText style={styles.globalHeaderLogo}>ChambApp</ThemedText>
            </TouchableOpacity>
                

            <TouchableOpacity onPress={() => router.push('/profile' as any)} style={styles.headerIconBtn}>
                <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>

        <Modal transparent={true} visible={isMenuOpen} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.closeOverlay} onPress={() => setIsMenuOpen(false)} activeOpacity={1} />

                <View style={styles.menuDrawer}>
                <View style={styles.menuHeader}>
                    <ThemedText style={styles.menuHeaderTitle}>
                    {userRole === 'cliente' ? 'Menú Cliente' : 'Panel de Trabajo'}
                    </ThemedText>
                </View>

                {menuItems.map((item) => (
                    <TouchableOpacity 
                    key={item.id} 
                    style={styles.menuItem} 
                    onPress={() => {
                        setIsMenuOpen(false);

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
    </>
    );
}