import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { NavigationButton } from '@/components/navigation-button';
import { soilQuestions } from '@/constants/questions';

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

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
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

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 mt-5'>
        <Text className='text-2xl font-bold text-green-900 mb-6 text-center'>
          Perguntas sobre o Solo
        </Text>

        <View className='mb-6 w-full'>
          <Text className='text-lg text-gray-700 mb-4 text-center'>
            Responda algumas perguntas rápidas para melhorarmos a recomendação:
          </Text>

          {soilQuestions.map((question, questionIndex) => (
            <View key={question.id} className='mb-6'>
              <Text className='text-base font-semibold text-gray-800 mb-3'>
                {questionIndex + 1}. {question.text}
              </Text>

              <View className='space-y-2'>
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      accessibilityRole='button'
                      onPress={() => handleOptionSelect(question.id, option.id)}
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