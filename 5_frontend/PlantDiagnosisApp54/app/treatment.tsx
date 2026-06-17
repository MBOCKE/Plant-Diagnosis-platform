import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';

export default function TreatmentScreen() {
  const params = useLocalSearchParams<{ crop?: string; disease?: string }>();
  const [expanded, setExpanded] = useState<string[]>(['cultural']);

  const sections = useMemo(
    () => [
      {
        id: 'cultural',
        icon: 'leaf' as const,
        title: 'Cultural Practices',
        items: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering', 'Apply mulch'],
      },
      {
        id: 'biological',
        icon: 'flask' as const,
        title: 'Biological Controls',
        items: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'],
      },
      {
        id: 'chemical',
        icon: 'beaker' as const,
        title: 'Chemical Options',
        items: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'],
      },
      {
        id: 'safety',
        icon: 'shield-checkmark' as const,
        title: 'Safety Precautions',
        items: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'],
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Treatment Info" showBack />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.diseaseTitle}>{params.disease || 'Early Blight'}</Text>
            <Text style={styles.scientific}>Alternaria solani</Text>
          </View>
          <Badge urgency="treat_soon" label="Treat Soon" />
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
                  {section.items.map((item, i) => (
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

        <View style={styles.footerBtnWrap}>
          <Button title="Save Treatment" onPress={() => {}} icon="bookmark" />
        </View>
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

  footerBtnWrap: { marginBottom: 32 },
});

