import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationButton } from '@/components/navigation-button';
import { voiceService } from '@/services/voiceService';
import { useAccessibilityStore } from '@/store/accessibilityStore';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { useForm, Controller } from "react-hook-form"
import { z } from 'zod'

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
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);
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

  useVoiceGuide(
    'Digite a largura e o comprimento. Depois toque em Calcular Dosagem.',
    [],
  );

  useVoiceGuide(errors.width ? 'Largura obrigatória.' : '', [errors.width?.message]);
  useVoiceGuide(errors.length ? 'Comprimento obrigatório.' : '', [errors.length?.message]);

  const speakIfEnabled = useCallback(
    (text: string) => {
      if (voiceEnabled) {
        voiceService.speak(text);
      }
    },
    [voiceEnabled],
  );

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
      <View className='items-center mb-4'>
        <MaterialCommunityIcons name='square-edit-outline' size={32} color='#166534' />
      </View>
      <Text className='text-3xl font-bold text-primary mb-2 text-center'>Tamanho da Área</Text>
      <Text className='text-base text-gray-600 mb-8 text-center'>
        Qual o tamanho da área que você vai plantar?
      </Text>

      <View className='w-full bg-white rounded-lg p-6 shadow-sm mb-6'>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='mb-5'>
              <View className='flex-row items-center mb-2'>
                <MaterialCommunityIcons name='arrow-left-right' size={16} color='#374151' />
                <Text className='text-sm font-semibold text-gray-700 ml-2'>Largura (metros)</Text>
              </View>
              <TextInput
                placeholder="Exemplo: 100"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onFocus={() => speakIfEnabled('Digite a largura em metros.')}
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
              <View className='flex-row items-center mb-2'>
                <MaterialCommunityIcons name='arrow-up-down' size={16} color='#374151' />
                <Text className='text-sm font-semibold text-gray-700 ml-2'>Comprimento (metros)</Text>
              </View>
              <TextInput
                placeholder="Exemplo: 200"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onFocus={() => speakIfEnabled('Digite o comprimento em metros.')}
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
          <View className='items-center mb-2'>
            <MaterialCommunityIcons name='check-circle' size={28} color='#166534' />
          </View>
          <Text className='text-gray-700 text-center mb-1'>Área Total</Text>
          <Text className='text-3xl font-bold text-green-700 text-center'>{area} ha</Text>
          <Text className='text-sm text-gray-600 text-center mt-1'>{(parseFloat(area) * 10000).toFixed(0)} m²</Text>
        </View>
      )}

      <View className='w-full mt-auto'>
        <NavigationButton
          title='Calcular Dosagem'
          onPress={() => {
            speakIfEnabled('Calculando. Aguarde.');
            navigation.navigate('Result', {
              area,
              cropId,
              latitude,
              longitude,
              soilAnswers,
            });
          }}
          disabled={!area}
        />
      </View>
    </View>
  );
};
