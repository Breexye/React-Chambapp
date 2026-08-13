import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/constants/messages-styles/bubbleChats';

interface Message {
  id: string;
  text: string;
  time: string;
  isSelf: boolean;
  read?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: '¡Hola! ¿Cómo vas con el proyecto?', time: '10:14 AM', isSelf: false },
  { id: '2', text: '¡Hola! Ya terminamos los estilos del chat 🚀', time: '10:15 AM', isSelf: true, read: true },
  { id: '3', text: 'Quedó excelente con la hora y los dobles checks.', time: '10:16 AM', isSelf: true, read: true },
];

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubbleContainer,
        item.isSelf ? styles.bubbleSelf : styles.bubbleOther,
      ]}
    >
      <View style={styles.bubbleContent}>
        <Text style={styles.messageText}>{item.text}</Text>
        
        {/* Hora y Visto (Doble Check) */}
        <View style={styles.metaContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.isSelf && (
            <Ionicons
              name="checkmark-done"
              size={16}
              color={item.read ? '#53BDEB' : '#8696A0'} // Azul si está leído, gris si no
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      {/* Lista de Mensajes */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  );
};