import React from "react";
import { TouchableOpacity, Text } from 'react-native';

interface CropCardProps {
  name: string;
  onPress?: () => void;
}

export const CropCard: React.FC<CropCardProps> = ({ name, onPress }) => {
  return (
    <TouchableOpacity
      accessibilityRole='button'
      accessibilityLabel={`Select ${name}`}
      onPress={onPress}
       className='bg-green-100 rounded-xl border border-green-200 p-6 min-h-[200px] items-center justify-center'
    >
      <Text className='text-xl font-bold text-green-900'>{name}</Text>

    </TouchableOpacity>
  );
}