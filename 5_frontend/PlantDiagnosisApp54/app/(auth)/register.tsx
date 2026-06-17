import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useAuthStore } from '../../src/store/authStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/utils/theme';

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

  useEffect(() => {
    captureLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={40} color={Colors.surface} />
            </View>
            <Text style={styles.title}>Plant Diagnosis</Text>
            <Text style={styles.subtitle}>Join to start diagnosing your crops.</Text>
          </View>

          <View style={styles.card}>
            <Button title="Back" onPress={() => router.back()} variant="outline" icon="arrow-back" style={styles.backButton} />

            <Text style={styles.cardTitle}>Create Account</Text>

            <Input
              label="Full Name"
              placeholder="e.g. Jean Doe"
              value={name}
              onChangeText={setName}
              icon="person-outline"
            />
            <Input
              label="Email"
              placeholder="jean@example.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Phone Number"
              placeholder="+237 6XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              keyboardType="phone-pad"
              optional
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry
            />
            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock-closed-outline"
              secureTextEntry
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Language</Text>
              <View style={styles.languageRow}>
                {(['en', 'fr'] as const).map((lang) => (
                  <View key={lang} style={styles.languageItem}>
                    <Button
                      title={lang === 'en' ? 'English' : 'Français'}
                      onPress={() => setLanguage(lang)}
                      variant={language === lang ? 'primary' : 'outline'}
                    />
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={locationError ? captureLocation : undefined}
              style={[styles.locationBox, locationError ? styles.locationBoxError : null]}
            >
              <View style={styles.locationIconWrap}>
                {locationLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Ionicons
                    name={locationError ? 'location-outline' : 'location'}
                    size={20}
                    color={locationError ? Colors.warning : Colors.primary}
                  />
                )}
              </View>

              <View style={styles.locationTextWrap}>
                <Text style={styles.locationTitle}>{locationDisplay}</Text>
                <Text style={styles.locationDescription}>
                  {locationError
                    ? 'Tap to retry. Used for regional disease tracking.'
                    : 'Auto-detected for regional disease tracking. Your privacy is protected.'}
                </Text>
              </View>

              {locationError && <Ionicons name="refresh" size={18} color={Colors.warning} />}
            </TouchableOpacity>

            <View style={styles.registerButtonWrap}>
              <Button title="Register" onPress={handleRegister} loading={loading} />
            </View>

            <View style={styles.bottomLinkWrap}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <Text style={styles.loginLink} onPress={() => router.back()}>
                Login
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
  },
  backButton: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: Colors.textPrimary,
  },
  section: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  languageItem: {
    flex: 1,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  locationBoxError: {
    borderColor: Colors.warning,
  },
  locationIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  registerButtonWrap: {
    marginTop: 2,
  },
  bottomLinkWrap: {
    marginTop: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
});

