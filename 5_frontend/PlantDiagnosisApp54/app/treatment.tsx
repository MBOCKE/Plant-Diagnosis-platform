import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { useRouter } from 'expo-router';
import { Badge } from '../src/components/Badge';
import { TreatmentSkeleton } from '../src/components/LoadingSkeleton';
import { treatmentAPI } from '../src/services/api';

export default function TreatmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ crop?: string; disease?: string; treatment?: string }>();
  const [expanded, setExpanded] = useState<string[]>(['cultural']);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);

  const handleClose = () => {
    if (typeof (router as { dismissAll?: () => void }).dismissAll === 'function') {
      (router as { dismissAll: () => void }).dismissAll();
    }
    router.replace('/(tabs)');
  };

  useEffect(() => {
    let parsed = null;
    try {
      parsed = params.treatment ? JSON.parse(params.treatment) : null;
    } catch {
      parsed = null;
    }

    if (parsed && Object.keys(parsed).length) {
      setPlan(parsed);
      setLoading(false);
      return;
    }

    const run = async () => {
      if (!params.crop || !params.disease) {
        setLoading(false);
        return;
      }

      try {
        const fetched = await treatmentAPI.getTreatmentByCaseId(params.crop || '', params.disease);
        setPlan(fetched || {
          urgency: 'treat_soon',
          urgencyLabel: 'Treat Soon',
          cultural: ['Remove infected leaves', 'Improve air circulation'],
          biological: ['Apply Trichoderma to soil'],
          chemical: ['Follow crop-safe fungicide guidance'],
          precautions: ['Wear gloves and mask', 'Follow local agronomic guidance'],
        });
      } catch {
        setPlan({
          urgency: 'treat_soon',
          urgencyLabel: 'Treat Soon',
          cultural: ['Remove infected leaves', 'Improve air circulation'],
          biological: ['Apply Trichoderma to soil'],
          chemical: ['Follow crop-safe fungicide guidance'],
          precautions: ['Wear gloves and mask', 'Follow local agronomic guidance'],
        });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.crop, params.disease, params.treatment]);

  const sections = useMemo(() => [
    {
      id: 'cultural',
      icon: 'leaf' as const,
      title: 'Cultural Practices',
      items: plan?.cultural || [],
    },
    {
      id: 'biological',
      icon: 'flask' as const,
      title: 'Biological Controls',
      items: plan?.biological || [],
    },
    {
      id: 'chemical',
      icon: 'beaker' as const,
      title: 'Chemical Options',
      items: plan?.chemical || [],
    },
    {
      id: 'safety',
      icon: 'shield-checkmark' as const,
      title: 'Safety Precautions',
      items: plan?.precautions || [],
    },
  ], [plan]);

  if (loading) return <TreatmentSkeleton />;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Treatment Info" rightIcon="close" onRightPress={handleClose} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.diseaseTitle}>{params.disease || 'Early Blight'}</Text>
            <Text style={styles.scientific}>{plan?.scientificName || 'Follow crop-safe guidance'}</Text>
          </View>
          <Badge urgency={plan?.urgency || 'treat_soon'} label={plan?.urgencyLabel || 'Treat Soon'} />
        </View>

        {sections.map(section => {
          const isOpen = expanded.includes(section.id);
          return (
            <View key={section.id} style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpanded(prev =>
                    prev.includes(section.id)
                      ? prev.filter(s => s !== section.id)
                      : [...prev, section.id],
                  )
                }
              >
                <View style={styles.headerLeft}>
                  <View style={styles.iconBubble}>
                    <Ionicons name={section.icon} size={20} color="#2E7D32" />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>

                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#757575"
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.sectionBody}>
                  {section.items.map((item: string, i: number) => (
                    <View key={`${section.id}-${i}`} style={styles.itemRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
  },
  topLeft: { flex: 1 },
  diseaseTitle: { fontSize: 20, fontWeight: '700', color: '#212121' },
  scientific: { fontSize: 14, color: '#757575', fontStyle: 'italic', marginTop: 2 },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBubble: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#212121' },

  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 56,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    marginTop: 6,
  },
  itemText: { flex: 1, color: '#424242', fontSize: 14 },
});

