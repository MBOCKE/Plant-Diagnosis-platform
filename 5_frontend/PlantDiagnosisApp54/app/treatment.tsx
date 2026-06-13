import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';

export default function TreatmentScreen() {
  const params = useLocalSearchParams<{ crop?: string; disease?: string }>();
  const [expanded, setExpanded] = useState<string[]>(['cultural']);

  const sections = [
    { id: 'cultural', icon: 'leaf' as const, title: 'Cultural Practices', items: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering', 'Apply mulch'] },
    { id: 'biological', icon: 'flask' as const, title: 'Biological Controls', items: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'] },
    { id: 'chemical', icon: 'beaker' as const, title: 'Chemical Options', items: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'] },
    { id: 'safety', icon: 'shield-checkmark' as const, title: 'Safety Precautions', items: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'] },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <Header title="Treatment Info" showBack />
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-start mt-4 mb-4">
          <View className="flex-1">
            <Text className="text-xl font-bold text-[#212121]">{params.disease || 'Early Blight'}</Text>
            <Text className="text-sm text-[#757575] italic">Alternaria solani</Text>
          </View>
          <Badge urgency="treat_soon" label="Treat Soon" />
        </View>
        {sections.map(section => (
          <View key={section.id} className="bg-white rounded-xl mb-3 overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={() => setExpanded(prev => prev.includes(section.id) ? prev.filter(s => s !== section.id) : [...prev, section.id])}>
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-[#E8F5E9] rounded-full items-center justify-center"><Ionicons name={section.icon} size={20} color="#2E7D32" /></View>
                <Text className="font-semibold text-[#212121]">{section.title}</Text>
              </View>
              <Ionicons name={expanded.includes(section.id) ? 'chevron-up' : 'chevron-down'} size={20} color="#757575" />
            </TouchableOpacity>
            {expanded.includes(section.id) && (
              <View className="px-4 pb-4 pl-14">
                {section.items.map((item, i) => (
                  <View key={i} className="flex-row items-start gap-2 py-1"><View className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full mt-2" /><Text className="text-[#424242] flex-1">{item}</Text></View>
                ))}
              </View>
            )}
          </View>
        ))}
        <Button title="Save Treatment" onPress={() => {}} icon="bookmark" className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}