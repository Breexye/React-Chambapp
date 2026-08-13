import { styles } from "@/constants/stylesLogin";
import { InfoUser } from "../../constants/messages-styles/infoUser";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors"
import { useRouter } from "expo-router";

export function BarMessage() {
    const router = useRouter();
     
    return (
        <View style={InfoUser.header}>
            <View>
                <TouchableOpacity
                    style={ InfoUser.buttonBack }
                    onPress={() => router.push('/chats')}
                >
                    <Ionicons name="arrow-back" size={30} />  
                </TouchableOpacity>
            </View>
            <View style={InfoUser.dataUser}>
                <Ionicons style={ InfoUser.imageProfile }>

                </Ionicons>
                <View>
                    <View>
                        <Text style={ InfoUser.usernameContent }> nombre </Text>
                    </View>
                    <View>
                        <Text style={ InfoUser.profesionContent }> profesion </Text>
                    </View>
                </View>
            </View>
            <View style={ InfoUser.buttonViewContract }>
                <TouchableOpacity style={ InfoUser.buttonContract }>
                    <Text
                        style={{
                            color: Colors.light.text,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    > Contrato </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}