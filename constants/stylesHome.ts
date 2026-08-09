import { Colors } from '@/constants/colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export const isWebOrTablet = Platform.OS === 'web' || width > 768;

export const stylesHome = StyleSheet.create({
  // LANDING PAGE & ESTILOS GENERALES
  landingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  landingHeader: {
    backgroundColor: '#0077B6',
    paddingTop: 50,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#0077B6',
    fontWeight: 'bold',
  },
  headerContent: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 14,
    color: '#E0F2FE',
    marginBottom: 15,
  },

  // BUSCADOR
  searchHeroBackground: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#0088CC',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // OFICIOS POPULARES
  tradesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  tradesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 15,
  },
  tradesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  tradeCard: {
    width: '30%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  tradeCount: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },

  // PROMO TRABAJADOR
  workerPromoCard: {
    backgroundColor: '#0077B6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  workerPromoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  workerPromoSubtitle: {
    fontSize: 12,
    color: '#E0F2FE',
    marginBottom: 15,
    textAlign: 'center',
  },
  workerRegisterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  workerRegisterText: {
    color: '#0077B6',
    fontWeight: 'bold',
  },

  // FOOTER
  footer: {
    backgroundColor: '#0F172A',
    padding: 25,
    alignItems: 'center',
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  footerBrandName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
  },
  footerCopyright: {
    color: '#64748B',
    fontSize: 10,
  },

  // MODO APP LOGUEADO
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  globalHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerIconBtn: {
    padding: 4,
  },
  globalHeaderLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  globalWelcomeRow: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  globalWelcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ESTRUCTURA DEL MODO CLIENTE Y MAPA
  clientMainLayout: {
    paddingBottom: 40,
  },
  mapSection: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  mapContainer: {
    height: isWebOrTablet ? 450 : 350,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  // TARJETA TRABAJADOR EN EL MAPA
  calloutCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  calloutAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  calloutAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutInfo: {
    flex: 1,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  calloutProfession: {
    fontSize: 12,
    color: '#64748B',
  },
  calloutBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  calloutBadgeText: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
  },
  calloutButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  calloutButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  closeCalloutBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCalloutText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // MODAL MENU
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  closeOverlay: {
    flex: 1,
  },
  menuDrawer: {
    width: '75%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 50,
  },
  menuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  menuHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  logoutText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: 'bold',
  },
});