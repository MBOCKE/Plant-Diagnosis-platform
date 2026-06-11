import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UrgencyLevel } from '../types';

interface BadgeProps {
  urgency: UrgencyLevel | 'healthy';
  label: string;
}

const badgeStyles = {
  monitor: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', icon: 'eye' as keyof typeof Ionicons.glyphMap },
  treat_soon: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', icon: 'warning' as keyof typeof Ionicons.glyphMap },
  treat_immediately: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', icon: 'alert-circle' as keyof typeof Ionicons.glyphMap },
  healthy: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap },
};

export function Badge({ urgency, label }: BadgeProps) {
  const style = badgeStyles[urgency] || badgeStyles.monitor;

  return (
    <View className={`flex-row items-center gap-1.5 self-start px-3 py-1.5 rounded-full ${style.bg}`}>
      <Ionicons name={style.icon} size={14} color={style.text.replace('text-', '')} />
      <Text className={`text-xs font-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}