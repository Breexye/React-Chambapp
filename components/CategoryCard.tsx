import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Colors } from '@/constants/colors'; 

const { width } = Dimensions.get('window');
const isWebOrTablet = width > 768;

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  name: string;
  icon: IoniconsName; 
  count: number;
}

export const CategoryCard = ({ name, icon, count }: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={Colors.light.iconColor} />
      </View>
      <Text style={styles.name}>{name}</Text>
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
  }
});