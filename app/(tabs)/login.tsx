import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../constants/stylesLogin';

// ✅ Ya no se importa supabase aquí: toda la lógica vive en useLogin / AuthContext
import { useLogin } from '@/hooks/login/use-login';

export default function LoginScreen() {
  const router = useRouter();
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    submitting,
    handleLogin,
  } = useLogin();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* Botón para volver al Inicio / Index */}
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' }}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={20} color="#0077B6" />
          <ThemedText style={{ color: '#0077B6', fontWeight: '600', marginLeft: 5 }}>Volver al inicio</ThemedText>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={36} color="#0077B6" />
          </View>

          <ThemedText style={styles.title}>¡Bienvenido!</ThemedText>
          <ThemedText style={styles.subtitle}>Inicia sesión en ChambApp</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Correo Electrónico</ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                placeholder="tu@email.com" 
                placeholderTextColor="#9CA3AF" 
                style={styles.input} 
                keyboardType="email-address" 
                autoCapitalize="none"
                value={email} 
                onChangeText={setEmail} 
                editable={!submitting}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Contraseña</ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                placeholder="••••••••" 
                placeholderTextColor="#9CA3AF" 
                style={styles.input} 
                secureTextEntry={!showPassword} 
                value={password}
                onChangeText={setPassword}
                editable={!submitting}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, submitting && { opacity: 0.6 }]} 
            onPress={handleLogin}
            disabled={submitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {submitting ? 'Ingresando...' : 'Iniciar Sesión →'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <ThemedText style={styles.footerLinkText}>
              ¿No tienes cuenta? <ThemedText style={styles.footerLinkBold}>Regístrate aquí</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}