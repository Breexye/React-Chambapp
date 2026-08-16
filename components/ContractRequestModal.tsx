import { supabase } from '@/src/supabase'; // Asegúrate de que esta ruta coincida con la ubicación de tu cliente de Supabase
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ContractRequestModalProps {
  visible: boolean;
  onClose: () => void;
  contractData?: {
    id?: string;
    displayName?: string;
    displayRoleLabel?: string;
    profession?: string;
    status?: string;
    date?: string;
    details?: string;
    total?: number;
    clientId?: string; // ID del cliente si viene definido
    workerId?: string; // ID del trabajador si viene definido
  } | null;
  onSaveContract?: (newContract: any) => void; 
}

export default function ContractRequestModal({ visible, onClose, contractData, onSaveContract }: ContractRequestModalProps) {
  const [formServiceName, setFormServiceName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTotal, setFormTotal] = useState('');
  const [formDate, setFormDate] = useState('');

  useEffect(() => {
    if (contractData) {
      setFormServiceName(contractData.profession || '');
      setFormDescription(contractData.details || '');
      setFormTotal(contractData.total !== undefined ? contractData.total.toString() : '');
      setFormDate(contractData.date || new Date().toISOString().split('T')[0]);
    } else {
      setFormDate(new Date().toISOString().split('T')[0]);
      setFormServiceName('');
      setFormDescription('');
      setFormTotal('');
    }
  }, [contractData]);

  // Función para guardar en la base de datos de Supabase e Historial
  const handleSaveToDatabase = async () => {
    if (!formServiceName || !formTotal || !formDate) {
      Alert.alert('Error', 'Por favor llena los campos obligatorios.');
      return;
    }

    try {
      // Obtenemos el usuario autenticado actual por seguridad
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'No hay una sesión activa.');
        return;
      }

      // Definimos los IDs de cliente y trabajador
      // Si contractData trae los IDs explícitos los usa, de lo contrario asume al usuario actual
      const clientIdToSave = contractData?.clientId || contractData?.id || user.id;
      const workerIdToSave = contractData?.workerId || user.id;

      const contractPayload = {
        service_name: formServiceName,
        description: formDescription,
        total: parseFloat(formTotal) || 0,
        service_date: formDate,
        status: 'En proceso', // Estado inicial compatible con el historial
        client_id: clientIdToSave,
        worker_id: workerIdToSave
      };

      // Inserción directa en la tabla de Supabase
      const { error } = await supabase
        .from('contracts')
        .insert([contractPayload]);

      if (error) {
        console.error('Error detallado de Supabase:', error);
        Alert.alert('Error', 'No se pudo guardar en la base de datos: ' + error.message);
        return;
      }

      if (onSaveContract) {
        onSaveContract(contractPayload);
      }

      Alert.alert('Éxito', 'Contrato guardado correctamente en el historial.');
      onClose();
    } catch (err: any) {
      console.error('Excepción al guardar contrato:', err);
      Alert.alert('Error', 'Ocurrió un error inesperado al guardar.');
    }
  };

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
              <div class="subtitle">Folio de contrato / servicio</div>
            </div>

            <div class="section">
              <div class="label">Servicio / Profesión</div>
              <div class="value">${formServiceName}</div>
            </div>

            <div class="section">
              <div class="label">${contractData?.displayRoleLabel || 'Cliente'}</div>
              <div class="value">${contractData?.displayName || 'N/A'}</div>
            </div>

            <div class="section">
              <div class="label">Fecha del Servicio</div>
              <div class="value">${formDate}</div>
            </div>

            <div class="section">
              <div class="label">Estado Actual</div>
              <div class="value">${contractData?.status || 'En proceso'}</div>
            </div>

            <div class="section">
              <div class="label">Descripción del Trabajo</div>
              <div class="value">${formDescription}</div>
            </div>

            <div class="total-box">
              <div class="label">Total Acordado</div>
              <div class="total-text">$${formTotal || '0'} MXN</div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
        return;
      }

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
            <Text style={styles.modalTitle}>Crear Contrato</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.inputLabel}>Nombre del Servicio</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Plomería"
                placeholderTextColor="#94A3B8"
                value={formServiceName}
                onChangeText={setFormServiceName}
              />

              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ej. Arreglar tubería rota"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                value={formDescription}
                onChangeText={setFormDescription}
              />

              <Text style={styles.inputLabel}>Total ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 500"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formTotal}
                onChangeText={setFormTotal}
              />

              <Text style={styles.inputLabel}>Fecha (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-08-13"
                placeholderTextColor="#94A3B8"
                value={formDate}
                onChangeText={setFormDate}
              />
            </View>

            {/* Botón para Guardar en Base de Datos / Historial */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveToDatabase}>
              <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveButtonText}>Guardar Contrato</Text>
            </TouchableOpacity>

            {/* Botón para generar PDF */}
            <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
              <Ionicons name="document-text-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.pdfButtonText}>Generar Comprobante PDF</Text>
            </TouchableOpacity>

            {/* Botón de cancelar */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5, 
    maxHeight: '88%' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0F172A' 
  },
  scrollContainer: {
    paddingBottom: 5
  },
  infoContainer: { 
    marginBottom: 5 
  },
  inputLabel: { 
    fontSize: 11, 
    color: '#64748B', 
    marginTop: 8, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5, 
    fontWeight: '700' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    fontSize: 14, 
    color: '#1E293B', 
    marginTop: 4, 
    backgroundColor: '#F8FAFC' 
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: 'top'
  },
  saveButton: { 
    backgroundColor: '#10B981', 
    flexDirection: 'row', 
    paddingVertical: 12, 
    paddingHorizontal: 10,
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 12,
    marginBottom: 8 
  },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 14,
    textAlign: 'center'
  },
  pdfButton: { 
    backgroundColor: '#0284C7', 
    flexDirection: 'row', 
    paddingVertical: 12, 
    paddingHorizontal: 10,
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },
  pdfButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 14,
    textAlign: 'center'
  },
  closeButton: { 
    backgroundColor: '#F1F5F9', 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  closeButtonText: { 
    color: '#475569', 
    fontWeight: 'bold', 
    fontSize: 14 
  }
});