import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';
import { StyleSheet } from 'react-native';
import { Case, CropType } from '../../src/types';
import { casesAPI } from '../../src/services/api';

const cropEmojiByType: Record<CropType, string> = {
  tomato: '🍅',
  banana_plantain: '🍌',
};



export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const pulse = useState(new Animated.Value(0.7))[0];

  useEffect(() => {
    let active = true;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    setLoading(true);
    casesAPI.getUserCases({ page: 1, limit: 3 }).then(({ cases }) => {
      if (active) setRecentCases(cases);
    }).catch(() => {
      if (active) setRecentCases([]);
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.title}>{user?.name || 'Farmer'}!</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.primaryCard} onPress={() => router.push('/camera')}>
          <View style={styles.primaryRow}>
            <View style={styles.primaryIconWrap}>
              <Ionicons name="camera" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.primaryTitle}>Diagnose a Plant</Text>
              <Text style={styles.primarySubtitle}>Take photo or upload from gallery</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Select Crop</Text>

        <View style={styles.cropRow}>
          <TouchableOpacity
            style={styles.cropCard}
            onPress={() => router.push({ pathname: '/camera', params: { crop: 'tomato' as CropType } })}
          >
            <Text style={styles.cropEmoji}>🍅</Text>
            <Text style={styles.cropText}>Tomato</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cropCard}
            onPress={() => router.push({ pathname: '/camera', params: { crop: 'banana_plantain' as CropType } })}
          >
            <Text style={styles.cropEmoji}>🍌</Text>
            <Text style={styles.cropText}>Banana / Plantain</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Diagnoses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <Animated.View style={[styles.loadingIcon, { opacity: pulse }]}> 
              <Ionicons name="leaf-outline" size={24} color="#2E7D32" />
            </Animated.View>
            <Text style={styles.emptyStateTitle}>Loading your recent diagnoses…</Text>
            <Text style={styles.emptyStateText}>The latest cases are being fetched from the gateway.</Text>
          </View>
        ) : recentCases.length > 0 ? recentCases.map(item => (
          <Card key={item.id} style={{ marginBottom: 12 }} onPress={() => {}}>
            <View style={styles.caseRow}>
              <View style={styles.caseImageWrap}>
                <Text style={styles.imageMockText}>{cropEmojiByType[item.cropType] || '🖼️'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.caseDisease} numberOfLines={1}>
                  {item.diagnosis?.primaryDiagnosis?.disease ?? 'Unknown'}
                </Text>
                <Text style={styles.caseDate}>{new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
              </View>
              <Badge urgency={(item.treatment?.urgency ?? 'monitor') as any} label={item.treatment?.urgencyLabel ?? 'Monitor'} />
            </View>
          </Card>
        )) : (
          <View style={styles.emptyStateBox}>
            <Text style={styles.emptyStateTitle}>No recent diagnoses yet</Text>
            <Text style={styles.emptyStateText}>Your latest cases will appear here after you diagnose a plant.</Text>
          </View>
        )}


        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { fontSize: 14, color: '#757575' },
  title: { fontSize: 20, fontWeight: '700', color: '#212121' },
  logoutBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1, paddingHorizontal: 24 },
  primaryCard: {
    marginTop: 16,
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryRow: { flexDirection: 'row', alignItems: 'center' },
  primaryIconWrap: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  primarySubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#212121', marginTop: 24, marginBottom: 12 },
  cropRow: { flexDirection: 'row', gap: 12 },
  cropCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cropEmoji: { fontSize: 38, marginBottom: 8 },
  cropText: { fontSize: 15, fontWeight: '600', color: '#212121' },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  historyTitle: { fontSize: 18, fontWeight: '600', color: '#212121' },
  seeAll: { color: '#2E7D32', fontWeight: '700', fontSize: 14 },
  caseRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  caseImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  imageMockText: { fontSize: 18 },

  caseDisease: { fontWeight: '700', color: '#212121' },
  caseDate: { fontSize: 12, color: '#757575', marginTop: 2 },
  emptyStateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyStateTitle: { fontSize: 14, fontWeight: '700', color: '#212121', marginBottom: 4 },
  emptyStateText: { fontSize: 13, color: '#757575', textAlign: 'center', lineHeight: 18 },

});

