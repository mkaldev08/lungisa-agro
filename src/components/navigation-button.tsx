import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface NavigationButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  title,
  variant = 'primary',
  ...props
}) => {
  const bgColor = variant === 'primary' ? 'bg-green-600' : 'bg-gray-200';
  const textColor = variant === 'primary' ? 'text-white' : 'text-gray-800';

  return (
    <TouchableOpacity
      accessibilityRole='button'
      className={`${bgColor} py-4 px-8 rounded-xl items-center justify-center min-h-[56px]`}
      {...props}
    >
      <Text className={`${textColor} text-lg font-bold`}>{title}</Text>
    </TouchableOpacity>
  );
};
