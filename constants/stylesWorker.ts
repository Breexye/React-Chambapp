// constants/stylesWorker.ts
import { StyleSheet } from 'react-native';

export const stylesWorker = StyleSheet.create({
  // --- HEADER DEL PERFIL ---
  profileHeader: {
    alignItems: 'center',
    marginVertical: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#00b4d8',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00b4d8',
    borderRadius: 18,
    padding: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  workerName: {
    color: '#212529',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  workerProfession: {
    color: '#00b4d8',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 4,
    fontWeight: '600',
  },

  // --- CABECERAS DE SECCIÓN ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#212529',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- CAJA "ACERCA DE MÍ" ---
  aboutBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  aboutText: {
    color: '#495057',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  aboutInput: {
    color: '#212529',
    fontSize: 14,
    flex: 1,
    padding: 0,
    textAlignVertical: 'top',
    minHeight: 60,
  },

  // --- ESTADO VACÍO RESEÑAS ---
  emptyReviewsText: {
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },

  // --- NUEVOS ESTILOS PARA FORMULARIO DE OPINIÓN ---
  reviewForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ced4da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputComment: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    color: '#212529',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ced4da',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  reviewerAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});