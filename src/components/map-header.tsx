import React from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MapHeaderProps } from '../types/map';

export const MapHeader: React.FC<MapHeaderProps> = ({ title, subtitle }) => {
  return (
    <View className='bg-white px-6 py-4 border-b border-gray-200'>
      <View className='flex-row items-center'>
        <MaterialCommunityIcons name='map-marker' size={28} color='#166534' />
        <Text className='text-2xl font-bold text-green-900 ml-3'>{title}</Text>
      </View>
      {subtitle && (
        <Text className='text-sm text-gray-600 mt-2 ml-8'>{subtitle}</Text>
      )}
    </View>
  );
};
