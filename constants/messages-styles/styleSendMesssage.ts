import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Permite que el botón de enviar se mantenga abajo al crecer el input
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'transparent', // O la imagen de fondo del chat
  },
  inputCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    marginRight: 6,
    minHeight: 48,
    maxHeight: 120, // Previene que el input ocupe toda la pantalla al escribir mucho
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    color: '#111b21',
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
    paddingBottom: Platform.OS === 'ios' ? 4 : 0,
  },
  iconButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A884', // Verde WhatsApp
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});