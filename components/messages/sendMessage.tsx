import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from "@/constants/messages-styles/styleSendMesssage"

interface MessageInputProps {
  onSend?: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend?.(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Cápsula Principal de Entrada de Texto */}
      <View style={styles.inputCapsule}>
        
        <TextInput
          style={styles.textInput}
          placeholder="Mensaje"
          placeholderTextColor="#667781"
          multiline
          value={text}
          onChangeText={setText}
        />

        {/* Muestra la cámara solo si no hay texto ingresado */}
        {text.length === 0 && (
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="camera-outline" size={24} color="#667781" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};