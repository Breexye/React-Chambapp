import { ThemedText } from '@/components/themed-text';
import { stylesRegister } from '@/constants/stylesRegister';
import { useFormValidation } from '@/hooks/use-register-validation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

// IMPORTACIÓN DE SUPABASE
import { supabase } from '@/src/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { errors, validate } = useFormValidation();
  
  const [role, setRole] = useState<'cliente' | 'trabajador'>('cliente');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const data = { name, email, phone, password };
    
    if (validate(data)) {
      try {
        // 1. Registrar al usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (authError) throw authError;

        const user = authData.user;

        if (user) {
          // 2. Guardar los datos en la tabla 'users' en Supabase
          const { error: dbError } = await supabase.from('users').insert([
            {
              id: user.id,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              role: role,
              created_at: new Date().toISOString()
            }
          ]);

          if (dbError) throw dbError;
        }

        alert("¡Cuenta creada con éxito!");

        // 3. Redireccionar al usuario mandando el rol y el nombre real
        router.replace({
          pathname: '/',
          params: { role: role, nombre: name.trim() }
        });

      } catch (error: any) {
        console.error("Error en Supabase:", error.message);
        alert("No se pudo completar el registro: " + error.message);
      }
    } else {
      console.log("Errores de validación:", errors);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={stylesRegister.container}
    >
      <ScrollView contentContainerStyle={stylesRegister.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={stylesRegister.card}>
          <View style={stylesRegister.avatarContainer}>
            <Ionicons name="person-add-outline" size={36} color="#0077B6" />
          </View>

          <ThemedText style={stylesRegister.title}>¡Únete Ahora!</ThemedText>
          <ThemedText style={stylesRegister.subtitle}>Crea tu cuenta en ChambApp</ThemedText>

          <ThemedText style={stylesRegister.sectionLabel}>¿Qué tipo de cuenta quieres?</ThemedText>
          
          <View style={stylesRegister.roleRow}>
            <TouchableOpacity 
              style={[stylesRegister.roleButton, role === 'cliente' ? stylesRegister.roleButtonActive : stylesRegister.roleButtonInactive]}
              onPress={() => setRole('cliente')}
            >
              {role === 'cliente' && <View style={stylesRegister.roleDot} />}
              <Ionicons name="person" size={28} color={role === 'cliente' ? '#00B4D8' : '#9CA3AF'} />
              <ThemedText style={[stylesRegister.roleText, role === 'cliente' ? stylesRegister.roleTextActive : stylesRegister.roleTextInactive]}>Cliente</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[stylesRegister.roleButton, role === 'trabajador' ? stylesRegister.roleButtonActive : stylesRegister.roleButtonInactive]}
              onPress={() => setRole('trabajador')}
            >
              {role === 'trabajador' && <View style={stylesRegister.roleDot} />}
              <Ionicons name="construct" size={28} color={role === 'trabajador' ? '#00B4D8' : '#9CA3AF'} />
              <ThemedText style={[stylesRegister.roleText, role === 'trabajador' ? stylesRegister.roleTextActive : stylesRegister.roleTextInactive]}>Trabajador</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={stylesRegister.inputGroup}>
            <ThemedText style={stylesRegister.inputLabel}>Nombre Completo</ThemedText>
            <View style={stylesRegister.inputContainer}>
              <Ionicons name="person-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
              <TextInput 
                placeholder="Juan Pérez" 
                testID="input-name"
                placeholderTextColor="#9CA3AF" 
                style={stylesRegister.input} 
                value={name} 
                onChangeText={setName} 
              />  
            </View>
            {errors.name ? <ThemedText style={{color: 'red'}}>{errors.name}</ThemedText> : null}
          </View>

          <View style={stylesRegister.inputGroup}>
            <ThemedText style={stylesRegister.inputLabel}>Correo Electrónico</ThemedText>
            <View style={stylesRegister.inputContainer}>
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
              <TextInput 
                placeholder="tu@email.com" 
                testID="input-email"
                placeholderTextColor="#9CA3AF" 
                style={stylesRegister.input} 
                keyboardType="email-address" 
                autoCapitalize="none"
                value={email} 
                onChangeText={setEmail} 
              /> 
            </View>
            {errors.email ? <ThemedText style={{color: 'red'}}>{errors.email}</ThemedText> : null}
          </View>

          <View style={stylesRegister.inputGroup}>
            <ThemedText style={stylesRegister.inputLabel}>Teléfono</ThemedText>
            <View style={stylesRegister.inputContainer}>
              <Ionicons name="call-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
              <TextInput 
                placeholder="614-123-4567" 
                testID="input-phone"
                placeholderTextColor="#9CA3AF" 
                style={stylesRegister.input} 
                keyboardType="phone-pad" 
                value={phone} 
                onChangeText={setPhone}  
              />
            </View>
            {errors.phone ? <ThemedText style={{color: 'red'}}>{errors.phone}</ThemedText> : null}
          </View>

          <View style={stylesRegister.inputGroup}>
            <ThemedText style={stylesRegister.inputLabel}>Contraseña</ThemedText>
            <View style={stylesRegister.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
              <TextInput 
                placeholder="••••••••" 
                testID="input-password"
                placeholderTextColor="#9CA3AF" 
                style={stylesRegister.input} 
                secureTextEntry={isPasswordHidden} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                <Ionicons 
                  name={isPasswordHidden ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <ThemedText style={{color: 'red'}}>{errors.password}</ThemedText> : null}
          </View>

          <TouchableOpacity testID="btn-register" style={stylesRegister.submitButton} onPress={handleRegister}>
            <ThemedText style={stylesRegister.submitButtonText}>Crear Cuenta Gratis →</ThemedText>
          </TouchableOpacity>

          <View style={stylesRegister.dividerRow}>
            <View style={stylesRegister.dividerLine} />
            <ThemedText style={stylesRegister.dividerText}>o</ThemedText>
            <View style={stylesRegister.dividerLine} />
          </View>

          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={stylesRegister.footerLinkText}>
              ¿Ya tienes cuenta? <ThemedText style={stylesRegister.footerLinkBold}>Inicia sesión aquí</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={stylesRegister.badgeRow}>
          <ThemedText style={stylesRegister.badgeText}>✓ Gratis</ThemedText>
          <ThemedText style={stylesRegister.badgeText}>•</ThemedText>
          <ThemedText style={stylesRegister.badgeText}>✓ Sin comisiones ocultas</ThemedText>
          <ThemedText style={stylesRegister.badgeText}>•</ThemedText>
          <ThemedText style={stylesRegister.badgeText}>✓ 100% seguro</ThemedText>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}