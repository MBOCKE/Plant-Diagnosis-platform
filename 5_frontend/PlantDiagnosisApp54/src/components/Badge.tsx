import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UrgencyLevel } from '../types';

interface BadgeProps {
  urgency: UrgencyLevel | 'healthy';
  label: string;
}

const badgeStyles: Record<BadgeProps['urgency'] | 'healthy' | 'monitor', { bg: string; text: string; iconColor: string; icon: keyof typeof Ionicons.glyphMap }> = {
  monitor: { bg: '#DBEAFE', text: '#1D4ED8', iconColor: '#1D4ED8', icon: 'eye' },
  treat_soon: { bg: '#FFE4CC', text: '#C2410C', iconColor: '#C2410C', icon: 'warning' },
  treat_immediately: { bg: '#FEE2E2', text: '#B91C1C', iconColor: '#B91C1C', icon: 'alert-circle' },
  healthy: { bg: '#DCFCE7', text: '#15803D', iconColor: '#15803D', icon: 'checkmark-circle' },
};

export function Badge({ urgency, label }: BadgeProps) {
  const s = (badgeStyles as any)[urgency] || badgeStyles.monitor;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Ionicons name={s.icon} size={14} color={s.iconColor} />
      <Text style={[styles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

