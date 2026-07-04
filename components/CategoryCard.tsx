import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const isWebOrTablet = width > 768;

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface CategoryCardProps {
  name: string;
  icon: string;
  count: number;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, count, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      {/* Círculo del Icono */}
      <View style={styles.iconCircle}>
        <Ionicons name={icon as IoniconsName} size={28} color="#0085FF" />
      </View>
      
      {/* Nombre del Oficio */}
      <Text style={styles.name}>{name}</Text>
      
      {/* Contador de Trabajos */}
      <Text style={styles.count}>{count} trabajos</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: isWebOrTablet ? '15%' : '25%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: Colors.light.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isWebOrTablet ? 0.08 : 0,
    shadowRadius: 4,
    elevation: isWebOrTablet ? 2 : 0,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    color: Colors.light.secondary,
  },
  count: {
    fontSize: 9,
    color: Colors.light.accent,
    marginTop: 2,
  },
});