import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';

const recentCases = [
  { id: '1', crop: 'tomato' as const, disease: 'Late Blight', urgency: 'treat_soon' as const, label: 'Treat Soon', date: '2h ago' },
  { id: '2', crop: 'banana_plantain' as const, disease: 'Healthy', urgency: 'healthy' as const, label: 'Healthy', date: '1d ago' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View>
          <Text className="text-sm text-[#757575]">Bonjour,</Text>
          <Text className="text-xl font-bold text-[#212121]">{user?.name || 'Farmer'}!</Text>
        </View>
        <TouchableOpacity onPress={logout} className="w-10 h-10 bg-[#E8F5E9] rounded-full items-center justify-center">
          <Ionicons name="log-out-outline" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Diagnose CTA */}
        <TouchableOpacity
          className="bg-[#2E7D32] rounded-2xl p-5 flex-row items-center justify-between mt-4"
          onPress={() => router.push('/camera')}
          activeOpacity={0.9}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="camera" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-white text-lg font-bold">Diagnose a Plant</Text>
              <Text className="text-white/80 text-sm">Take photo or upload from gallery</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Crop Selection */}
        <Text className="text-lg font-semibold text-[#212121] mt-6 mb-3">Select Crop</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 items-center border border-[#E0E0E0]"
            onPress={() => router.push({ pathname: '/camera', params: { crop: 'tomato' } })}
          >
            <Text className="text-4xl mb-2">🍅</Text>
            <Text className="font-semibold text-[#212121]">Tomato</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 items-center border border-[#E0E0E0]"
            onPress={() => router.push({ pathname: '/camera', params: { crop: 'banana_plantain' } })}
          >
            <Text className="text-4xl mb-2">🍌</Text>
            <Text className="font-semibold text-[#212121]">Banana / Plantain</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Cases */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className="text-lg font-semibold text-[#212121]">Recent Diagnoses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text className="text-sm text-[#2E7D32] font-semibold">See All</Text>
          </TouchableOpacity>
        </View>

        {recentCases.map((item) => (
          <Card key={item.id} onPress={() => {}} className="mb-3">
            <View className="flex-row items-center gap-3">
              <View className={`w-14 h-14 rounded-lg items-center justify-center ${item.disease === 'Healthy' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <Text className="text-2xl">{item.crop === 'tomato' ? '🍅' : '🍌'}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-[#212121]">{item.disease}</Text>
                <Text className="text-xs text-[#757575]">{item.date}</Text>
              </View>
              <Badge urgency={item.urgency} label={item.label} />
            </View>
          </Card>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}