import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Case, CropType, UrgencyLevel } from '../../src/types';

type Filter = 'all' | 'tomato' | 'banana';


const mockCases: Case[] = [
  {
    id: '1',
    cropType: 'tomato',
    imageUri: 'mock://case-1',
    symptomsDescription: 'Dark lesions on leaves with yellowing edges. Infection seems to start from lower foliage.',
    latitude: 43.6045,
    longitude: 3.8801,
    status: 'diagnosed',
    createdAt: '2026-10-15T09:12:00.000Z',
    isOfflineCase: false,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Early Blight',
        scientificName: 'Alternaria solani',
        confidence: 94,
      },
      alternativeDiagnoses: [
        { disease: 'Late Blight', confidence: 23 },
        { disease: 'Bacterial Spot', confidence: 12 },
      ],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 1247,
    },
    treatment: {
      urgency: 'treat_soon',
      urgencyLabel: 'Treat Soon',
      cultural: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering', 'Apply mulch'],
      biological: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'],
      chemical: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'],
      precautions: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'],
    },
    followUpNotes: 'Recheck after 7 days. Keep notes of new lesion spread.',
  },
  {
    id: '2',
    cropType: 'banana_plantain',
    imageUri: 'mock://case-2',
    symptomsDescription: 'Brown to black streaks on leaves; lesions expand rapidly under humid conditions.',
    latitude: 40.7128,
    longitude: -74.006,
    status: 'diagnosed',
    createdAt: '2026-10-12T15:35:00.000Z',
    isOfflineCase: false,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Black Sigatoka',
        scientificName: 'Pseudocercospora fijiensis',
        confidence: 89,
      },
      alternativeDiagnoses: [
        { disease: 'Yellow Sigatoka', confidence: 18 },
        { disease: 'Sigatoka leaf spot', confidence: 11 },
      ],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 1320,
    },
    treatment: {
      urgency: 'treat_immediately',
      urgencyLabel: 'Treat Immediately',
      cultural: ['Remove heavily infected leaves', 'Reduce plant density for airflow', 'Avoid water splash onto leaves'],
      biological: ['Apply Trichoderma around the plant base'],
      chemical: ['Protective fungicide application as per label', 'Copper-based spray during peak humidity'],
      precautions: ['Use protective gear', 'Follow pre-harvest interval', 'Do not spray during windy hours'],
    },
    followUpNotes: 'Inspect bunch area and new leaves every 3-4 days.',
  },
  {
    id: '3',
    cropType: 'tomato',
    imageUri: 'mock://case-3',
    symptomsDescription: 'No visible disease signs. Leaves look uniform in color and texture.',
    status: 'synced',
    createdAt: '2026-10-10T08:05:00.000Z',
    isOfflineCase: true,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Healthy',
        confidence: 98,
      },
      alternativeDiagnoses: [],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 990,
    },
    treatment: {
      urgency: 'monitor',
      urgencyLabel: 'Monitor',
      cultural: ['Keep regular inspection', 'Maintain balanced fertilization'],
      biological: [],
      chemical: [],
      precautions: ['Avoid unnecessary sprays'],
    },
    followUpNotes: 'Continue routine monitoring once per week.',
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function cropToFilter(crop: CropType): Filter {
  return crop === 'tomato' ? 'tomato' : 'banana';
}

function cropEmoji(crop: CropType) {
  return crop === 'tomato' ? '🍅' : '🍌';
}

function plural(n: number, singular: string, pluralWord: string) {
  return n === 1 ? singular : pluralWord;
}


function summarizeDisease(disease?: string) {
  return disease || 'Unknown';
}

const sectionStyles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden' as const,
  },
};

