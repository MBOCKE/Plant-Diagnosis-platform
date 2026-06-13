import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  // Allow existing screens to pass NativeWind-style className without breaking build.
  // className will be ignored since NativeWind was removed.
  className?: string;
}

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, ViewStyle> = {
  primary: { backgroundColor: '#2E7D32' },
  secondary: { backgroundColor: '#E8F5E9' },
  danger: { backgroundColor: '#EF4444' },
  outline: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0' },
};

const textVariants: Record<NonNullable<ButtonProps['variant']>, TextStyle> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#2E7D32' },
  danger: { color: '#FFFFFF' },
  outline: { color: '#757575' },
};

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        buttonVariants[variant],
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2E7D32' : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'outline' ? '#757575' : textVariants[variant].color}
            />
          )}
          <Text style={[styles.textBase, textVariants[variant]]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
