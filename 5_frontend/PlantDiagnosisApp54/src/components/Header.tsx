import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack }: HeaderProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center px-6 py-3 bg-white border-b border-[#E0E0E0]">
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
      )}
      <Text className="text-lg font-semibold text-[#212121]">{title}</Text>
    </View>
  );
}
