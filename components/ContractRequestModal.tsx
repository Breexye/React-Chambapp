import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ContractRequestModalProps {
  visible: boolean;
  onClose: () => void;
  contractData: {
    id: string;
    displayName: string;
    displayRoleLabel: string;
    profession: string;
    status: string;
    date: string;
    details: string;
    total: number;
  } | null;
}

export default function ContractRequestModal({ visible, onClose, contractData }: ContractRequestModalProps) {
  if (!contractData) return null;

  // Función para generar y compartir el PDF del contrato
  const generatePDF = async () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 30px; color: #1E293B; }
              .header { text-align: center; border-bottom: 2px solid #0284C7; padding-bottom: 15px; margin-bottom: 20px; }
              .title { font-size: 24px; font-weight: bold; color: #0F172A; }
              .subtitle { font-size: 14px; color: #64748B; }
              .section { margin-bottom: 15px; }
              .label { font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: bold; }
              .value { font-size: 16px; color: #1E293B; margin-top: 4px; }
              .total-box { background-color: #F8FAFC; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: right; }
              .total-text { font-size: 18px; font-weight: bold; color: #0284C7; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">ChambApp - Comprobante de Servicio</div>
              <div class="subtitle">Folio de contrato: #${contractData.id}</div>
            </div>

            <div class="section">
              <div class="label">Servicio / Profesión</div>
              <div class="value">${contractData.profession}</div>
            </div>

            <div class="section">
              <div class="label">${contractData.displayRoleLabel}</div>
              <div class="value">${contractData.displayName}</div>
            </div>

            <div class="section">
              <div class="label">Fecha del Servicio</div>
              <div class="value">${contractData.date}</div>
            </div>

            <div class="section">
              <div class="label">Estado Actual</div>
              <div class="value">${contractData.status}</div>
            </div>

            <div class="section">
              <div class="label">Descripción del Trabajo</div>
              <div class="value">${contractData.details}</div>
            </div>

            <div class="total-box">
              <div class="label">Total Acordado</div>
              <div class="total-text">$${contractData.total} MXN</div>
            </div>
          </body>
        </html>
      `;

      // Generar archivo PDF temporal
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Verificar si se puede compartir el archivo en el dispositivo
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
        return;
      }

      // Abrir menú nativo para compartir/guardar el PDF
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo generar el PDF: ' + error.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          {/* Encabezado del Modal */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{contractData.profession}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Información del Contrato */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>{contractData.displayRoleLabel}</Text>
            <Text style={styles.value}>{contractData.displayName}</Text>

            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{contractData.date}</Text>

            <Text style={styles.label}>Estado</Text>
            <Text style={[styles.value, { color: '#0284C7' }]}>{contractData.status}</Text>

            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>${contractData.total}</Text>

            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.desc}>{contractData.details}</Text>
          </View>

          {/* Botón para generar PDF */}
          <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
            <Ionicons name="document-text-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.pdfButtonText}>Descargar Comprobante PDF</Text>
          </TouchableOpacity>

          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  infoContainer: { marginBottom: 20 },
  label: { fontSize: 12, color: '#64748B', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginTop: 2 },
  desc: { fontSize: 14, color: '#334155', marginTop: 2, lineHeight: 20 },
  pdfButton: { backgroundColor: '#0284C7', flexDirection: 'row', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  pdfButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  closeButton: { backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 15 }
});