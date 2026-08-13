import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  // --- BURBUJAS DE CHAT ---
  bubbleContainer: {
    marginVertical: 3,
    maxWidth: '80%',
  },
  bubbleSelf: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 2, // Esquina pronunciada
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.iconBg,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 2, // Esquina pronunciada
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  
  // --- CONTENIDO INTERNO DE LA BURBUJA ---
  bubbleContent: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#111B21',
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    color: '#FFF',
    marginRight: 3,
  },

  // --- HEADER Y BARRA DE ENTRADA ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54', // Verde oscuro WhatsApp
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
  },
  inputCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 10,
    minHeight: 44,
    maxHeight: 100,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00A884',
    justifyContent: 'center',
    alignItems: 'center',
  },
});