import { ThemedText } from '@/components/themed-text';
import { stylesRegister } from '@/constants/stylesRegister';
import { useFormValidation } from '@/hooks/use-register-validation';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Modal, Platform,
  ScrollView, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lista predefinida de oficios
const SPECIALTIES_LIST = [
  "Plomero / Fontanero",
  "Electricista",
  "Técnico de Aires Acondicionados (Coolers y Minisplits)",
  "Carpintero",
  "Albañil / Constructor independiente",
  "Cerrajero a domicilio",
  "Trabajadora doméstica / Empleada de limpieza",
  "Niñera / Cuidadora infantil",
  "Cuidador de adultos mayores",
  "Lavador de autos a domicilio",
  "Jardinero",
  "Fumigador / Control de plagas",
  "Fletes y mudanzas locales",
  "Repartidor / Mandaditos",
  "Estilista / Barbero",
  "Manicurista / Pedicurista",
  "Técnico de soporte informático y cámaras de seguridad",
  "Pintor de casas"
];

export default function RegisterScreen() {
  const router = useRouter();
  const { errors } = useFormValidation();
  const [role, setRole] = useState<'cliente' | 'trabajador'>('cliente');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  // Campos comunes
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Campos exclusivos para trabajador
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Estados para las fotos de la INE
  const [ineFrontImage, setIneFrontImage] = useState<string | null>(null);
  const [ineBackImage, setIneBackImage] = useState<string | null>(null);

  // Modales y Guías
  const [activePhotoType, setActivePhotoType] = useState<'profile' | 'ineFront' | 'ineBack' | null>(null);
  const [showPhotoGuideModal, setShowPhotoGuideModal] = useState(false);
  const [showSpecialtiesModal, setShowSpecialtiesModal] = useState(false);

  // Estados para especialidad personalizada ("Otro")
  const [showCustomJobModal, setShowCustomJobModal] = useState(false);
  const [customJobInput, setCustomJobInput] = useState('');

  // Abrir galeria
  const handlePickFromGallery = async (type: 'profile' | 'ineFront' | 'ineBack') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la galería.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [16, 10],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (type === 'profile') setProfileImage(uri);
      if (type === 'ineFront') setIneFrontImage(uri);
      if (type === 'ineBack') setIneBackImage(uri);
    }
  };

  // Abrir cámara con guía según el tipo de foto
  const handleOpenCameraController = (type: 'profile' | 'ineFront' | 'ineBack') => {
    setActivePhotoType(type);
    setShowPhotoGuideModal(true);
  };

  // Función para confirmar la guia y abrir la cámara
  const handleConfirmedCameraCapture = async () => {
    setShowPhotoGuideModal(false);
    setTimeout(async () => {
      try {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la cámara.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: activePhotoType === 'profile' ? [1, 1] : [16, 10],
          quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          if (activePhotoType === 'profile') setProfileImage(uri);
          if (activePhotoType === 'ineFront') setIneFrontImage(uri);
          if (activePhotoType === 'ineBack') setIneBackImage(uri);
        }
      } catch (error) {
        console.error("Error al abrir la cámara:", error);
        Alert.alert("Error", "No se pudo abrir la cámara en este dispositivo.");
      }
    }, 300);
  };

  // Función para subir imágenes a Supabase Storage
  const uploadImageToSupabase = async (uri: string, folder: string, userId: string) => {
    if (!uri) return null;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, blob, { contentType: `image/${fileExt}` });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw error;
    }
  };

  // FUNCIÓN DE REGISTRO DIRECTA Y SEGURA
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos obligatorios.");
      return;
    }

    if (role === 'trabajador' && (!jobTitle.trim() || !ineFrontImage || !ineBackImage || !profileImage)) {
      Alert.alert("Faltan datos de trabajador", "Como trabajador debes seleccionar tu especialidad, subir las fotos de tu INE (frente y reverso) y tu foto de perfil.");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (user) {
        let profileImageUrl = null;
        let ineFrontUrl = null;
        let ineBackUrl = null;

        if (role === 'trabajador') {
          if (profileImage) profileImageUrl = await uploadImageToSupabase(profileImage, 'profiles', user.id);
          if (ineFrontImage) ineFrontUrl = await uploadImageToSupabase(ineFrontImage, 'ines', user.id);
          if (ineBackImage) ineBackUrl = await uploadImageToSupabase(ineBackImage, 'ines', user.id);
        }

        const userPayload: any = {
          id: user.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role,
          created_at: new Date().toISOString()
        };

        if (role === 'trabajador') {
          userPayload.job_title = jobTitle.trim();
          userPayload.job_description = jobDescription.trim();
          userPayload.profile_image = profileImageUrl;
          userPayload.ine_front_image = ineFrontUrl;
          userPayload.ine_back_image = ineBackUrl;
        }

        const { error: dbError } = await supabase.from('users').insert([userPayload]);
        if (dbError) throw dbError;
      }

      Alert.alert("¡Cuenta creada con éxito!");
      router.replace({
        pathname: '/',
        params: { role: role, nombre: name.trim() }
      });
    } catch (error: any) {
      console.error("Error detallado en registro:", error);
      Alert.alert(
        "Error técnico exacto",
        typeof error === 'object' ? JSON.stringify(error.message || error, null, 2) : String(error)
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#230077B6' }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={stylesRegister.container}>
        <ScrollView contentContainerStyle={stylesRegister.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, alignSelf: 'flex-start' }}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 5 }}>Volver al inicio</ThemedText>
          </TouchableOpacity>

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

            {/* CAMPOS COMUNES */}
            <View style={stylesRegister.inputGroup}>
              <ThemedText style={stylesRegister.inputLabel}>Nombre Completo</ThemedText>
              <View style={stylesRegister.inputContainer}>
                <Ionicons name="person-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
                <TextInput
                  placeholder="Juan Pérez"
                  placeholderTextColor="#9CA3AF"
                  style={stylesRegister.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              {errors.name ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.name}</ThemedText> : null}
            </View>

            <View style={stylesRegister.inputGroup}>
              <ThemedText style={stylesRegister.inputLabel}>Correo Electrónico</ThemedText>
              <View style={stylesRegister.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
                <TextInput
                  placeholder="tu@email.com"
                  placeholderTextColor="#9CA3AF"
                  style={stylesRegister.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.email}</ThemedText> : null}
            </View>

            <View style={stylesRegister.inputGroup}>
              <ThemedText style={stylesRegister.inputLabel}>Número de Teléfono</ThemedText>
              <View style={stylesRegister.inputContainer}>
                <Ionicons name="call-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
                <TextInput
                  placeholder="6141234567"
                  placeholderTextColor="#9CA3AF"
                  style={stylesRegister.input}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              {errors.phone ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.phone}</ThemedText> : null}
            </View>

            <View style={stylesRegister.inputGroup}>
              <ThemedText style={stylesRegister.inputLabel}>Contraseña</ThemedText>
              <View style={stylesRegister.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
                <TextInput
                  placeholder="........"
                  placeholderTextColor="#9CA3AF"
                  style={stylesRegister.input}
                  secureTextEntry={isPasswordHidden}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                  <Ionicons name={isPasswordHidden ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {errors.password ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.password}</ThemedText> : null}
            </View>

            {/* CAMPOS ADICIONALES SI ES TRABAJADOR */}
            {role === 'trabajador' && (
              <View style={{ width: '100%', marginTop: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 15 }}>
                <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#0077B6', marginBottom: 12 }}>
                  Información Profesional y Verificación
                </ThemedText>

                <View style={{ backgroundColor: '#E0F2FE', borderColor: '#38BDF8', borderWidth: 1.5, borderRadius: 8, padding: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#0284C7" style={{ marginTop: 1 }} />
                  <ThemedText style={{ fontSize: 13, color: '#0F172A', flex: 1, lineHeight: 19, fontWeight: '500' }}>
                    <ThemedText style={{ fontWeight: 'bold', color: '#0369A1' }}>Aviso de Privacidad y Seguridad:</ThemedText> Las fotografías de tu INE son estrictamente confidenciales y <ThemedText style={{ fontWeight: 'bold', color: '#0369A1' }}>no son públicas</ThemedText>. Solo los administradores de ChambApp las revisarán por seguridad para validar tu identidad.
                  </ThemedText>
                </View>

                {/* Selector de Trabajo */}
                <View style={stylesRegister.inputGroup}>
                  <ThemedText style={stylesRegister.inputLabel}>Trabajo o Especialidad</ThemedText>
                  <TouchableOpacity
                    style={[stylesRegister.inputContainer, { justifyContent: 'space-between' }]}
                    onPress={() => setShowSpecialtiesModal(true)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Ionicons name="briefcase-outline" size={18} color="#9CA3AF" style={stylesRegister.inputIcon} />
                      <ThemedText style={{ color: jobTitle ? '#333333' : '#9CA3AF', fontSize: 15 }}>
                        {jobTitle || "Selecciona tu especialidad..."}
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                  {errors.jobTitle ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.jobTitle}</ThemedText> : null}
                </View>

                {/* Descripción */}
                <View style={stylesRegister.inputGroup}>
                  <ThemedText style={stylesRegister.inputLabel}>Descripción (Especialización o detalles)</ThemedText>
                  <View style={[stylesRegister.inputContainer, { height: 80, alignItems: 'flex-start', paddingVertical: 8 }]}>
                    <Ionicons name="document-text-outline" size={18} color="#9CA3AF" style={[stylesRegister.inputIcon, { marginTop: 2 }]} />
                    <TextInput
                      placeholder="Describe a qué te especializas, marcas que atiendes, horarios, etc."
                      placeholderTextColor="#9CA3AF"
                      style={[stylesRegister.input, { height: 64, textAlignVertical: 'top' }]}
                      multiline
                      value={jobDescription}
                      onChangeText={setJobDescription}
                    />
                  </View>
                  {errors.jobDescription ? <ThemedText style={{ color: 'red', fontSize: 12 }}>{errors.jobDescription}</ThemedText> : null}
                </View>

                {/* INE FRENTE */}
                <View style={stylesRegister.inputGroup}>
                  <ThemedText style={stylesRegister.inputLabel}>INE Frente (Fotografía)</ThemedText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 5 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handlePickFromGallery('ineFront')}>
                      <Ionicons name="images-outline" size={18} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Galería</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handleOpenCameraController('ineFront')}>
                      <Ionicons name="camera-outline" size={18} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Tomar Foto</ThemedText>
                    </TouchableOpacity>
                  </View>
                  {ineFrontImage && (
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                      <ThemedText style={{ color: 'green', fontSize: 12, marginBottom: 5 }}>✓ Frente de INE cargado</ThemedText>
                      <Image source={{ uri: ineFrontImage }} style={{ width: 120, height: 75, borderRadius: 6, borderWidth: 1, borderColor: '#00B4D8' }} />
                    </View>
                  )}
                </View>

                {/* INE REVERSO */}
                <View style={stylesRegister.inputGroup}>
                  <ThemedText style={stylesRegister.inputLabel}>INE Reverso (Fotografía)</ThemedText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 5 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handlePickFromGallery('ineBack')}>
                      <Ionicons name="images-outline" size={18} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Galería</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handleOpenCameraController('ineBack')}>
                      <Ionicons name="camera-outline" size={18} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 11, fontWeight: '600', marginTop: 2 }}>Tomar Foto</ThemedText>
                    </TouchableOpacity>
                  </View>
                  {ineBackImage && (
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                      <ThemedText style={{ color: 'green', fontSize: 12, marginBottom: 5 }}>✓ Reverso de INE cargado</ThemedText>
                      <Image source={{ uri: ineBackImage }} style={{ width: 120, height: 75, borderRadius: 6, borderWidth: 1, borderColor: '#00B4D8' }} />
                    </View>
                  )}
                </View>

                {/* FOTO PERFIL */}
                <View style={stylesRegister.inputGroup}>
                  <ThemedText style={stylesRegister.inputLabel}>Foto de Perfil Profesional</ThemedText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 5 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handlePickFromGallery('profile')}>
                      <Ionicons name="images-outline" size={20} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Galería</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0F2FE', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00B4D8' }} onPress={() => handleOpenCameraController('profile')}>
                      <Ionicons name="camera-outline" size={20} color="#0077B6" />
                      <ThemedText style={{ color: '#0077B6', fontSize: 12, fontWeight: '600', marginTop: 4 }}>Tomar Foto</ThemedText>
                    </TouchableOpacity>
                  </View>
                  {profileImage && (
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <ThemedText style={{ color: 'green', fontSize: 12, marginBottom: 5 }}>✓ Foto cargada correctamente</ThemedText>
                      <Image source={{ uri: profileImage }} style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#0077B6' }} />
                    </View>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={stylesRegister.submitButton} onPress={handleRegister}>
              <ThemedText style={stylesRegister.submitButtonText}>Crear Cuenta Gratis</ThemedText>
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL PARA SELECCIONAR ESPECIALIDAD */}
      <Modal visible={showSpecialtiesModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '75%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#0077B6' }}>Selecciona tu Especialidad</ThemedText>
              <TouchableOpacity onPress={() => setShowSpecialtiesModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {SPECIALTIES_LIST.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                  onPress={() => {
                    setJobTitle(item);
                    setShowSpecialtiesModal(false);
                  }}
                >
                  <ThemedText style={{ fontSize: 15, color: '#1F2937' }}>{item}</ThemedText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{ paddingVertical: 16, borderTopWidth: 2, borderTopColor: '#0077B6', marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => {
                  setShowSpecialtiesModal(false);
                  setCustomJobInput('');
                  setShowCustomJobModal(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={20} color="#0077B6" />
                <ThemedText style={{ fontSize: 15, fontWeight: 'bold', color: '#0077B6' }}>Otro (Escribir mi especialidad)</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SUBMODAL PARA ESCRIBIR ESPECIALIDAD PERSONALIZADA */}
      <Modal visible={showCustomJobModal} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#0077B6', marginBottom: 8 }}>Especificar Especialidad</ThemedText>
            <ThemedText style={{ fontSize: 13, color: '#4B5563', marginBottom: 15 }}>
              Escribe claramente cuál es tu oficio o profesión (ej. Fotógrafo, Cerrajero automotriz):
            </ThemedText>
            <TextInput
              placeholder="Ej. Fotógrafo profesional"
              placeholderTextColor="#9CA3AF"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#1F2937', marginBottom: 20 }}
              value={customJobInput}
              onChangeText={setCustomJobInput}
              autoFocus={true}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={() => setShowCustomJobModal(false)}>
                <ThemedText style={{ color: '#374151', fontWeight: 'bold' }}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#0077B6', padding: 12, borderRadius: 8, alignItems: 'center' }}
                onPress={() => {
                  if (customJobInput.trim() !== '') {
                    setJobTitle(customJobInput.trim());
                    setShowCustomJobModal(false);
                  } else {
                    Alert.alert("Campo vacío", "Por favor escribe tu especialidad.");
                  }
                }}
              >
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Guardar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE INSTRUCCIONES DE FOTO */}
      <Modal visible={showPhotoGuideModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, maxHeight: '85%' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#0077B6', marginBottom: 10, textAlign: 'center' }}>
                {activePhotoType === 'profile' ? 'Instrucciones para tu foto de perfil' : `Instrucciones para INE (${activePhotoType === 'ineFront' ? 'Frente' : 'Reverso'})`}
              </ThemedText>
              <ThemedText style={{ fontSize: 13, color: '#374151', marginBottom: 15, textAlign: 'center' }}>
                {activePhotoType === 'profile'
                  ? 'Tu foto es tu carta de presentación ante los clientes. Asegúrate de seguir estas reglas para que tu perfil luzca profesional:'
                  : 'Asegúrate de que la fotografía sea clara, legible, sin reflejos de luz y con todos los datos visibles dentro del recuadro.'}
              </ThemedText>
              <View style={{ gap: 12, marginBottom: 15 }}>
                {activePhotoType === 'profile' ? (
                  <>
                    <ThemedText style={{ fontSize: 13, color: '#1F2937' }}><ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Encuadre y postura:</ThemedText> Colócate de frente a la cámara, abarcando desde los hombros hasta la cabeza.</ThemedText>
                    <ThemedText style={{ fontSize: 13, color: '#1F2937' }}><ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Rostro descubierto:</ThemedText> Sin lentes oscuros, gorras, sombreros o cubrebocas.</ThemedText>
                    <ThemedText style={{ fontSize: 13, color: '#1F2937' }}><ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Iluminación:</ThemedText> Lugar bien iluminado con luz natural frente a ti.</ThemedText>
                  </>
                ) : (
                  <>
                    <ThemedText style={{ fontSize: 13, color: '#1F2937' }}><ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Superficie plana:</ThemedText> Coloca tu credencial sobre una mesa oscura o neutral.</ThemedText>
                    <ThemedText style={{ fontSize: 13, color: '#1F2937' }}><ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Sin flash directo:</ThemedText> Evita que el reflejo de la luz tape los textos o hologramas.</ThemedText>
                  </>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={() => setShowPhotoGuideModal(false)}>
                  <ThemedText style={{ color: '#374151', fontWeight: 'bold' }}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#0077B6', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={handleConfirmedCameraCapture}>
                  <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Continuar</ThemedText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}