export default function HistoryScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);



  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = filter === 'all' ? mockCases : mockCases.filter(c => cropToFilter(c.cropType) === filter);

    const searched = q.length
      ? base.filter(c => {
          const disease = c.diagnosis?.primaryDiagnosis?.disease ?? '';
          const sci = c.diagnosis?.primaryDiagnosis?.scientificName ?? '';
          const sym = c.symptomsDescription ?? '';
          return [disease, sci, sym].some(v => v.toLowerCase().includes(q));
        })
      : base;

    // Always show most recent first
    return [...searched].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filter, query]);


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#2E7D32" />
        {/* Search input placeholder (mock). Replace with TextInput when integrating UX. */}
        <View style={styles.searchInputWrap}>
          <Text style={styles.searchPlaceholder} numberOfLines={1}>{query ? query : 'Search by disease / notes...'}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={() => setQuery('')}>
          <Ionicons name="close" size={18} color="#757575" />
        </TouchableOpacity>
      </View>



      <View style={styles.filterRow}>
        {(['all', 'tomato', 'banana'] as const).map(f => {
          const active = filter === f;
          return (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={styles.filterBtn}>
              <Text style={[styles.filterText, active ? styles.filterTextActive : styles.filterTextInactive]}>
                {f === 'all' ? 'All' : f === 'tomato' ? '🍅 Tomato' : '🍌 Banana'}
              </Text>
              {active && <View style={styles.filterUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map(item => {
          const isExpanded = expandedIds.includes(item.id);
          const primary = item.diagnosis?.primaryDiagnosis;
          const urgency = item.treatment?.urgency ?? ('monitor' as UrgencyLevel);
          const urgencyLabel = item.treatment?.urgencyLabel ?? 'Monitor';

          return (
            <Card key={item.id} style={sectionStyles.card}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setExpandedIds(prev => (prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]))
                }
              >
                <View style={styles.caseTopRow}>
                <View style={styles.caseImageWrap}>
                    {/* When backend is connected, render the real image here using <Image source={{ uri: item.imageUri }} /> */}
                    <Text style={styles.imageMockText}>{item.imageUri ? '🖼️' : cropEmoji(item.cropType)}</Text>
                  </View>



                  <View style={{ flex: 1 }}>
                    {/* Readability: disease name on one line, date on another */}
                    <Text style={styles.caseDisease} numberOfLines={1}>
                      {summarizeDisease(primary?.disease)}
                    </Text>
                    <Text style={styles.caseMeta}>{formatDate(item.createdAt)}</Text>
                  </View>


                  <Badge urgency={urgency as any} label={urgencyLabel} />

                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#757575" />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.detailsWrap}>
                  <Text style={styles.detailsHeader}>Every detail</Text>

                  <View style={styles.gridBlock}>
                    <Text style={styles.blockTitle}>Diagnosis</Text>
                    <Text style={styles.blockTextStrong}>
                      {primary?.disease} {typeof primary?.confidence === 'number' ? `• ${primary.confidence}%` : ''}
                    </Text>
                    {primary?.scientificName ? <Text style={styles.blockText}>Scientific name: {primary.scientificName}</Text> : null}
                    <Text style={styles.blockText}>Model: {item.diagnosis?.modelUsed ?? '—'}</Text>
                    <Text style={styles.blockText}>Inference time: {item.diagnosis?.inferenceTimeMs ?? '—'} ms</Text>

                    {item.diagnosis?.alternativeDiagnoses?.length ? (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.blockSubTitle}>Alternative diagnoses</Text>
                        {item.diagnosis.alternativeDiagnoses.map((d, idx) => (
                          <View key={`${item.id}-alt-${idx}`} style={styles.rowBetween}>
                            <Text style={styles.blockText}>{d.disease}</Text>
                            <Text style={styles.blockTextStrong}>{d.confidence}%</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.gridBlock}>
                    <Text style={styles.blockTitle}>Symptoms</Text>
                    <Text style={styles.blockText}>{item.symptomsDescription ?? '—'}</Text>
                    {typeof item.latitude === 'number' && typeof item.longitude === 'number' ? (
                      <Text style={styles.blockText}>Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
                    ) : null}
                    <Text style={styles.blockText}>Status: {item.status}</Text>
                    <Text style={styles.blockText}>Offline case: {item.isOfflineCase ? 'Yes' : 'No'}</Text>
                  </View>

                  <View style={styles.gridBlock}>
                    <Text style={styles.blockTitle}>Treatment plan</Text>
                    <Text style={styles.blockTextStrong}>{item.treatment?.urgencyLabel ?? '—'}</Text>

                    <View style={{ marginTop: 10 }}>
                      {(
                        [
                          { key: 'cultural', title: 'Cultural Practices', icon: 'leaf' },
                          { key: 'biological', title: 'Biological Controls', icon: 'flask' },
                          { key: 'chemical', title: 'Chemical Options', icon: 'beaker' },
                          { key: 'safety', title: 'Safety Precautions', icon: 'shield-checkmark' },
                        ] as const
                      ).map(sec => {
                        const mapKey = sec.key as keyof NonNullable<typeof item.treatment>;
                        const items = (item.treatment?.[mapKey] as string[] | undefined) ?? [];

                        return items.length ? (
                          <View key={`${item.id}-${sec.key}`} style={styles.sectionBlock}>
                            <View style={styles.sectionHeaderRow}>
                              <View style={styles.sectionIconBubble}>
                                <Ionicons name={sec.icon as any} size={18} color="#2E7D32" />
                              </View>
                              <Text style={styles.sectionTitle}>{sec.title}</Text>
                            </View>

                            {items.map((t, i) => (
                              <View key={`${item.id}-${sec.key}-${i}`} style={styles.bulletRow}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.bulletText}>{t}</Text>
                              </View>
                            ))}
                          </View>
                        ) : null;
                      })}
                    </View>
                  </View>

                  {item.followUpNotes ? (
                    <View style={styles.gridBlock}>
                      <Text style={styles.blockTitle}>Follow-up notes</Text>
                      <Text style={styles.blockText}>{item.followUpNotes}</Text>
                    </View>
                  ) : null}
                </View>
              )}
            </Card>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#2E7D32' },

  filterRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 24, marginBottom: 8 },
  filterBtn: { alignItems: 'flex-start' },
  filterText: { fontSize: 14, fontWeight: '700' },
  filterTextActive: { color: '#2E7D32' },
  filterTextInactive: { color: '#757575' },
  filterUnderline: { height: 2, width: 56, backgroundColor: '#2E7D32', borderRadius: 999, marginTop: 8 },

  searchRow: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputWrap: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  searchPlaceholder: { color: '#A3A3A3', fontSize: 13, fontWeight: '700' },

  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 6 },


  caseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  caseImageWrap: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  imageMockText: { fontSize: 18 },
  caseEmoji: { fontSize: 28 },



  caseDisease: { fontSize: 15, fontWeight: '800', color: '#212121' },
  caseMeta: { fontSize: 12, color: '#757575', marginTop: 2 },

  detailsWrap: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  detailsHeader: { marginTop: 14, marginBottom: 12, fontWeight: '800', color: '#212121', fontSize: 14 },

  gridBlock: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  blockTitle: { fontSize: 13, fontWeight: '800', color: '#2E7D32', marginBottom: 8 },
  blockText: { fontSize: 13, color: '#424242', lineHeight: 18 },
  blockTextStrong: { fontSize: 13, color: '#212121', fontWeight: '800', lineHeight: 18 },
  blockSubTitle: { marginTop: 6, fontSize: 12, color: '#757575', fontWeight: '800', marginBottom: 8 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },

  sectionBlock: { marginTop: 10, paddingTop: 6 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sectionIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#212121' },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  bulletDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#2E7D32', marginTop: 6 },
  bulletText: { flex: 1, fontSize: 13, color: '#424242', lineHeight: 18 },
});


