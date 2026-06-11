import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { CropSelector } from '../../src/components/CropSelector';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          <Button title="" onPress={() => router.back()} variant="outline" icon="arrow-back" className="w-12 h-12 mb-4 rounded-full" />

          <Text className="text-2xl font-bold text-[#2E7D32] mb-1">Create Account</Text>
          <Text className="text-sm text-[#757575] mb-8">Join to start diagnosing your crops.</Text>

          <View className="bg-white rounded-2xl p-6">
            <Input label="Full Name" placeholder="e.g. Jean Doe" value={name} onChangeText={setName} icon="person-outline" />
            <Input label="Email" placeholder="jean@example.com" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Phone Number" placeholder="+237 6XX XXX XXX" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" optional />
            <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry />
            <Input label="Confirm Password" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} icon="lock-closed-outline" secureTextEntry />

            <View className="mb-4">
              <Text className="text-xs font-medium text-[#212121] mb-1">Preferred Language</Text>
              <View className="flex-row gap-3">
                {(['en', 'fr'] as const).map((lang) => (
                  <View key={lang} className="flex-1">
                    <Button
                      title={lang === 'en' ? 'English' : 'Français'}
                      onPress={() => setLanguage(lang)}
                      variant={language === lang ? 'primary' : 'outline'}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Button title="Register" onPress={handleRegister} loading={loading} className="mt-6" />

          <View className="items-center mt-6 mb-10">
            <Text className="text-sm text-[#757575]">
              Already have an account?{' '}
              <Text className="text-[#2E7D32] font-semibold" onPress={() => router.back()}>Login</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}