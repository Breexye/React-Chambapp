// app/(tabs)/Perfil/clientProfiles.tsx
import { stylesClient as styles } from '@/constants/stylesClient';
import { stylesGeneral } from '@/constants/stylesGeneral';
import { storageService } from '@/services/storageService';
import { userService } from '@/services/userService';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ClientProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);

  // Estados de edición del formulario
  const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuario no autenticado");
      setCurrentUserId(user.id);
      setEmail(user.email || '');

      const data = await userService.getUserById(user.id);
      setClientData(data);
      if (data?.profile_image) setProfileImage(data.profile_image);
      setName(data?.name || '');
      setPhone(data?.phone || '');

    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickProfileImage = async () => {
    if (!currentUserId) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri); 

      try {
        Alert.alert('Actualizando...', 'Subiendo nueva foto de perfil.');
        const publicUrl = await storageService.uploadImage(imageUri, 'profiles', currentUserId);
        await userService.updateClientProfile(currentUserId, { profile_image: publicUrl });
        Alert.alert('¡Éxito!', 'Foto de perfil actualizada.');
      } catch (error: any) {
        Alert.alert('Error', 'No se pudo guardar la foto.');
        setProfileImage(clientData?.profile_image || 'https://via.placeholder.com/150'); 
        console.error(error.message);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUserId) return;
    setIsSaving(true);

    try {
      if (!name.trim() || !phone.trim() || !email.trim()) {
        Alert.alert('Atención', 'Nombre, Teléfono y Correo son obligatorios.');
        setIsSaving(false);
        return;
      }

      const dbUpdates = { name, phone };
      let authEmailUpdate = email !== clientData?.email ? email : undefined;

      Alert.alert('Guardando...', 'Actualizando tus datos.');

      await userService.updateClientProfile(currentUserId, { ...dbUpdates, email: authEmailUpdate });

      if (password.trim()) {
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) throw passError;
        setPassword('');
        Alert.alert('Seguridad', 'Contraseña actualizada correctamente.');
      }

      setClientData({ ...clientData, name, phone, email });
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.');
      if (authEmailUpdate) {
        Alert.alert('Aviso', 'Se ha enviado un enlace de confirmación a tu nuevo correo electrónico.');
      }

    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
      console.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[stylesGeneral.container, stylesGeneral.center]}>
        <ActivityIndicator size="large" color="#00b4d8" />
      </View>
    );
  }

  return (
    <View style={stylesGeneral.container}>
      <View style={stylesGeneral.navBarContainer}>
        <TouchableOpacity style={stylesGeneral.headerIconBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={stylesGeneral.logoText}>ChambApp</Text>
        <TouchableOpacity style={stylesGeneral.headerIconBtn} onPress={() => router.push('/(tabs)/Perfil/clientProfiles')}>
          <Ionicons name="person-circle-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <View style={stylesGeneral.subHeaderRow}>
        <Text style={stylesGeneral.subHeaderText}>Mi Perfil Cliente</Text>
      </View>

      <ScrollView contentContainerStyle={stylesGeneral.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBadge} onPress={handlePickProfileImage}>
              <Ionicons name="camera" size={18} color="#0d1b2a" />
            </TouchableOpacity>
          </View>
          <Text style={stylesGeneral.subHeaderText}>Cliente</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tu nombre" />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Tu número" keyboardType="phone-pad" />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Tu correo" keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Cambiar Contraseña (Opcional)</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Ingresa nueva contraseña" secureTextEntry autoCapitalize="none" />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSaveChanges} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}