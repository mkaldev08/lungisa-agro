import React from 'react';
import { Text, View } from 'react-native';
import { RegionInfoCardProps } from '@/types/map';

export const RegionInfoCard: React.FC<RegionInfoCardProps> = ({
  province,
  municipality,
  area,
}) => {
  if (!province && !municipality && !area) return null;

  return (
    <View className='absolute bottom-6 left-6 right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-200'>
      {province && (
        <View className='mb-2'>
          <Text className='text-xs text-gray-500 uppercase'>Província</Text>
          <Text className='text-lg font-semibold text-green-900'>{province}</Text>
        </View>
      )}
      {municipality && (
        <View className='mb-2'>
          <Text className='text-xs text-gray-500 uppercase'>Município</Text>
          <Text className='text-base text-gray-800'>{municipality}</Text>
        </View>
      )}
      {area && (
        <View>
          <Text className='text-xs text-gray-500 uppercase'>Área</Text>
          <Text className='text-base text-gray-800'>{area}</Text>
        </View>
      )}
    </View>
  );
};
