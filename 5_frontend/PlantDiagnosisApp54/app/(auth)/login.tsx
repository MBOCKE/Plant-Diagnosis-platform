import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../src/store/authStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('remembered_email').then(saved => {
      if (saved) { setEmail(saved); setRememberMe(true); }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Validation', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      if (rememberMe) await AsyncStorage.setItem('remembered_email', email);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-[#2E7D32] rounded-full items-center justify-center mb-4">
              <Ionicons name="leaf" size={40} color="#FFFFFF" />
            </View>
            <Text className="text-2xl font-bold text-[#2E7D32]">Plant Diagnosis</Text>
            <Text className="text-sm text-[#757575] mt-2 text-center">Sign in to access your farm's health reports.</Text>
          </View>
          <View className="bg-white rounded-2xl p-6">
            <Input label="Email Address" placeholder="Email Address" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Password" placeholder="Password" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry />
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity className="flex-row items-center" onPress={() => setRememberMe(!rememberMe)}>
                <Ionicons name={rememberMe ? 'checkbox' : 'square-outline'} size={20} color={rememberMe ? '#2E7D32' : '#757575'} />
                <Text className="text-sm text-[#757575] ml-2">Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity><Text className="text-sm text-[#2E7D32] font-medium">Forgot Password?</Text></TouchableOpacity>
            </View>
            <Button title="Login" onPress={handleLogin} loading={loading} icon="log-in-outline" />
          </View>
          <View className="items-center mt-6">
            <Text className="text-sm text-[#757575]">
              Don't have an account?{' '}
              <Text className="text-[#2E7D32] font-semibold" onPress={() => router.push('/(auth)/register')}>Register here</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}