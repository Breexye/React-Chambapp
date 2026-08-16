import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import ContractRequestModal from '@/components/ContractRequestModal';
import { BarMessage } from '@/components/messages/barMessage';
import { ChatScreen } from '@/components/messages/bubbleMessage';
import { stylesMessages } from '@/constants/messages-styles/stylesMessages';

export default function Conversations() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    userId,
    name,
    profession,
    profile_image,
  } = useLocalSearchParams<{
    userId: string;
    name: string;
    profession: string;
    profile_image: string;
  }>();

  const contractData = {
    id: userId || "1",
    displayName: name || "Trabajador",
    displayRoleLabel: "Trabajador",
    profession: profession || "Servicio",
    status: "Pendiente",
    date: new Date().toISOString().split('T')[0],
    details: `Contratación para servicio de ${profession}`,
    total: 0,
  };

  return (
    <View style={stylesMessages.container}>
      <BarMessage
        name={name}
        profession={profession}
        profileImage={profile_image}
        onPressContract={() => setIsModalVisible(true)}
      />
      
      <ChatScreen
        otherUserId={userId}
      />

      <ContractRequestModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        contractData={contractData}
      />
    </View>
  );
}