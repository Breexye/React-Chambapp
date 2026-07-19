import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { stylesRegister } from '@/constants/stylesRegister';
import { useRouter } from 'expo-router';
import { useFormValidation } from '@/hooks/use-register-validation';

export default function RegisterScreen() {
  const router = useRouter();
  const { errors, validate } = useFormValidation();
  
  const [role, setRole] = useState<'cliente' | 'trabajador'>('cliente');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  
  // Estados para los datos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const data = { name, email, phone, password };
    
    if (validate(data)) {
      console.log("Formulario válido. Redireccionando al Home asignado para:", role);
    
      router.replace({
        pathname: '/(tabs)',
        params: { role: role }
      });
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
                placeholder="555-123-4567" 
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