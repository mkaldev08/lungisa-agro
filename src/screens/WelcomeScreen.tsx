import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationButton } from '@/components/navigation-button';

export const Welcome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className='flex-1 bg-white items-center justify-center px-6'>
      <View className='items-center mb-12'>
        <Text className='text-4xl font-bold text-green-900 mb-4'>🌱 Lungisa Agro</Text>
        <Text className='text-lg text-gray-600 text-center'>
          Sistema de Recomendação Agrícola
        </Text>
        <Text className='text-base text-gray-500 text-center mt-2'>
          Descubra as melhores práticas para sua cultura
        </Text>
      </View>

      <View className='w-full'>
        <NavigationButton
          title='Começar'
          onPress={() => navigation.navigate('CropSelection')}
        />
      </View>
    </View>
  );
};

