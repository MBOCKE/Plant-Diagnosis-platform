import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '../../src/store/authStore';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/utils/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('remembered_email').then((saved) => {
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) await AsyncStorage.setItem('remembered_email', email);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={40} color={Colors.surface} />
            </View>
            <Text style={styles.title}>Plant Diagnosis</Text>
            <Text style={styles.subtitle}>
              Sign in to access your farm's health reports.
            </Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Email Address"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry
            />

            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberRow}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={rememberMe ? Colors.primary : Colors.textSecondary}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonWrap}>
              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                icon="log-in-outline"
              />
            </View>
          </View>

          <View style={styles.bottomWrap}>
            <Text style={styles.bottomText}>
              Don't have an account?{' '}
              <Text
                style={styles.registerLink}
                onPress={() => router.push('/(auth)/register')}
              >
                Register here
              </Text>
            </Text>
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 14,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  buttonWrap: {
    marginTop: 6,
  },
  bottomWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
});

