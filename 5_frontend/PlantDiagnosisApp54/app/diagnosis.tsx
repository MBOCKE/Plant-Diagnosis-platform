import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';
import { DiagnosisSkeleton } from '../src/components/LoadingSkeleton';
import { inferenceAPI } from '../src/services/api';
import { DiagnosisResult, TreatmentPlan } from '../src/types';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#757575' },
  image: { width: '100%', height: 220, borderRadius: 12, marginTop: 12 },
  card: { marginTop: 12 },
  cropText: { fontSize: 13, color: '#757575' },
  diseaseTitle: { fontSize: 22, fontWeight: '700', color: '#212121', marginTop: 4 },
  scientific: { fontSize: 12, color: '#757575', fontStyle: 'italic', marginBottom: 12 },
  confRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  confLabel: { fontSize: 12, color: '#757575', textTransform: 'uppercase' as any },
  confValue: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
  progressOuter: { width: '100%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 999, overflow: 'hidden', marginBottom: 12 },
  progressInner: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 999 },
  altCard: { marginTop: 12 },
  altTitle: { fontSize: 14, fontWeight: '600', color: '#757575', textTransform: 'uppercase' as any, marginBottom: 12 },
  altRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  altDisease: { color: '#212121' },
  altConf: { color: '#757575' },
});

export default function DiagnosisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri: string; crop: string }>();
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);
  const [treatment, setTreatment] = React.useState<TreatmentPlan | null>(null);


  useEffect(() => {
    if (params.imageUri && params.crop) {
      inferenceAPI.diagnose(params.imageUri, params.crop).then(res => {
        setResult(res.diagnosis);
        setTreatment(res.treatment);
      }).finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <DiagnosisSkeleton />;

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Diagnosis" showBack />
        <View style={styles.center}>
          <Text style={styles.muted}>Failed to load diagnosis</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Diagnosis" showBack />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {params.imageUri && (
          <Image
            source={{ uri: params.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Card style={styles.card}>
          <Text style={styles.cropText}>
            {params.crop === 'tomato' ? '🍅 Tomato' : '🍌 Banana/Plantain'}
          </Text>
          <Text style={styles.diseaseTitle}>{result.primaryDiagnosis.disease}</Text>

          {result.primaryDiagnosis.scientificName && (
            <Text style={styles.scientific}>{result.primaryDiagnosis.scientificName}</Text>
          )}

          <View style={styles.confRow}>
            <Text style={styles.confLabel}>Confidence</Text>
            <Text style={styles.confValue}>{result.primaryDiagnosis.confidence}%</Text>
          </View>

          <View style={styles.progressOuter}>
            <View
              style={[styles.progressInner, { width: `${result.primaryDiagnosis.confidence}%` }]}
            />
          </View>

          {treatment && <Badge urgency={treatment.urgency} label={treatment.urgencyLabel} />}
        </Card>

        {result.alternativeDiagnoses.length > 0 && (
          <Card style={styles.altCard}>
            <Text style={styles.altTitle}>Alternative Possibilities</Text>
            {result.alternativeDiagnoses.map((alt, i) => (
              <View key={i} style={styles.altRow}>
                <Text style={styles.altDisease}>{alt.disease}</Text>
                <Text style={styles.altConf}>{alt.confidence}%</Text>
              </View>
            ))}
          </Card>
        )}

        {treatment && (
          <View style={{ marginTop: 12, marginBottom: 24 }}>
            <Button
              title="View Treatment Plan"
              onPress={() =>
                router.push({
                  pathname: '/treatment',
                  params: {
                    crop: params.crop,
                    disease: result.primaryDiagnosis.disease,
                  },
                })
              }
              icon="arrow-forward"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}