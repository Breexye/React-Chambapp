import { Colors } from '../colors';
import { StyleSheet, Platform, StatusBar } from 'react-native';

// Cálculo básico del padding superior para evitar empalmes con la StatusBar
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export const InfoUser = StyleSheet.create({
  header: {
    backgroundColor: Colors.light.tabIconSelected,
    // Eliminamos la altura fija rígida para permitir que la barra respire en cualquier pantalla
    paddingTop: statusBarHeight,
    paddingBottom: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonBack: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // 48dp es el estándar de área táctil recomendado por Material/iOS
    width: 48,
  },
  dataUser: {
    flex: 1, // Toma todo el espacio sobrante horizontalmente
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageProfile: {
    width: 56,
    height: 56,
    borderRadius: 28, // La mitad exacta del ancho para un círculo perfecto
    backgroundColor: Colors.light.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // Sombras compatibles
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1, // Evita que los textos largos se salgan de la pantalla
    justifyContent: 'center',
  },
  usernameContent: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profesionContent: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '300', // Reemplaza 'ultralight' para soporte completo en Android
    marginTop: 2, // Espaciado fino en lugar de 10px
  },
  buttonViewContract: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto', // Empuja el botón al extremo derecho de la barra
    marginRight: 8,
  },
  buttonContract: {
    backgroundColor: '#FF1C0C',
    borderRadius: 20, // Con 20 es suficiente para bordes totalmente redondeados en 35px de alto
    paddingHorizontal: 16, // En lugar de ancho fijo '85', usamos padding para que el texto encaje bien
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
});