import { Text, View, TouchableOpacity } from 'react-native';
import { stylesChats } from '@/constants/messages-styles/stylesChats';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

//importaciones del supabase (base de datos)
import { supabase } from '@/src/supabase';

export function UserChats() {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push('/chats/conversations')}>
            <View style={stylesChats.container}>
                <View>
                    <View style={stylesChats.photoContent}>
                        <Ionicons name="person" size={50} />
                    </View>
                </View>
                <View style={stylesChats.textContent}>
                    <View>
                        <Text style={stylesChats.usernameContent}> nombre del usuario </Text>
                    </View>
                    <View>
                        <Text style={stylesChats.lastMessageContent}> Ultimo mensaje... </Text>
                    </View>
                </View>
                <View>
                    <Text style={stylesChats.timeContent}> hora del envio </Text>
                </View>
            </View>
        </TouchableOpacity>
        
    );
}