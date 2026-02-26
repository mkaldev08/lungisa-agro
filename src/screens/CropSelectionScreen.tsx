import { CropCard } from '@/components';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { NavigationButton } from '@/components/navigation-button';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { voiceService } from '@/services/voiceService';
import { useAccessibilityStore } from '@/store/accessibilityStore';

const CROP_DATA = [
  { id: '1', name: 'Milho' },
  { id: '2', name: 'Café' },
  { id: '3', name: 'Couve' },
  { id: '4', name: 'Tomate' },
];

export const CropSelection: React.FC = () => {
  const navigation = useNavigation();
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);
  const availableCrops = 'Milho, Café, Couve e Tomate';

  useVoiceGuide(
    `Escolha a cultura. Disponíveis: ${availableCrops}. Toque em uma para continuar.`,
    [],
  );

  const speakIfEnabled = useCallback(
    (text: string) => {
      if (voiceEnabled) {
        voiceService.speak(text);
      }
    },
    [voiceEnabled],
  );
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
                speakIfEnabled(`Cultura ${item.name} selecionada. Agora escolha a localização.`);
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

