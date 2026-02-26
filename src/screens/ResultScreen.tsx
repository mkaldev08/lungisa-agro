import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationButton } from '@/components/navigation-button';
import { getRecommendation } from '@/services/api.service';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { voiceService } from '@/services/voiceService';
import { useAccessibilityStore } from '@/store/accessibilityStore';
import type { RecommendationResponse, CropId, SoilAnswer } from '@/types/api';

type Props = StaticScreenProps<{
  area: string;
  cropId: string;
  latitude: number;
  longitude: number;
  soilAnswers?: { [questionId: string]: string };
}>;

const CROP_NAMES: Record<string, string> = {
  '1': 'Milho',
  '2': 'Café',
  '3': 'Couve',
  '4': 'Tomate',
};

const CROP_ID_MAP: Record<string, CropId> = {
  '1': 'maize',
  '2': 'coffee',
  '3': 'cabbage',
  '4': 'tomato',
};

export const ResultScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { area, cropId, latitude, longitude, soilAnswers } = route.params as {
    area: string;
    cropId: string;
    latitude: number;
    longitude: number;
    soilAnswers?: { [questionId: string]: string };
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlayingRecommendation, setIsPlayingRecommendation] = useState(false);
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);

  const fetchRecommendation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert soilAnswers to array format
      const answers: SoilAnswer[] = soilAnswers
        ? Object.entries(soilAnswers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        }))
        : [];

      const requestPayload = {
        crop: CROP_ID_MAP[cropId],
        lat: latitude,
        lon: longitude,
        areaHa: parseFloat(area),
        answers,
      };

      const response = await getRecommendation(requestPayload);

      setData(response);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching recommendation:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = 'Erro ao buscar as recomendações.';

      if (err.message === 'Network Error' || err.message === 'Network request failed') {
        errorMessage = 'Sem conexão com a internet. Verifique e tente novamente.';
      } else if (err.response) {
        errorMessage = `Erro no servidor: ${err.response.status}. ${err.response.data?.message || 'Tente novamente.'}`;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de espera esgotado. O servidor pode estar iniciando. Tente novamente.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [area, cropId, latitude, longitude, soilAnswers]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  useVoiceGuide(
    !loading && !error && data ? 'Recomendação pronta. Toque para ouvir.' : '',
    [loading, error, data],
  );

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchRecommendation();
  };

  const speakRecommendation = useCallback(async () => {
    if (!data) return;
    try {
      setIsPlayingRecommendation(true);
      const { recommendation } = data;
      const cropName = CROP_NAMES[cropId] || 'cultura';
      const speech = [
        `Recomendação para ${cropName}.`,
        `Área: ${area} hectares.`,
        `Adubo recomendado: ${recommendation.fertilizer}.`,
        `Quantidade total: ${recommendation.totalKg} quilogramas.`,
        `Quantidade por hectare: ${recommendation.baseRateKgHa} quilogramas.`,
        `Sacos de 25 kg: ${recommendation.bags25kg.bagsRounded}.`,
        ...(recommendation.perHoleDose ? [
          `Por cova: ${recommendation.perHoleDose.gramsPerHole.toFixed(1)} gramas.`,
          `Ou ${recommendation.perHoleDose.spoonsPerHole.toFixed(1)} colheres.`,
        ] : []),
        `Aplicação: ${recommendation.timing}.`,
      ].join(' ');
      await voiceService.speak(speech);
    } catch (err) {
      console.error('Erro ao falar recomendacao:', err);
    } finally {
      setIsPlayingRecommendation(false);
    }
  }, [data, cropId, area]);

  const handleStopRecommendation = useCallback(async () => {
    await voiceService.stop();
    setIsPlayingRecommendation(false);
  }, []);

  if (loading) {
    return (
      <View className='flex-1 bg-white items-center justify-center px-6'>
        <ActivityIndicator size='large' color='#166534' />
        <Text className='text-gray-600 mt-4 text-center'>
          Calculando suas recomendações...
        </Text>
        <Text className='text-gray-500 text-sm mt-2 text-center'>
          Aguarde um momento
        </Text>
        {retryCount > 0 && (
          <Text className='text-gray-400 text-xs mt-2'>
            Tentativa {retryCount + 1}
          </Text>
        )}
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className='flex-1 bg-white items-center justify-center px-6'>
        <Text className='text-red-600 text-center text-lg mb-6'>
          {error || 'Erro desconhecido'}
        </Text>
        <Text className='text-gray-600 text-center text-sm mb-6'>
          {retryCount > 0 && `Tentativas: ${retryCount}`}
        </Text>
        <NavigationButton
          title='Tentar Novamente'
          onPress={handleRetry}
        />
        <View className='mt-3'>
          <NavigationButton
            title='Voltar ao Início'
            variant='secondary'
            onPress={() => navigation.navigate('Welcome')}
          />
        </View>
      </View>
    );
  }

  const { soil, recommendation } = data;

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-6' contentContainerStyle={{ paddingBottom: 220 }}>
        <View className='gap-6'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-3xl font-bold text-green-900 flex-1'>
              Sua Recomendação
            </Text>
            {voiceEnabled && (
              <TouchableOpacity
                onPress={isPlayingRecommendation ? handleStopRecommendation : speakRecommendation}
                className='ml-3 p-2 rounded-full bg-green-100 border border-green-300'
                accessibilityRole='button'
              >
                <MaterialCommunityIcons
                  name={isPlayingRecommendation ? 'stop-circle' : 'play-circle'}
                  size={24}
                  color='#166534'
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Area and Crop Info */}
          <View className='bg-green-50 p-5 rounded-2xl border border-green-200'>
            <View className='flex-row justify-between items-center mb-2'>
              <Text className='text-sm text-gray-600'>Tamanho da Área:</Text>
              <Text className='text-lg font-bold text-green-900'>{area} ha</Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text className='text-sm text-gray-600'>Cultura:</Text>
              <Text className='text-lg font-bold text-green-900'>{CROP_NAMES[cropId]}</Text>
            </View>
          </View>

          {/* Soil Analysis */}
          <View className='bg-blue-50 p-5 rounded-2xl border border-blue-200'>
            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons name='earth' size={20} color='#1E3A8A' />
              <Text className='text-lg font-semibold text-blue-900 ml-2'>
                Como é o seu Solo
              </Text>
            </View>
            <View className='space-y-4'>
              <View className='bg-white p-4 rounded-xl'>
                <Text className='text-xs text-gray-600 mb-1'>Classificação do Solo (USDA)</Text>
                <Text className='font-bold text-blue-900 text-base'>{soil.classification}</Text>
              </View>

              <View className='flex-row justify-between'>
                <View className='flex-1 pr-3'>
                  <Text className='text-xs text-gray-600'>pH (Acidez)</Text>
                  <Text className='font-semibold text-gray-900'>{soil.ph.toFixed(1)}</Text>
                  <Text className='text-xs text-gray-500 mt-1'>
                    {soil.ph < 5.5 ? 'Muito ácido' : soil.ph < 6.5 ? 'Ácido' : soil.ph < 7.5 ? 'Neutro' : 'Alcalino'}
                  </Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-xs text-gray-600'>Matéria Orgânica</Text>
                  <Text className='font-semibold text-gray-900'>{soil.organic_carbon.toFixed(1)}%</Text>
                  <Text className='text-xs text-gray-500 mt-1'>
                    {soil.organic_carbon > 3 ? 'Boa' : soil.organic_carbon > 1.5 ? 'Média' : 'Baixa'}
                  </Text>
                </View>
              </View>

              <View className='bg-white p-4 rounded-xl'>
                <Text className='text-xs text-gray-600 mb-2'>Composição do Solo</Text>
                <View className='space-y-2'>
                  <View className='flex-row justify-between items-center'>
                    <View className='flex-row items-center'>
                      <MaterialCommunityIcons name='circle' size={10} color='#FACC15' />
                      <Text className='text-gray-700 ml-2'>Areia: {soil.sand.toFixed(0)}%</Text>
                    </View>
                    <View className='flex-1 ml-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <View style={{ width: `${Math.min(soil.sand, 100)}%` }} className='bg-yellow-400 h-full'></View>
                    </View>
                  </View>
                  <View className='flex-row justify-between items-center'>
                    <View className='flex-row items-center'>
                      <MaterialCommunityIcons name='circle' size={10} color='#FB923C' />
                      <Text className='text-gray-700 ml-2'>Argila: {soil.clay.toFixed(0)}%</Text>
                    </View>
                    <View className='flex-1 ml-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <View style={{ width: `${Math.min(soil.clay, 100)}%` }} className='bg-red-400 h-full'></View>
                    </View>
                  </View>
                  <View className='flex-row justify-between items-center'>
                    <View className='flex-row items-center'>
                      <MaterialCommunityIcons name='circle' size={10} color='#9CA3AF' />
                      <Text className='text-gray-700 ml-2'>Lama: {soil.silt.toFixed(0)}%</Text>
                    </View>
                    <View className='flex-1 ml-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <View style={{ width: `${Math.min(soil.silt, 100)}%` }} className='bg-gray-400 h-full'></View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Fertilizer Recommendation */}
          <View className='bg-green-100 p-5 rounded-2xl border border-green-300'>
            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons name='sprout' size={20} color='#14532D' />
              <Text className='text-lg font-semibold text-green-900 ml-2'>
                Adubo Recomendado
              </Text>
            </View>
            <View className='space-y-4'>
              <View className='bg-white p-4 rounded-xl'>
                <Text className='text-xs text-gray-600 mb-1'>Tipo de Adubo</Text>
                <Text className='font-bold text-xl text-green-900'>{recommendation.fertilizer}</Text>
                <Text className='text-xs text-gray-600 mt-1'>
                  {recommendation.fertilizer.split('-')[0]} = Nitrogênio |
                  {recommendation.fertilizer.split('-')[1]} = Fósforo |
                  {recommendation.fertilizer.split('-')[2]} = Potássio
                </Text>
              </View>

              <View className='bg-green-50 p-4 rounded-xl border border-green-200'>
                <View className='flex-row justify-between mb-2'>
                  <View>
                    <Text className='text-xs text-gray-600'>Por Hectare</Text>
                    <Text className='font-bold text-lg text-green-900'>{recommendation.baseRateKgHa} kg</Text>
                  </View>
                  <View>
                    <Text className='text-xs text-gray-600'>Para sua área</Text>
                    <Text className='font-bold text-lg text-green-900'>{recommendation.totalKg} kg</Text>
                  </View>
                </View>
                <View className='flex-row justify-between'>
                  <Text className='text-sm text-gray-700'>Sacos de 25kg:</Text>
                  <Text className='font-bold text-lg text-green-900'>{recommendation.bags25kg.bagsRounded} sacos</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Per Hole Dose (if available for all crops) */}
          {recommendation.perHoleDose && (
            <View className='bg-yellow-50 p-5 rounded-2xl border border-yellow-200'>
              <View className='flex-row items-center mb-4'>
                <MaterialCommunityIcons name='ruler-square' size={20} color='#854D0E' />
                <Text className='text-lg font-semibold text-yellow-900 ml-2'>
                  Quanto Colocar em Cada Cova
                </Text>
              </View>
              <View className='space-y-4'>
                <View className='flex-row justify-between items-center'>
                  <View>
                    <Text className='text-sm text-gray-700'>Por cova (Gramas)</Text>
                    <Text className='font-bold text-2xl text-yellow-900'>
                      {recommendation.perHoleDose.gramsPerHole.toFixed(1)}g
                    </Text>
                  </View>
                  <View className='flex-1 ml-4'>
                    <Text className='text-sm text-gray-700 mb-1'>Por cova (Colheres)</Text>
                    <Text className='font-bold text-2xl text-yellow-900'>
                      {recommendation.perHoleDose.spoonsPerHole.toFixed(1)} colheres
                    </Text>
                    <Text className='text-xs text-gray-600 mt-1'>
                      (1 colher ≈ {recommendation.perHoleDose.spoonSizeGrams}g)
                    </Text>
                  </View>
                </View>

                <View className='bg-white p-4 rounded-xl border border-yellow-100'>
                  <View className='flex-row items-center mb-2'>
                    <MaterialCommunityIcons name='lightbulb-on-outline' size={16} color='#6B7280' />
                    <Text className='text-xs text-gray-600 ml-2'>Dica Prática</Text>
                  </View>
                  <Text className='text-sm text-gray-700'>
                    Você tem aproximadamente <Text className='font-bold'>{recommendation.perHoleDose.plantDensityPerHa.toLocaleString()}</Text> plantas por hectare.
                  </Text>
                  <Text className='text-xs text-gray-600 mt-2'>
                    Use uma colher de sopa como medida rápida para adicionar o adubo em cada cova durante o plantio.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Soil Type and Notes */}
          <View className='bg-indigo-50 p-5 rounded-2xl border border-indigo-200'>
            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons name='chart-bar' size={20} color='#3730A3' />
              <Text className='text-lg font-semibold text-indigo-900 ml-2'>
                O Que Significa Seu Solo
              </Text>
            </View>
            <View className='bg-white p-4 rounded-xl'>
              <Text className='font-bold text-indigo-900 mb-2'>{recommendation.soilType === 'acidic' ? 'Solo Ácido' : recommendation.soilType === 'sandy' ? 'Solo Arenoso' : 'Solo com Boa Fertilidade'}</Text>
              <Text className='text-sm text-gray-700 leading-5'>
                {recommendation.soilType === 'acidic'
                  ? 'Seu solo é ácido demais. O calcário ajuda a corrigir. O adubo que recomendamos funciona bem neste tipo de solo.'
                  : recommendation.soilType === 'sandy'
                    ? 'Seu solo é arenoso e perde nutrientes rápido. Você precisa aplicar o adubo em partes para não desperdiçar.'
                    : 'Seu solo tem boa qualidade. O adubo funciona bem e o nitrogênio será bem aproveitado pelas plantas.'}
              </Text>
            </View>
          </View>

          {/* Application Timing */}
          <View className='bg-purple-50 p-5 rounded-2xl border border-purple-200'>
            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons name='clock-outline' size={20} color='#5B21B6' />
              <Text className='text-lg font-semibold text-purple-900 ml-2'>
                Quando e Como Aplicar
              </Text>
            </View>
            <View className='bg-white p-4 rounded-xl'>
              <Text className='text-base text-gray-800 leading-6'>{recommendation.timing}</Text>
            </View>
          </View>

          {/* Recommendations and Notes */}
          <View className='bg-orange-50 p-5 rounded-2xl border border-orange-200'>
            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons name='lightbulb-on-outline' size={20} color='#9A3412' />
              <Text className='text-lg font-semibold text-orange-900 ml-2'>
                Dicas Para Melhor Resultado
              </Text>
            </View>
            <View className='space-y-3'>
              {recommendation.notes.map((note, index) => (
                <View key={index} className='flex-row items-start'>
                  <MaterialCommunityIcons name='check-circle' size={16} color='#9A3412' style={{ marginTop: 3, marginRight: 12 }} />
                  <Text className='text-gray-700 flex-1 leading-5'>{note}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Assumptions */}
          {recommendation.assumptions && recommendation.assumptions.length > 0 && (
            <View className='bg-cyan-50 p-5 rounded-2xl border border-cyan-200'>
              <View className='flex-row items-center mb-3'>
                <MaterialCommunityIcons name='information-outline' size={20} color='#0E7490' />
                <Text className='text-lg font-semibold text-cyan-900 ml-2'>
                  Valores Assumidos
                </Text>
              </View>
              <View className='space-y-3'>
                {recommendation.assumptions.map((assumption, index) => (
                  <View key={index} className='flex-row items-start'>
                    <MaterialCommunityIcons name='information-outline' size={16} color='#0E7490' style={{ marginTop: 2, marginRight: 8 }} />
                    <Text className='text-gray-700 flex-1 text-sm leading-4'>{assumption}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reasoning */}
          {recommendation.reasoning && recommendation.reasoning.length > 0 && (
            <View className='bg-gray-50 p-5 rounded-2xl border border-gray-200'>
              <View className='flex-row items-center mb-3'>
                <MaterialCommunityIcons name='clipboard-text-outline' size={20} color='#374151' />
                <Text className='text-lg font-semibold text-gray-700 ml-2'>
                  Suas Respostas
                </Text>
              </View>
              <View className='space-y-3'>
                {recommendation.reasoning.map((reason, index) => (
                  <View key={index} className='flex-row items-start'>
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='#4B5563' style={{ marginTop: 6, marginRight: 8 }} />
                    <Text className='text-gray-700 flex-1 text-sm'>{reason}</Text>
                  </View>
                ))}
              </View>
              <Text className='text-xs text-gray-500 mt-4 leading-4'>
                Essas respostas ajudaram a gente a definir o tipo de solo e escolher o melhor adubo para você.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-3 border-t border-gray-200 w-full'>
        <View className='gap-2 mb-3'>
          <NavigationButton
            title='Fazer Nova Consulta'
            onPress={() => navigation.navigate('CropSelection')}
          />

        </View>
        <View>
          <NavigationButton
            title='Voltar ao Início'
            variant='secondary'
            onPress={() => navigation.navigate('Welcome')}
          />
        </View>
      </View>
    </View>
  );
}; 