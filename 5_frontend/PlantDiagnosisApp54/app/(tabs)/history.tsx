import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { UrgencyLevel } from '../../src/types';

const mockCases = [
  { id: '1', crop: 'Tomato', emoji: '🍅', disease: 'Early Blight', date: 'Oct 15, 2026', urgency: 'treat_soon' as UrgencyLevel, label: 'Treat Soon' },
  { id: '2', crop: 'Banana', emoji: '🍌', disease: 'Black Sigatoka', date: 'Oct 12, 2026', urgency: 'treat_immediately' as UrgencyLevel, label: 'Treat Immediately' },
  { id: '3', crop: 'Tomato', emoji: '🍅', disease: 'Healthy', date: 'Oct 10, 2026', urgency: 'healthy' as const, label: 'Healthy' },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState<'all' | 'tomato' | 'banana'>('all');
  const filtered = filter === 'all' ? mockCases : mockCases.filter(c => c.crop.toLowerCase().includes(filter));

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-[#2E7D32]">My Cases</Text>
        <TouchableOpacity><Ionicons name="search" size={22} color="#2E7D32" /></TouchableOpacity>
      </View>
      <View className="flex-row px-6 gap-4 mb-4">
        {(['all', 'tomato', 'banana'] as const).map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text className={`font-semibold ${filter === f ? 'text-[#2E7D32]' : 'text-[#757575]'}`}>{f === 'all' ? 'All' : f === 'tomato' ? '🍅 Tomato' : '🍌 Banana'}</Text>
            {filter === f && <View className="h-0.5 bg-[#2E7D32] mt-1 rounded-full" />}
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {filtered.map(item => (
          <Card key={item.id} className="mb-3">
            <View className="flex-row items-center gap-3">
              <View className="w-14 h-14 bg-[#F5F5F5] rounded-lg items-center justify-center"><Text className="text-2xl">{item.emoji}</Text></View>
              <View className="flex-1"><Text className="font-semibold text-[#212121]">{item.disease}</Text><Text className="text-xs text-[#757575]">{item.date}</Text></View>
              <Badge urgency={item.urgency} label={item.label} />
              <Ionicons name="chevron-forward" size={18} color="#757575" />
            </View>
          </Card>
        ))}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}