import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './colors'; // Asegúrate de que la ruta apunte correctamente a tu Colors.ts

const { width } = Dimensions.get('window');
const isWebOrTablet = width > 768;

export const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: '100%',
  },
  header: {
    backgroundColor: Colors.light.primary,
    width: '100%', 
    paddingHorizontal: isWebOrTablet ? '8%' : 20, 
    paddingTop: isWebOrTablet ? 30 : 50, 
    paddingBottom: 50,
    borderBottomLeftRadius: isWebOrTablet ? 0 : 32, 
    borderBottomRightRadius: isWebOrTablet ? 0 : 32,
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerContent: {
    width: '100%',
  },
  greeting: {
    color: 'white',
    fontSize: isWebOrTablet ? 42 : 26,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: '#CAF0F8', // Se mantiene blanco-celeste directo para contraste sobre el fondo azul
    fontSize: isWebOrTablet ? 18 : 15,
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    width: isWebOrTablet ? 500 : '100%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.light.secondary,
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  section: {
    paddingHorizontal: isWebOrTablet ? '8%' : 20,
    paddingVertical: 50,
    backgroundColor: 'transparent',
    width: '100%',
  },
  sectionTitle: {
    fontSize: isWebOrTablet ? 24 : 18,
    fontWeight: 'bold',
    marginBottom: 32,
    color: Colors.light.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    width: '100%',
  },
  workerCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
    width: '100%',
  },
  workerTitle: {
    color: 'white',
    fontSize: isWebOrTablet ? 28 : 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  workerSubtitle: {
    color: '#CAF0F8',
    fontSize: isWebOrTablet ? 16 : 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  workerRegisterButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  workerRegisterText: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    backgroundColor: Colors.light.secondary,
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  footerBrandName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#90E0EF',
    fontSize: 14,
    marginBottom: 8,
  },
  footerCopyright: {
    color: '#48CAE4',
    fontSize: 12,
  },
  // PRUEBA YAHIR 2026/19/05
});