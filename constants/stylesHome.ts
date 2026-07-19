import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './colors'; 

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
    color: '#CAF0F8', 
    fontSize: isWebOrTablet ? 18 : 15,
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    width: isWebOrTablet ? '40%' : '100%', 
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
  oficioCard: { 
    width: isWebOrTablet ? '11%' : '30%', 
    backgroundColor: '#F8FAFC', 
    paddingVertical: 15, 
    alignItems: 'center', 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
  },
  oficioIconCircle: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#E0F7FA', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  oficioLabel: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#334155', 
    textAlign: 'center' 
  },
  oficioJobs: { 
    fontSize: 9, 
    color: '#94A3B8', 
    marginTop: 2, 
    textAlign: 'center' 
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
  resultsSection: { 
    paddingVertical: 20 
  },
  appContainer: { 
    flex: 1, 
    backgroundColor: Colors.light.secondary 
  },
  globalHeaderTopRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingTop: 50, 
    paddingBottom: 10 
  },
  headerIconBtn: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  globalHeaderLogo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  globalWelcomeRow: { 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  globalWelcomeText: { 
    fontSize: 16, 
    color: '#00B4D8', 
    fontWeight: '500' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)' 
  },
  closeOverlay: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 1 
  },
  menuDrawer: { 
    position: 'absolute', 
    left: 0, 
    top: 0, 
    bottom: 0, 
    zIndex: 2, 
    width: isWebOrTablet ? 300 : width * 0.7, 
    height: '100%', 
    backgroundColor: '#001E36', 
    paddingTop: 60, 
    paddingHorizontal: 15, 
    borderRightWidth: 1, 
    borderRightColor: 'rgba(255,255,255,0.05)' 
  },
  menuHeader: { 
    paddingBottom: 20, 
    marginBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.1)' 
  },
  menuHeaderTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  menuItemText: { 
    fontSize: 16, 
    color: '#FFFFFF' 
  },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 'auto', 
    paddingVertical: 20, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.1)' 
  },
  logoutText: { 
    fontSize: 16, 
    color: '#FF4D4D', 
    fontWeight: 'bold' 
  }
  // PRUEBA YAHIR 2026/19/05
});