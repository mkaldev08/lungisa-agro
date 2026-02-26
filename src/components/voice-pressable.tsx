import React, { useCallback } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAccessibilityStore } from '@/store/accessibilityStore';
import { voiceService } from '@/services/voiceService';

interface VoicePressableProps extends TouchableOpacityProps {
  label: string;
  speakText?: string;
}

export const VoicePressable: React.FC<VoicePressableProps> = ({
  label,
  speakText,
  onPress,
  className,
  ...props
}) => {
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPress?.(event);

      if (speakText && voiceEnabled) {
        voiceService.speak(speakText);
      }
    },
    [onPress, speakText, voiceEnabled],
  );

  return (
    <TouchableOpacity
      accessibilityRole='button'
      onPress={handlePress}
      className={`py-3 px-4 rounded-lg items-center justify-center flex-row ${className ?? ''}`}
      {...props}
    >
      <MaterialCommunityIcons name='volume-medium' size={18} color='#166534' />
      <Text className='text-base text-green-800 font-semibold ml-2'>{label}</Text>
    </TouchableOpacity>
  );
};
