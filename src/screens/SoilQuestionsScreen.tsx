import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationButton } from '@/components/navigation-button';

export const SoilQuestionsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-6'>
        <Text className='text-2xl font-bold text-green-900 mb-6'>
          Perguntas Rápidas sobre o Solo
        </Text>
        
        <View className='mb-6'>
          <Text className='text-lg text-gray-700 mb-4'>
            Responda algumas perguntas para melhorar nossa recomendação:
          </Text>
          
          {/* Placeholder for questions */}
          <View className='bg-gray-100 p-4 rounded-xl mb-4'>
            <Text className='text-base text-gray-600'>
              1. Qual é o tipo de solo?
            </Text>
          </View>
          
          <View className='bg-gray-100 p-4 rounded-xl mb-4'>
            <Text className='text-base text-gray-600'>
              2. O solo é irrigado?
            </Text>
          </View>
          
          <View className='bg-gray-100 p-4 rounded-xl mb-4'>
            <Text className='text-base text-gray-600'>
              3. Qual é a drenagem do solo?
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className='px-6 pb-6'>
        <NavigationButton
          title='Próximo'
          onPress={() => navigation.navigate('AreaInput')}
        />
      </View>
    </View>
  );
};