import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/colors';
import { InfoUser } from '@/constants/messages-styles/infoUser';

interface BarMessageProps {
  name: string;
  profession: string;
  profileImage?: string;
  onPressContract?: () => void;
}

export function BarMessage({
  name,
  profession,
  profileImage,
  onPressContract,
}: BarMessageProps) {

  const router = useRouter();

  return (
    <View style={InfoUser.header}>

      <TouchableOpacity
        style={InfoUser.buttonBack}
        onPress={() => router.push('/chats')}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color={Colors.light.text}
        />
      </TouchableOpacity>

      <View style={InfoUser.dataUser}>

        <Image
          source={{
            uri:
              profileImage ||
              'https://via.placeholder.com/150',
          }}
          style={InfoUser.imageProfile}
        />

        <View style={InfoUser.textContainer}>

          <Text style={InfoUser.usernameContent}>
            {name}
          </Text>

          <Text style={InfoUser.profesionContent}>
            {profession}
          </Text>

        </View>

      </View>

      <View style={InfoUser.buttonViewContract}>
        <TouchableOpacity
          style={InfoUser.buttonContract}
          onPress={onPressContract}
        >
          <Text
            style={{
              color: Colors.light.text,
            }}
          >
            Contrato
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}