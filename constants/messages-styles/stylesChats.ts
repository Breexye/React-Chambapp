import { Colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const stylesChats = StyleSheet.create({
    container: {
        // Eliminamos flex: 1 para que sirva correctamente dentro de un FlatList
        height: 72,
        backgroundColor: Colors.light.background,
        borderBottomWidth: 1,
        borderColor: Colors.light.secondary,
        flexDirection: 'row',
        alignItems: 'center', // Centra la foto y los contenidos verticalmente
        paddingHorizontal: 12,
    },
    photoContent: {
        width: 48,
        height: 48,
        borderRadius: 24, // En React Native, para un círculo perfecto usas la mitad del ancho
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Evita desbordamiento si la imagen dentro no tiene borderRadius
    },
    textContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4, // Espaciado limpio e igual entre nombre y último mensaje
    },
    usernameContent: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    lastMessageContent: {
        color: Colors.light.text,
        fontSize: 13,
        fontWeight: '300', // Reemplaza 'ultralight' para mejor compatibilidad entre iOS/Android
    },
    timeContent: {
        color: Colors.light.text,
        fontSize: 11,
        fontWeight: '300',
        alignSelf: 'flex-start', // Alinea la hora en la parte superior derecha de la tarjeta
        marginTop: 14,
    }
    });