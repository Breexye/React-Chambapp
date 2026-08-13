import React from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/constants/messages-styles/bubbleChats';
import { useAuth } from '@/src/authContext';
import { useConversation, Mensaje } from '@/hooks/message-hooks/use-message';
import { MessageInput } from '@/components/messages/sendMessage';

interface ChatScreenProps {
  otherUserId: string;
}

export const ChatScreen = ({ otherUserId }: ChatScreenProps) => {
  const { userId, loading: authLoading } = useAuth();
  const { mensajes, loading, enviarMensaje } = useConversation(otherUserId);

  const renderItem = ({ item }: { item: Mensaje }) => {
    const isSelf = item.id_emisor === userId;

    return (
      <View style={[styles.bubbleContainer, isSelf ? styles.bubbleSelf : styles.bubbleOther]}>
        <View style={styles.bubbleContent}>
          <Text style={styles.messageText}>{item.message}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.timeText}>
              {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isSelf && <Ionicons name="checkmark-done" size={16} color="#8696A0" />}
          </View>
        </View>
      </View>
    );
  };

  if (authLoading || loading) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={{ flex: 1 }}
      />
      <MessageInput onSend={enviarMensaje} />
    </KeyboardAvoidingView>
  );
};  