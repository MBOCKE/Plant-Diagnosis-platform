import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: 'language' as const, label: 'Preferred Language', value: 'Français' },
    { icon: 'location' as const, label: 'My Location', value: 'Foumbot, West Region' },
    { icon: 'notifications' as const, label: 'Notifications', toggle: true },
    { icon: 'information-circle' as const, label: 'About' },
    { icon: 'shield-checkmark' as const, label: 'Privacy Policy' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-6 mb-8">
          <View className="w-24 h-24 bg-[#2E7D32] rounded-full items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">{(user?.name || 'F').charAt(0).toUpperCase()}</Text>
          </View>
          <Text className="text-xl font-bold text-[#212121]">{user?.name || 'Farmer'}</Text>
          <Text className="text-sm text-[#757575]">{user?.email || 'farmer@email.com'}</Text>
        </View>
        <Card className="mb-8 p-0 overflow-hidden">
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} className="flex-row items-center justify-between px-5 py-4 border-b border-[#F5F5F5] last:border-0">
              <View className="flex-row items-center gap-3"><Ionicons name={item.icon} size={22} color="#757575" /><Text className="text-[#212121]">{item.label}</Text></View>
              {item.toggle ? (
                <View className="w-11 h-6 bg-[#2E7D32] rounded-full justify-center items-end px-0.5"><View className="w-5 h-5 bg-white rounded-full" /></View>
              ) : (
                <View className="flex-row items-center gap-2">{item.value && <Text className="text-sm text-[#757575]">{item.value}</Text>}<Ionicons name="chevron-forward" size={18} color="#757575" /></View>
              )}
            </TouchableOpacity>
          ))}
        </Card>
        <Button title="Logout" onPress={logout} variant="danger" icon="log-out-outline" className="mb-10" />
      </ScrollView>
    </SafeAreaView>
  );
}