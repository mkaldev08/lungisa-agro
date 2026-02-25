import React from 'react';
import { Text, View } from 'react-native';
import { MapHeaderProps } from '@/types/map';

export const MapHeader: React.FC<MapHeaderProps> = ({ title, subtitle }) => {
  return (
    <View className='bg-white px-6 py-4 border-b border-gray-200'>
      <Text className='text-2xl font-bold text-green-900'>{title}</Text>
      {subtitle && (
        <Text className='text-sm text-gray-600 mt-1'>{subtitle}</Text>
      )}
    </View>
  );
};
