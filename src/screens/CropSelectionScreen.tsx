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
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
  };

  return (
    <View className='bg-white flex-1 px-4 pt-6'>
      <Text className='text-2xl font-bold text-green-900 mb-6 text-center'>
        Selecione o tipo de cultura:
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
              onPress={() => handleCropSelect(item.id)} 
            />
          </View>
        )}
      />

      <View className='absolute bottom-6 left-4 right-4'>
        <NavigationButton
          title='Próximo'
          onPress={() => navigation.navigate('MapOfRegion')}
          disabled={!selectedCrop}
        />
      </View>
    </View>
  );
};

