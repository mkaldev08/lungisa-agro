import React from "react";
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

interface CropCardProps {
  name: string;
  onPress?: () => void;
}

const CROP_ICONS: Record<string, string> = {
  'Milho': 'corn',
  'Café': 'wheat-awn',
  'Couve': 'leaf',
  'Tomate': 'fruit-cherries',
};

export const CropCard: React.FC<CropCardProps> = ({ name, onPress }) => {
  const iconName = CROP_ICONS[name] || 'flower';

  return (
    <TouchableOpacity
      accessibilityRole='button'
      accessibilityLabel={`Select ${name}`}
      onPress={onPress}
      className='bg-green-100 rounded-xl border border-green-200 p-6 min-h-[200px] items-center justify-center'
    >
      <View className='mb-3'>
        {CROP_ICONS["Café"] === iconName ? (
          <FontAwesome6 name={iconName} size={36} color='#166534' />
        ) : (
          <MaterialCommunityIcons name={iconName} size={40} color='#166534' />)}
      </View>
      <Text className='text-xl font-bold text-green-900'>{name}</Text>
    </TouchableOpacity>
  );
}