import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import { stylesChats } from '@/constants/messages-styles/stylesChats';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Chat } from '@/hooks/message-hooks/use-chat';

interface UserChatsProps {
  chat: Chat;
}

export function UserChats({
  chat,
}: UserChatsProps) {

  const router = useRouter();

  return (

    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname:
            '/(tabs)/chats/conversations',

          params: {
            userId: chat.userId,
            name: chat.name,
            profession: chat.profession,
          },
        })
      }
    >

      <View style={stylesChats.container}>

        {/* FOTO */}
        <View style={stylesChats.photoContent}>

          {chat.profile_image ? (

            <Image
              source={{
                uri: chat.profile_image,
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
              }}
            />

          ) : (

            <Ionicons
              name="person"
              size={50}
            />

          )}

        </View>

        {/* INFORMACIÓN */}
        <View style={stylesChats.textContent}>

          <Text
            style={stylesChats.usernameContent}
          >
            {chat.name}
          </Text>

          <Text
            style={stylesChats.lastMessageContent}
          >
            {chat.ultimoMensaje ||
              'Sin mensajes'}
          </Text>

        </View>

        {/* HORA */}
        <Text
          style={stylesChats.timeContent}
        >
          {chat.time}
        </Text>

      </View>

    </TouchableOpacity>

  );
}