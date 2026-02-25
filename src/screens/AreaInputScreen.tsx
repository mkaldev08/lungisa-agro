import React, { useEffect, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { NavigationButton } from '@/components/navigation-button';
import { useForm, Controller } from "react-hook-form"
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod';
type Props = StaticScreenProps<{
  cropId: string;
  latitude: number;
  longitude: number;
  soilAnswers?: { [questionId: string]: string };
}>;

const schema = z.object({
  width: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Largura deve ser um número",
  }),
  length: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: "Comprimento deve ser um número",
  }),
})

export const AreaInputScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { cropId, latitude, longitude, soilAnswers } = route.params as {
    cropId: string;
    latitude: number;
    longitude: number;
    soilAnswers?: { [questionId: string]: string }
  };
  const [area, setArea] = useState('');

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      width: "",
      length: "",
    },
  })

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.width && value.length) {
        calculateArea(value.width, value.length);
      } else {
        setArea('');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const calculateArea = (width: string, length: string) => {
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    if (!isNaN(widthNum) && !isNaN(lengthNum)) {
      const areaHectares = (widthNum * lengthNum) * 0.0001;
      setArea(areaHectares.toFixed(2));
    } else {
      setArea('');
    }
  };

  return (
    <View className='flex-1 bg-gradient-to-b bg-white to-white px-6 py-8'>
      <Text className='text-3xl font-bold text-gray-800 mb-2 text-center'>Tamanho da Área</Text>
      <Text className='text-base text-gray-600 mb-8 text-center'>
        Qual o tamanho da área que você vai plantar?
      </Text>

      <View className='w-full bg-white rounded-lg p-6 shadow-sm mb-6'>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='mb-5'>
              <Text className='text-sm font-semibold text-gray-700 mb-2'>Largura (metros)</Text>
              <TextInput
                placeholder="Exemplo: 100"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="decimal-pad"
                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
              />
              {errors.width && <Text className='text-red-500 text-sm mt-1'>Largura é obrigatória.</Text>}
            </View>
          )}
          name="width"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text className='text-sm font-semibold text-gray-700 mb-2'>Comprimento (metros)</Text>
              <TextInput
                placeholder="Exemplo: 200"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="decimal-pad"
                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
              />
              {errors.length && <Text className='text-red-500 text-sm mt-1'>Comprimento é obrigatório.</Text>}
            </View>
          )}
          name="length"
        />
      </View>

      {area && (
        <View className='w-full bg-green-100 rounded-lg p-6 mb-8 border border-green-300'>
          <Text className='text-gray-700 text-center mb-1'>Área Total</Text>
          <Text className='text-3xl font-bold text-green-700 text-center'>{area} ha</Text>
          <Text className='text-sm text-gray-600 text-center mt-1'>{(parseFloat(area) * 10000).toFixed(0)} m²</Text>
        </View>
      )}

      <View className='w-full mt-auto'>
        <NavigationButton
          title='Calcular Dosagem'
          onPress={() => navigation.navigate('Result', {
            area,
            cropId,
            latitude,
            longitude,
            soilAnswers
          })}
          disabled={!area}
        />
      </View>
    </View>
  );
};
