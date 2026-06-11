import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void };
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-[#E0E0E0]">
      <View className="w-10">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-lg font-semibold text-[#212121]">{title}</Text>
      <View className="w-10 items-end">
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} className="p-1">
            <Ionicons name={rightAction.icon} size={24} color="#2E7D32" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}