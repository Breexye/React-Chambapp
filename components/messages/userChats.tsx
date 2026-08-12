import { Text, View } from 'react-native';
import { stylesChats } from '@/constants/messages-styles/stylesChats';

export function UserChats() {
    return (
        <View style={stylesChats.container}>
            <Text>User Chat Component</Text>
        </View>
    );
}