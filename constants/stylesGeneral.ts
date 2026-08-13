// constants/stylesGeneral.ts
import { StyleSheet } from 'react-native';

export const stylesGeneral = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fondo general limpio y claro
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- ENCABEZADO SUPERIOR (Navegador) ---
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40, // Ajusta según el notch del dispositivo
    paddingBottom: 12,
    backgroundColor: '#0077b6', // Azul institucional brillante acorde a la app
    borderBottomWidth: 1,
    borderBottomColor: '#023e8a',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIconBtn: {
    padding: 5,
  },
  subHeaderRow: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  subHeaderText: {
    color: '#495057',
    fontSize: 15,
    fontWeight: '600',
  },
  // ------------------------------------
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
    gap: 12,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#ffffff', // Tarjeta blanca limpia
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00b4d8', // Cian accent
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewerName: {
    color: '#212529',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewDate: {
    color: '#6c757d', // Gris secundario legible
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5', // Fondo sutil para la insignia de estrellas
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingBadgeText: {
    color: '#212529',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reviewComment: {
    color: '#495057', // Texto oscuro legible sobre fondo blanco
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewAttachedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 6,
  },
});