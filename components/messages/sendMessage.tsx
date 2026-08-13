import React, { useState } from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  styles,
} from '@/constants/messages-styles/styleSendMesssage';

interface MessageInputProps {
  onSend?: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
}) => {

  const [text, setText] = useState('');

  const handleSend = () => {

    const mensaje = text.trim();

    if (!mensaje) return;

    onSend?.(mensaje);

    setText('');

  };

  return (
    <View style={styles.container}>

      <View style={styles.inputCapsule}>

        <TextInput
          style={styles.textInput}
          placeholder="Mensaje"
          placeholderTextColor="#667781"
          multiline
          value={text}
          onChangeText={setText}
        />

        {text.trim().length === 0 ? (

          <TouchableOpacity
            style={styles.iconButton}
          >
            <Ionicons
              name="camera-outline"
              size={24}
              color="#667781"
            />
          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={22}
              color="#0077B6"
            />
          </TouchableOpacity>

        )}

      </View>

    </View>
  );
};