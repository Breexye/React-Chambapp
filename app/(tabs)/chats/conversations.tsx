import { stylesMessages } from "@/constants/messages-styles/stylesMessages";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { ThemedText } from '@/components/themed-text';
import { useRouter } from "expo-router";
import { BarMessage } from "@/components/messages/barMessage";
import { MessageInput } from "@/components/messages/sendMessage";
import { ChatScreen } from "@/components/messages/bubbleMessage";
export default function Message() {
    const router = useRouter();

    return (
        <View style={ stylesMessages.container }>
            <BarMessage />
                
            <ChatScreen />
            
            <MessageInput />
        </View>
    );
}