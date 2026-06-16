import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuthStore } from '../../src/store/authStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    type: 'Point' as const,
    coordinates: [0, 0] as [number, number],
    country: '',
    region: '',
    town: '',
  });
  const [locationError, setLocationError] = useState(false);

  // Auto-capture location on mount
  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = async () => {
    setLocationLoading(true);
    setLocationError(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;

      // Reverse geocode to get human-readable address
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setUserLocation({
        type: 'Point',
        coordinates: [longitude, latitude],
        country: address?.country || '',
        region: address?.region || '',
        town: address?.city || address?.subregion || '',
      });
    } catch (error) {
      console.log('Location error:', error);
      setLocationError(true);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation', 'Fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        email,
        password,
        name,
        phone,
        preferredLanguage: language,
        location: locationError ? undefined : userLocation,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const locationDisplay = locationLoading
    ? 'Detecting your location...'
    : locationError
      ? 'Location not detected - tap to retry'
      : userLocation.town
        ? `${userLocation.town}, ${userLocation.region}, ${userLocation.country}`
        : 'Location detected';

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
            
            {/* Language Selector */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-[#212121] mb-1">Preferred Language</Text>
              <View className="flex-row gap-3">
                {(['en', 'fr'] as const).map(lang => (
                  <View key={lang} className="flex-1">
                    <Button title={lang === 'en' ? 'English' : 'Français'} onPress={() => setLanguage(lang)} variant={language === lang ? 'primary' : 'outline'} />
                  </View>
                ))}
              </View>
            </View>

            {/* Location Indicator */}
            <TouchableOpacity 
              onPress={locationError ? captureLocation : undefined}
              className={`rounded-xl p-4 flex-row items-center gap-3 ${locationError ? 'bg-orange-50 border border-orange-200' : 'bg-[#E8F5E9]'}`}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
              ) : (
                <Ionicons 
                  name={locationError ? 'location-outline' : 'location'} 
                  size={20} 
                  color={locationError ? '#F57C00' : '#2E7D32'} 
                />
              )}
              <View className="flex-1">
                <Text className={`text-sm font-semibold ${locationError ? 'text-orange-700' : 'text-[#2E7D32]'}`}>
                  {locationDisplay}
                </Text>
                <Text className="text-xs text-[#757575] mt-0.5">
                  {locationError 
                    ? 'Tap to retry. Used for regional disease tracking.' 
                    : 'Auto-detected for regional disease tracking. Your privacy is protected.'}
                </Text>
              </View>
              {locationError && (
                <Ionicons name="refresh" size={18} color="#F57C00" />
              )}
            </TouchableOpacity>
          </View>
          
          <Button title="Register" onPress={handleRegister} loading={loading} className="mt-6" />
          <View className="items-center mt-6 mb-10">
            <Text className="text-sm text-[#757575]">Already have an account?{' '}
              <Text className="text-[#2E7D32] font-semibold" onPress={() => router.back()}>Login</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}