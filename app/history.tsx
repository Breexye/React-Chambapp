// app/history.tsx
import ContractRequestModal from '@/components/ContractRequestModal';
import { supabase } from '@/src/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configurar calendario en español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

interface ServiceItem {
  id: string;
  displayName: string;
  displayRoleLabel: string;
  profession: string;
  status: string;
  date: string;
  total: number;
  details: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Estados para el calendario y contratos
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);

  // Campos del formulario temporal de contrato
  const [formClientId, setFormClientId] = useState<string>('');
  const [formServiceName, setFormServiceName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formTotal, setFormTotal] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');

  useEffect(() => {
    fetchContracts();

    // Suscripción en tiempo real a Supabase para reflejar contratos creados desde el chat o cualquier vista
    const subscription = supabase
      .channel('public:contracts')
      .on(
        'postgres_changes',
        {
          event: '*', // Escucha INSERT, UPDATE y DELETE
          schema: 'public',
          table: 'contracts',
        },
        () => {
          fetchContracts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = userData?.role || 'cliente';
      setUserRole(role);

      let query = supabase.from('contracts').select(`
        *,
        worker:users!contracts_worker_id_fkey(name),
        client:users!contracts_client_id_fkey(name)
      `);

      if (role === 'cliente') {
        query = query.eq('client_id', user.id);
      } else {
        query = query.eq('worker_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        const formattedData: ServiceItem[] = data.map((item: any) => {
          const isClient = role === 'cliente';
          const rawDate = item.service_date || item.created_at || '';
          const formattedDate = rawDate.split('T')[0];

          return {
            id: item.id.toString(),
            displayName: isClient
              ? (item.worker?.name || item.worker_name || 'Trabajador Asignado')
              : (item.client?.name || item.client_name || 'Cliente'),
            displayRoleLabel: isClient ? 'Trabajador' : 'Cliente',
            profession: item.service_name || 'Servicio General',
            status: item.status || 'Pendiente',
            date: formattedDate,
            total: item.total || 0,
            details: item.description || 'Sin detalles',
          };
        });
        setServicesList(formattedData);
      }
    } catch (error: any) {
      console.error('Error al cargar contratos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async () => {
    try {
      if (!formClientId || !formServiceName || !formTotal || !formDate) {
        Alert.alert('Error', 'Por favor llena los campos obligatorios.');
        return;
      }

      const { error } = await supabase.from('contracts').insert([
        {
          client_id: formClientId.trim(),
          worker_id: currentUserId,
          service_name: formServiceName.trim(),
          description: formDescription.trim(),
          total: parseFloat(formTotal),
          service_date: formDate.trim(),
          status: 'En proceso'
        }
      ]);

      if (error) throw error;

      Alert.alert('Éxito', 'Contrato creado correctamente');
      setIsCreateModalVisible(false);
      setFormClientId('');
      setFormServiceName('');
      setFormDescription('');
      setFormTotal('');
      setFormDate('');
      fetchContracts();
    } catch (error: any) {
      Alert.alert('Error al crear contrato', error.message);
    }
  };

  // Construir objeto markedDates para el calendario con puntos indicadores
  const markedDates: any = {};
  servicesList.forEach(item => {
    if (item.date) {
      markedDates[item.date] = {
        marked: true,
        dotColor: '#0284C7',
      };
    }
  });

  // Marcar la fecha seleccionada actualmente con color especial
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: '#0F172A',
  };

  const servicesForSelectedDate = servicesList.filter(s => s.date === selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cancelado': return { bg: '#FEE2E2', text: '#DC2626' };
      case 'En camino': return { bg: '#FFF3C7', text: '#D97706' };
      case 'En proceso': return { bg: '#E0F2FE', text: '#0284C7' };
      case 'Completado': return { bg: '#DCFCE7', text: '#16A34A' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado superior con botón de casita hacia clientHome y logo ChambApp */}
      <View style={styles.globalHeaderTopRow}>
        <TouchableOpacity onPress={() => router.push('/clientHome' as any)} style={styles.headerIconBtn}>
          <Ionicons name="home-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.globalHeaderLogo}>ChambApp</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Mis Servicios</Text>
        <Text style={styles.subtitle}>Historial y seguimiento de contratos</Text>
      </View>

      {/* Selector de Vista (Lista / Calendario) */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Lista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleActive]}
          onPress={() => setViewMode('calendar')}
        >
          <Text style={[styles.toggleText, viewMode === 'calendar' && styles.toggleTextActive]}>Calendario</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando contratos...</Text>
        ) : viewMode === 'list' ? (
          <>
            {/* Servicios Activos */}
            <Text style={styles.sectionTitle}>Servicios Activos</Text>
            {servicesList.filter((s: ServiceItem) => s.status === 'En camino' || s.status === 'En proceso').length === 0 ? (
              <Text style={styles.emptyText}>No hay servicios activos.</Text>
            ) : (
              servicesList
                .filter((s: ServiceItem) => s.status === 'En camino' || s.status === 'En proceso')
                .map((item: ServiceItem) => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <TouchableOpacity key={item.id} onPress={() => setSelectedService(item)} style={styles.card}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{item.profession}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                          <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.workerLabel}>
                        {item.displayRoleLabel}: <Text style={styles.workerName}>{item.displayName}</Text>
                      </Text>
                      <Text style={styles.cardDesc}>Descripción: {item.details}</Text>
                    </TouchableOpacity>
                  );
                })
            )}

            {/* Historial Pasado */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Historial Pasado</Text>
            {servicesList.filter((s: ServiceItem) => s.status === 'Completado' || s.status === 'Cancelado').length === 0 ? (
              <Text style={styles.emptyText}>No hay historial previo.</Text>
            ) : (
              servicesList
                .filter((s: ServiceItem) => s.status === 'Completado' || s.status === 'Cancelado')
                .map((item: ServiceItem) => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <TouchableOpacity key={item.id} onPress={() => setSelectedService(item)} style={styles.card}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{item.profession}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                          <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.workerLabel}>
                        {item.displayRoleLabel}: <Text style={styles.workerName}>{item.displayName}</Text>
                      </Text>
                      <Text style={styles.cardDesc}>Descripción: {item.details}</Text>
                    </TouchableOpacity>
                  );
                })
            )}
          </>
        ) : (
          /* Vista de Calendario Estilo ios */
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#64748B',
                selectedDayBackgroundColor: '#0F172A',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#0284C7',
                dayTextColor: '#1E293B',
                textDisabledColor: '#CBD5E1',
                arrowColor: '#0284C7',
                monthTextColor: '#0F172A',
                textMonthFontWeight: 'bold',
                textMonthFontSize: 20,
              }}
              style={styles.calendarStyle}
            />

            {/* Lista inferior de eventos para la fecha seleccionada */}
            <View style={styles.agendaSection}>
              <Text style={styles.sectionTitle}>Contratos para el {selectedDate}</Text>
              {servicesForSelectedDate.length === 0 ? (
                <Text style={styles.emptyText}>No hay contratos agendados para este día.</Text>
              ) : (
                servicesForSelectedDate.map((item: ServiceItem) => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <TouchableOpacity key={item.id} onPress={() => setSelectedService(item)} style={styles.agendaCard}>
                      <View style={styles.agendaRow}>
                        <View style={styles.agendaIconBox}>
                          <Ionicons name="document-text" size={20} color="#0284C7" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.cardTitle}>{item.profession}</Text>
                          <Text style={styles.workerLabel}>{item.displayRoleLabel}: {item.displayName}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                          <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* Modal de Detalles */}
        {selectedService && (
          <ContractRequestModal
            visible={!!selectedService}
            onClose={() => setSelectedService(null)}
            contractData={selectedService}
          />
        )}
      </ScrollView>

      {/* Botón flotante temporal (Solo visible para trabajadores) */}
      {userRole === 'trabajador' && (
        <TouchableOpacity style={styles.fab} onPress={() => setIsCreateModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Nuevo Contrato</Text>
        </TouchableOpacity>
      )}

      {/* Modal temporal para crear contrato */}
      <Modal visible={isCreateModalVisible} transparent animationType="slide" onRequestClose={() => setIsCreateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.createModalContent}>
            <Text style={styles.modalHeaderTitle}>Crear Contrato de Prueba</Text>
            
            <Text style={styles.inputLabel}>UUID del Cliente (client_id)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. d3b07384-d113-41..."
              placeholderTextColor="#94A3B8"
              value={formClientId}
              onChangeText={setFormClientId}
            />

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
              style={styles.input}
              placeholder="Ej. Arreglar tubería rota"
              placeholderTextColor="#94A3B8"
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
              placeholder="2026-08-30"
              placeholderTextColor="#94A3B8"
              value={formDate}
              onChangeText={setFormDate}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateContract}>
              <Text style={styles.submitButtonText}>Guardar Contrato</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsCreateModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  globalHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  globalHeaderLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', margin: 16, borderRadius: 8, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  toggleActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  toggleTextActive: { color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  workerLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  workerName: { fontWeight: '600', color: '#0F172A' },
  cardDesc: { fontSize: 14, color: '#475569' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  loadingText: { textAlign: 'center', color: '#64748B', marginTop: 20 },
  emptyText: { color: '#94A3B8', fontStyle: 'italic', marginBottom: 12 },
  calendarContainer: { flex: 1 },
  calendarStyle: { borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  agendaSection: { marginTop: 10 },
  agendaCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  agendaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  agendaIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#0F172A', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, elevation: 6 },
  fabText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  createModalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 16, textAlign: 'center' },
  inputLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 10, marginBottom: 4, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#0F172A', backgroundColor: '#F8FAFC' },
  submitButton: { backgroundColor: '#0284C7', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 14 }
});