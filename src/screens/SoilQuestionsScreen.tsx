import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationButton } from '@/components/navigation-button';
import { soilQuestions } from '@/constants/questions';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { voiceService } from '@/services/voiceService';
import { useAccessibilityStore } from '@/store/accessibilityStore';

type Props = StaticScreenProps<{
  cropId: string;
  latitude: number;
  longitude: number;
}>;

type SelectedAnswers = {
  [questionId: string]: string;
};

export const SoilQuestionsScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { cropId, latitude, longitude } = route.params as { cropId: string; latitude: number; longitude: number };
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);
  const announcedActionRef = useRef(false);

  const speakIfEnabled = useCallback(
    (text: string) => {
      if (voiceEnabled) {
        voiceService.speak(text);
      }
    },
    [voiceEnabled],
  );

  const handleOptionSelect = (
    questionId: string,
    optionId: string,
    questionText: string,
    optionLabel: string,
    questionIndex: number,
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    speakIfEnabled(`Pergunta ${questionIndex + 1}. ${questionText}. Resposta: ${optionLabel}.`);
  };

  const handleNext = () => {
    navigation.navigate('AreaInput', {
      cropId,
      latitude,
      longitude,
      soilAnswers: selectedAnswers,
    });
  };

  const allQuestionsAnswered = soilQuestions.every(
    (question) => selectedAnswers[question.id]
  );

  useVoiceGuide('Responda às perguntas sobre o solo. Toque na opção certa.', []);

  useEffect(() => {
    if (allQuestionsAnswered && !announcedActionRef.current) {
      announcedActionRef.current = true;
      speakIfEnabled('Botão Próximo disponível.');
      return;
    }

    if (!allQuestionsAnswered) {
      announcedActionRef.current = false;
    }
  }, [allQuestionsAnswered, speakIfEnabled]);

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 mt-5'>
        <View className='items-center mb-4'>
          <MaterialCommunityIcons name='help-circle-outline' size={32} color='#166534' />
        </View>
        <Text className='text-2xl font-bold text-green-900 mb-6 text-center'>
          Perguntas sobre o Solo
        </Text>

        <View className='mb-6 w-full'>
          <Text className='text-lg text-gray-700 mb-4 text-center'>
            Responda algumas perguntas rápidas para melhorarmos a recomendação:
          </Text>

          {soilQuestions.map((question, questionIndex) => (
            <View key={question.id} className='mb-6'>
              <View className='flex-row items-center mb-3'>
                <View className='w-8 h-8 rounded-full bg-green-600 items-center justify-center mr-3'>
                  <Text className='text-white font-bold text-sm'>{questionIndex + 1}</Text>
                </View>
                <Text className='text-base font-semibold text-gray-800 flex-1'>
                  {question.text}
                </Text>
              </View>

              <View className='space-y-2'>
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      accessibilityRole='button'
                      onPress={() => handleOptionSelect(
                        question.id,
                        option.id,
                        question.text,
                        option.label,
                        questionIndex,
                      )}
                      className={`p-4 rounded-xl border-2 mt-3 ${isSelected
                        ? 'bg-green-50 border-green-600'
                        : 'bg-white border-gray-300'
                        }`}
                    >
                      <Text
                        className={`text-base ${isSelected
                          ? 'text-green-900 font-semibold'
                          : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {
          !allQuestionsAnswered ? (
            <Text className='text-red-500 text-center mb-4'>
              Responda todas as perguntas para continuar.
            </Text>
          ) : (
            <View className='px-6 pb-6 w-full'>
              <NavigationButton
                title='Próximo'
                onPress={handleNext}

              />
            </View>
          )
        }

      </ScrollView>

    </View>
  );
};