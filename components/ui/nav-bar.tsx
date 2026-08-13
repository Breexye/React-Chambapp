import ClientHome from '@/components/Home/ClientHome';
import WorkerHome from '@/components/Home/WorkerHome';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/src/authContext';
import { AppHeader } from '@/components/ui/AppHeader'; // ajusta la ruta real
import { stylesHome as styles } from '@/constants/stylesHome';

export function NavBar() {
    const router = useRouter();
    const { user, userRole, userName, loading } = useAuth();

    if (loading) return null;

    // MODO LANDING (no logueado) — el header aquí sigue siendo el propio de landing, sin AppHeader
    if (!user) {
    return (
        <View style={styles.landingContainer}>
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

    // Logueado: header persistente + saludo + dashboard (esto SOLO se ve en Inicio)
    return (
    <View style={styles.appContainer}>
        <AppHeader />

        <View style={styles.globalWelcomeRow}>
            <ThemedText style={styles.globalWelcomeText}>¡Bienvenido, {userName}!</ThemedText>
        </View>

        {userRole === 'cliente' ? <ClientHome userName={userName ?? ''} /> : <WorkerHome />}
    </View>
    );
}