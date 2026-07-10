import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Case, CropType, UrgencyLevel } from '../../src/types';
import { casesAPI } from '../../src/services/api';

type Filter = 'all' | 'tomato' | 'banana';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function cropToFilter(crop: CropType): Filter {
  return crop === 'tomato' ? 'tomato' : 'banana';
}

function filterToCropType(filter: Filter): CropType | undefined {
  if (filter === 'tomato') return 'tomato';
  if (filter === 'banana') return 'banana_plantain';
  return undefined;
}

function cropEmoji(crop: CropType) {
  return crop === 'tomato' ? '🍅' : '🍌';
}

function summarizeDisease(disease?: string) {
  return disease || 'Unknown';
}

function urgencyFromCase(item: Case): { urgency: UrgencyLevel | 'healthy'; urgencyLabel: string } {
  const urgency = (item.treatment?.urgency ?? 'monitor') as UrgencyLevel;
  const urgencyLabel = item.treatment?.urgencyLabel ?? 'Monitor';
  return { urgency, urgencyLabel };
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
  const [archivedCaseIds, setArchivedCaseIds] = useState<string[]>([]);

  // Fade animation for the top collapsed/expanded preview header.
  const fadeAnimRef = useRef(new Animated.Value(1));
  const [previewVisibleMap, setPreviewVisibleMap] = useState<Record<string, boolean>>({});

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState<string>('');

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    casesAPI
      .getUserCases({
        page: 1,
        limit: 20,
        search: query.trim() || undefined,
        cropType: filterToCropType(filter),
        includeArchived: true,
      })
      .then(({ cases: fetchedCases }) => {
        if (active) setCases(fetchedCases);
      })
      .catch(() => {
        if (active) {
          setCases([]);
          setError('Unable to load cases from the API gateway.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filter, query]);

  const visibleCases = useMemo(
    () => cases.filter((c: Case) => !c.isArchived && !archivedCaseIds.includes(c.id)),
    [archivedCaseIds, cases]
  );

  const archivedCases = useMemo(
    () => cases.filter((c: Case) => c.isArchived || archivedCaseIds.includes(c.id)),
    [archivedCaseIds, cases]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = filter === 'all' ? visibleCases : visibleCases.filter(c => cropToFilter(c.cropType) === filter);

    const searched = q.length
      ? base.filter(c => {
          const disease = c.diagnosis?.primaryDiagnosis?.disease ?? '';
          const sci = c.diagnosis?.primaryDiagnosis?.scientificName ?? '';
          const sym = c.symptomsDescription ?? '';
          return [disease, sci, sym].some(v => v.toLowerCase().includes(q));
        })
      : base;

    return [...searched].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filter, query, visibleCases]);

  const toggleExpand = (caseId: string) => {
    const isExpanded = expandedIds.includes(caseId);

    // Critical: keep the preview visible when collapsing.
    // Otherwise, previewVisibleMap can be set to false and the row appears to disappear.
    setPreviewVisibleMap(prev => ({ ...prev, [caseId]: true }));

    if (!isExpanded) {
      // Expanding
      fadeAnimRef.current.setValue(0);
      Animated.timing(fadeAnimRef.current, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      // Collapsing (quick fade)
      fadeAnimRef.current.setValue(1);
      Animated.timing(fadeAnimRef.current, {
        toValue: 0.85,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        fadeAnimRef.current.setValue(1);
      });
    }

    setExpandedIds(prev => (prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]));
  };

  const handleArchiveCase = async (caseId: string) => {
    try {
      await casesAPI.deleteCase(caseId);
      setCases(prev => prev.map(c => (c.id === caseId ? { ...c, isArchived: true } : c)));
      setArchivedCaseIds(prev => (prev.includes(caseId) ? prev : [...prev, caseId]));
      setExpandedIds(prev => prev.filter(id => id !== caseId));
    } catch {
      setError('Unable to archive this case right now.');
    }
  };

  const startEditingNotes = (item: Case) => {
    setEditingNotesId(item.id);
    setDraftNotes(item.followUpNotes ?? '');
  };

  const cancelEditingNotes = () => {
    setEditingNotesId(null);
    setDraftNotes('');
  };

  const saveNotes = async (caseId: string) => {
    try {
      await casesAPI.updateCaseNotes(caseId, draftNotes);
      setCases(prev => prev.map(c => (c.id === caseId ? { ...c, followUpNotes: draftNotes } : c)));
      cancelEditingNotes();
    } catch {
      Alert.alert('Unable to save', 'Please try again.');
    }
  };

  const showNoCasesState = visibleCases.length === 0;
  const showNoResultsState = !showNoCasesState && filtered.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#2E7D32" />
        <TextInput
          style={styles.searchInputWrap}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by disease / notes..."
          placeholderTextColor="#A3A3A3"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
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
        {loading ? (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconWrap}>
              <Text style={styles.emptyStateIcon}>⏳</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Loading cases…</Text>
            <Text style={styles.emptyStateText}>Fetching your latest diagnoses.</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconWrap}>
              <Text style={styles.emptyStateIcon}>⚠️</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Unable to load cases</Text>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : null}

        {showNoCasesState ? (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconWrap}>
              <Text style={styles.emptyStateIcon}>🌿</Text>
            </View>
            <Text style={styles.emptyStateTitle}>No cases yet</Text>
            <Text style={styles.emptyStateText}>
              Your diagnosed plant cases will appear here once you capture your first one.
            </Text>
          </View>
        ) : null}

        {showNoResultsState ? (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateIconWrap}>
              <Text style={styles.emptyStateIcon}>🔎</Text>
            </View>
            <Text style={styles.emptyStateTitle}>No matching cases</Text>
            <Text style={styles.emptyStateText}>Try another word or clear the search to see your full case history.</Text>
          </View>
        ) : null}

        {!loading && !error && !showNoCasesState && !showNoResultsState
          ? filtered.map((item: Case) => {
              const isExpanded = expandedIds.includes(item.id);
              const primary = item.diagnosis?.primaryDiagnosis;
              const { urgency, urgencyLabel } = urgencyFromCase(item);
              const previewVisible = previewVisibleMap[item.id] ?? true;

              return (
                <Card key={item.id} style={sectionStyles.card}>
                  {!isExpanded ? (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpand(item.id)} accessibilityRole="button">
                      {previewVisible ? (
                        <Animated.View style={[styles.caseTopRow, { opacity: fadeAnimRef.current }]}>
                          <View style={styles.caseImageWrap}>
                            {item.imageUri ? (
                              <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            ) : (
                              <Text style={styles.imageMockText}>{cropEmoji(item.cropType)}</Text>
                            )}
                          </View>

                          <View style={{ flex: 1 }}>
                            <View style={styles.caseInfoColumn}>
                              <Badge urgency={urgency as any} label={urgencyLabel} />
                              <Text style={styles.caseDiseaseNoWrap}>{summarizeDisease(primary?.disease)}</Text>
                              <Text style={styles.caseMeta} numberOfLines={1}>
                                {formatDate(item.createdAt)}
                              </Text>
                            </View>
                          </View>

                          <Ionicons name="chevron-down" size={20} color="#757575" />
                        </Animated.View>
                      ) : null}
                    </TouchableOpacity>
                  ) : null}

                  {isExpanded ? (
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleExpand(item.id)} accessibilityRole="button">
                      <View style={styles.detailsWrap}>
                        <View style={styles.expandedHero}>
                          <View style={styles.expandedImageWrap}>
                            {item.imageUri ? (
                              <Image source={{ uri: item.imageUri }} style={styles.expandedImage} resizeMode="cover" />
                            ) : (
                              <Text style={styles.imageMockText}>{cropEmoji(item.cropType)}</Text>
                            )}
                          </View>

                          <View style={styles.expandedSubRow}>
                            <Text style={styles.caseMeta} numberOfLines={1}>
                              {formatDate(item.createdAt)}
                            </Text>
                            <Badge urgency={urgency as any} label={urgencyLabel} />
                          </View>
                        </View>

                        <Text style={styles.detailsHeader}>Every detail</Text>

                        <View style={styles.gridBlock}>
                          <Text style={styles.blockTitle}>Diagnosis</Text>
                          <Text style={styles.blockTextStrong}>
                            {primary?.disease} {typeof primary?.confidence === 'number' ? `• ${primary.confidence}%` : ''}
                          </Text>
                          {primary?.scientificName ? (
                            <Text style={styles.blockText}>Scientific name: {primary.scientificName}</Text>
                          ) : null}
                          <Text style={styles.blockText}>Model: {item.diagnosis?.modelUsed ?? '—'}</Text>
                          <Text style={styles.blockText}>Inference time: {item.diagnosis?.inferenceTimeMs ?? '—'} ms</Text>

                          {item.diagnosis?.alternativeDiagnoses?.length ? (
                            <View style={{ marginTop: 10 }}>
                              <Text style={styles.blockSubTitle}>Alternative diagnoses</Text>
                              {item.diagnosis?.alternativeDiagnoses?.map((d: { disease: string; confidence: number }, idx: number) => (
                                <View key={`${item.id}-alt-${idx}`} style={styles.rowBetween}>
                                  <Text style={styles.blockText}>{d.disease}</Text>
                                  <Text style={styles.blockTextStrong}>{d.confidence}%</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.gridBlock}>
                          <Text style={styles.blockTitle}>Treatment plan</Text>
                          <Text style={styles.blockText}>Urgency: {item.treatment?.urgencyLabel ?? '—'}</Text>
                          {item.treatment?.cultural?.length ? (
                            <Text style={styles.blockText}>Cultural: {item.treatment.cultural[0]}</Text>
                          ) : null}
                          {item.treatment?.biological?.length ? (
                            <Text style={styles.blockText}>Biological: {item.treatment.biological[0]}</Text>
                          ) : null}
                          {item.treatment?.chemical?.length ? (
                            <Text style={styles.blockText}>Chemical: {item.treatment.chemical[0]}</Text>
                          ) : null}
                          {typeof item.latitude === 'number' && typeof item.longitude === 'number' ? (
                            <Text style={styles.blockText}>
                              Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                            </Text>
                          ) : null}
                          <Text style={styles.blockText}>Status: {item.status}</Text>
                          <Text style={styles.blockText}>Offline case: {item.isOfflineCase ? 'Yes' : 'No'}</Text>
                        </View>

                        <View style={styles.gridBlock}>
                          <Text style={styles.blockTitle}>Treatment plan</Text>
                          <Text style={styles.blockTextStrong}>{item.treatment?.urgencyLabel ?? '—'}</Text>

                          <View style={{ marginTop: 10 }}>
                            {([
                              { key: 'cultural', title: 'Cultural Practices', icon: 'leaf' },
                              { key: 'biological', title: 'Biological Controls', icon: 'flask' },
                              { key: 'chemical', title: 'Chemical Options', icon: 'beaker' },
                              { key: 'safety', title: 'Safety Precautions', icon: 'shield-checkmark' },
                            ] as const).map(sec => {
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

                        <View style={styles.gridBlock}>
                          <View style={styles.followUpHeaderRow}>
                            <Text style={styles.blockTitle}>Follow-up notes</Text>

                            <View pointerEvents="box-none">
                              {editingNotesId !== item.id ? (
                                <TouchableOpacity
                                  onPress={e => {
                                    (e as any)?.stopPropagation?.();
                                    startEditingNotes(item);
                                  }}
                                  style={styles.editNotesBtn}
                                >
                                  <Ionicons name="create-outline" size={16} color="#2E7D32" />
                                  <Text style={styles.editNotesBtnText}>Edit</Text>
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>

                          {editingNotesId === item.id ? (
                            <View pointerEvents="auto">
                              <TextInput
                                value={draftNotes}
                                onChangeText={setDraftNotes}
                                placeholder="Add follow-up notes..."
                                multiline
                                style={styles.followUpInput}
                                textAlignVertical="top"
                              />
                              <View style={styles.followUpActionsRow}>
                                <TouchableOpacity onPress={cancelEditingNotes} style={styles.followUpActionSecondary}>
                                  <Text style={styles.followUpActionSecondaryText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => saveNotes(item.id)} style={styles.followUpActionPrimary}>
                                  <Text style={styles.followUpActionPrimaryText}>Save</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : item.followUpNotes ? (
                            <Text style={styles.blockText}>{item.followUpNotes}</Text>
                          ) : (
                            <Text style={styles.blockText}>— Add your follow-up after treatment.</Text>
                          )}
                        </View>

                        <TouchableOpacity style={styles.archiveButton} onPress={() => handleArchiveCase(item.id)}>
                          <Ionicons name="archive-outline" size={16} color="#B91C1C" />
                          <Text style={styles.archiveButtonText}>Archive case</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </Card>
              );
            })
          : null}

        {archivedCases.length > 0 ? (
          <View style={styles.archiveSection}>
            <Text style={styles.archiveTitle}>Archived cases</Text>
            <Text style={styles.archiveText}>These cases are kept for compliance, reporting, and future analysis.</Text>
            {archivedCases.map((item: Case) => (
              <View key={`archived-${item.id}`} style={styles.archiveChip}>
                <Text style={styles.archiveChipText}>{summarizeDisease(item.diagnosis?.primaryDiagnosis?.disease)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingHorizontal: 14,
    paddingTop: 14,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },

  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 6 },

  caseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  caseImageWrap: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  imageMockText: { fontSize: 18 },

  caseDiseaseNoWrap: { fontSize: 15, fontWeight: '800', color: '#212121', flexShrink: 1 },
  caseInfoColumn: { flex: 1, justifyContent: 'center', gap: 4 },
  caseMeta: { fontSize: 12, color: '#757575', marginTop: 0 },

  detailsWrap: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  detailsHeader: { marginTop: 14, marginBottom: 12, fontWeight: '800', color: '#212121', fontSize: 14 },

  expandedHero: { marginBottom: 10 },
  expandedImageWrap: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  expandedImage: {
    width: '100%',
    height: '100%',
  },
  expandedSubRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

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

  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  archiveButtonText: { color: '#B91C1C', fontSize: 13, fontWeight: '700' },

  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateIcon: { fontSize: 28 },
  emptyStateTitle: { fontSize: 16, fontWeight: '800', color: '#212121', marginBottom: 6 },
  emptyStateText: { fontSize: 13, color: '#757575', textAlign: 'center', lineHeight: 20 },

  archiveSection: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  archiveTitle: { fontSize: 14, fontWeight: '800', color: '#9A2C00', marginBottom: 4 },
  archiveText: { fontSize: 12, color: '#A16207', marginBottom: 10, lineHeight: 18 },

  archiveChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  archiveChipText: { fontSize: 12, color: '#424242', fontWeight: '700' },

  followUpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editNotesBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editNotesBtnText: { fontSize: 12, fontWeight: '800', color: '#2E7D32' },

  followUpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 13,
    color: '#212121',
    minHeight: 90,
  },

  followUpActionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  followUpActionPrimary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#2E7D32' },
  followUpActionPrimaryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  followUpActionSecondary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F3F4F6' },
  followUpActionSecondaryText: { color: '#374151', fontWeight: '800', fontSize: 13 },
});

