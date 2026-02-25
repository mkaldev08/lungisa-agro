import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationButton } from '@/components/navigation-button';

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-6'>
        <Text className='text-2xl font-bold text-green-900 mb-6'>
          Recomendação Agrícola
        </Text>
        
        <View className='bg-green-50 p-6 rounded-xl mb-6 border border-green-200'>
          <Text className='text-lg font-semibold text-green-900 mb-2'>
            ✅ Cultivo Recomendado
          </Text>
          <Text className='text-base text-gray-700'>
            Com base nas informações fornecidas, sua área é adequada para o cultivo selecionado.
          </Text>
        </View>

        <View className='bg-white p-6 rounded-xl mb-6 border border-gray-200'>
          <Text className='text-lg font-semibold text-gray-900 mb-4'>
            Recomendações:
          </Text>
          <Text className='text-base text-gray-700 mb-2'>
            • Utilize fertilizantes orgânicos
          </Text>
          <Text className='text-base text-gray-700 mb-2'>
            • Irrigação regular recomendada
          </Text>
          <Text className='text-base text-gray-700 mb-2'>
            • Controle de pragas preventivo
          </Text>
        </View>
      </ScrollView>

      <View className='px-6 pb-6 gap-3'>
        <NavigationButton
          title='Nova Consulta'
          onPress={() => navigation.navigate('Welcome')}
        />
        <NavigationButton
          title='Voltar ao Início'
          variant='secondary'
          onPress={() => navigation.navigate('Welcome')}
        />
      </View>
    </View>
  );
}; 