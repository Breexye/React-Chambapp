import { Colors } from '../colors';
import { StyleSheet } from 'react-native';

export const stylesMessages = StyleSheet.create({
    // Estilos para la pantalla de mensajes
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        backgroundColor: Colors.light.tabIconSelected,
        paddingTop: 50,
        paddingBottom: 30,
        flexDirection: 'row',
        width: '100%',
        zIndex: 10,
    },
    styleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingLeft: 20,
        alignItems: 'center',
    }
});