import { stylesMessages } from "@/constants/messages-styles/stylesMessages";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { ThemedText } from '@/components/themed-text';
import { useRouter } from "expo-router";
import { NavBar } from "@/components/ui/nav-bar";
import { UserChats } from "@/components/messages/userChats";

//importaciones del supabase (base de datos)
import { supabase } from '@/src/supabase';

export default function Message() {
    const router = useRouter();

    return (
        <View style={stylesMessages.container}>
            <ScrollView>
                <NavBar />
                <View>
                    <UserChats />
                </View>
            </ScrollView>
        </View>
    );
}
