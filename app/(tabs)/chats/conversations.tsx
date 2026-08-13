import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { stylesMessages } from '@/constants/messages-styles/stylesMessages';
import { BarMessage } from '@/components/messages/barMessage';
import { ChatScreen } from '@/components/messages/bubbleMessage';

export default function Conversations() {

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

  return (
    <View style={stylesMessages.container}>

      <BarMessage
        name={name}
        profession={profession}
        profileImage={profile_image}
      />

      <ChatScreen
        otherUserId={userId}
      />

    </View>
  );
}