import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, className }: ButtonProps) {
  const variants = {
    primary: 'bg-[#2E7D32] text-white',
    secondary: 'bg-[#E8F5E9] text-[#2E7D32]',
    danger: 'bg-red-500 text-white',
    outline: 'border border-[#E0E0E0] bg-white text-[#757575]',
  };

  return (
    <TouchableOpacity
      className={`h-12 rounded-xl items-center justify-center flex-row gap-2 ${variants[variant]} ${(disabled || loading) ? 'opacity-50' : ''} ${className || ''}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2E7D32' : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={variant === 'outline' ? '#757575' : '#FFFFFF'} />}
          <Text className={`font-semibold text-base ${variant === 'outline' ? 'text-[#757575]' : 'text-white'}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}