import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

// ESTILOS Y COMPONENTES PROPIOS DE TU ESTRUCTURA ORIGINAL
import { stylesMessages } from "@/constants/messages-styles/stylesMessages";
import { AppHeader } from "@/components/ui/AppHeader";
import { ThemedText } from "@/components/themed-text";
import { UserChats } from "@/components/messages/userChats";

// HOOKS
import { useChats } from "@/hooks/message-hooks/use-chat";
import { useAuth } from "@/src/authContext";

export default function Message() {
  const router = useRouter();
  const { userId } = useAuth();
  
  // Lógica cargada desde el nuevo Hook
  const { chats, loading } = useChats();

  return (
    <View style={stylesMessages.container}>
      {/* 
        FlatList incluye la propiedad ListHeaderComponent para que AppHeader 
        se mantenga fijo en la parte superior y haga scroll fluido junto a los chats.
      */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.userId}
        ListHeaderComponent={<AppHeader />}
        renderItem={({ item }) => (
          <UserChats chat={item} />
        )}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <ThemedText>No tienes conversaciones</ThemedText>
            )}
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}