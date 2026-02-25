import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationButton } from '@/components/navigation-button';

export const AreaInputScreen: React.FC = () => {
  const navigation = useNavigation();
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');

  function calculateArea() {
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    if (!isNaN(widthNum) && !isNaN(lengthNum)) {
      const areaHectares = (widthNum * lengthNum) * 0.0001; // Convert m² to hectares
      setArea(areaHectares.toFixed(2)); // Keep 2 decimal places
    } else {
      setArea('');
    }
  }

  return (
    <View className='flex-1 bg-white px-6 pt-6 justify-between'>
      <View>
        <Text className='text-2xl font-bold text-green-900 mb-6'>
          Inserir Área de Cultivo
        </Text>
        
        <Text className='text-base text-gray-600 mb-4'>
          Qual é o tamanho da área que você deseja cultivar?
        </Text>
        
        <View className='mb-4'>
          <Text className='text-sm text-gray-500 mb-2'>Largura (m)</Text>
          <TextInput
            className='bg-gray-100 p-4 rounded-xl text-lg border border-gray-200'
            placeholder='Ex: 50'
            keyboardType='decimal-pad'
            value={width}
            onChangeText={setWidth}
          />

          <Text className='text-sm text-gray-500 mt-2'>Comprimento (m)</Text>
          <TextInput
            className='bg-gray-100 p-4 rounded-xl text-lg border border-gray-200'
            placeholder='Ex: 100'
            keyboardType='decimal-pad'
            value={length}
            onChangeText={setLength}
          />
          <Text>Confirme a área em hectares: {area ? parseFloat(area) * 0.01 : 0}</Text>


        </View>
      </View>

      <View className='pb-6'>
        <NavigationButton
          title='Ver Recomendação'
          onPress={() => navigation.navigate('Result')}
          disabled={!area}
        />
      </View>
    </View>
  );
};
