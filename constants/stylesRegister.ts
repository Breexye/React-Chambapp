// constants/stylesRegister.ts
import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './colors'; // O la ruta donde tengas centralizados tus colores

const { width } = Dimensions.get('window');
const isWebOrTablet = width > 768;

// ¡AQUÍ ESTÁ LA CLAVE! Asegúrate de que tenga la palabra "export" al inicio
export const stylesRegister = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 32,
    padding: isWebOrTablet ? 40 : 24,
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.secondary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.secondary,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  roleButtonActive: {
    borderColor: Colors.light.accent,
    backgroundColor: Colors.light.iconBg,
  },
  roleButtonInactive: {
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  roleDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.accent,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  roleTextActive: {
    color: Colors.light.secondary,
  },
  roleTextInactive: {
    color: '#9CA3AF',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.secondary,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    width: '100%',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9CA3AF',
    fontSize: 13,
  },
  footerLinkText: {
    fontSize: 13,
    color: Colors.light.secondary,
  },
  footerLinkBold: {
    color: Colors.light.accent,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.light.iconBg,
    fontSize: 11,
    fontWeight: '500',
  },
});