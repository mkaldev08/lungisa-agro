import { CropCard } from '@/components';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { NavigationButton } from '@/components/navigation-button';

const CROP_DATA = [
  { id: '1', name: 'Milho' },
  { id: '2', name: 'Café' },
  { id: '3', name: 'Couve' },
  { id: '4', name: 'Tomate' },
];

export const CropSelection: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View className='bg-white flex-1 px-4 pt-6'>
      <Text className='text-2xl font-bold text-green-900 mb-6 text-center'>
        Escolha o que você planta:
      </Text>

      <FlatList
        data={CROP_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className='flex-1'>
            <CropCard
              name={item.name}
              onPress={() => {
                navigation.navigate('MapOfRegion', { cropId: item.id })
              }
              }
            />
          </View>
        )}
      />
    </View>
  );
};

