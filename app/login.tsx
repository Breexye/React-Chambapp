import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../constants/stylesLogin';


import { supabase } from '@/src/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validacion de campos vacios
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      console.log('Iniciando sesión con:', email);

      // 1. Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      const user = authData.user;

      if (user) {
        // 2. Buscar los datos adicionales del usuario en la tabla 'users'
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (dbError) {
          console.warn("No se pudo obtener el rol de la tabla users, entrando por defecto:", dbError.message);
        }

        const userRole = userData?.role || 'cliente';
        const userName = userData?.name || email.split('@')[0];

        // 3. Redirigir al inicio mandando el rol y el nombre real
        router.replace({
          pathname: '/',
          params: { role: userRole, nombre: userName }
        });
      }

    } catch (error: any) {
      console.error("ERROR CRÍTICO EN SUPABASE:", error.message);
      Alert.alert("Error de Inicio de Sesión", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
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

        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <ThemedText style={styles.submitButtonText}>Iniciar Sesión →</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register' as any)}>
          <ThemedText style={styles.footerLinkText}>
            ¿No tienes cuenta? <ThemedText style={styles.footerLinkBold}>Regístrate aquí</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}