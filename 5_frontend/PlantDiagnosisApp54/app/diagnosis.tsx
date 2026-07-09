import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert } from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';
import { DiagnosisSkeleton } from '../src/components/LoadingSkeleton';

import { inferenceAPI, casesAPI } from '../src/services/api';
import { DiagnosisResult, TreatmentPlan } from '../src/types';
import { useNetworkInfo } from '../src/hooks/useNetworkInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueueOfflineCase, syncOfflineCases } from '../src/services/offlineSync';

import { useI18n } from '../src/i18n/i18n';

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
  confRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confLabel: { fontSize: 12, color: '#757575', textTransform: 'uppercase' as any },
  confValue: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
  progressOuter: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressInner: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 999 },
  altCard: { marginTop: 12 },
  altTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase' as any,
    marginBottom: 12,
  },
  altRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  altDisease: { color: '#212121' },
  altConf: { color: '#757575' },
});

export default function DiagnosisScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri: string; crop: string }>();

  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);
  const [treatment, setTreatment] = React.useState<TreatmentPlan | null>(null);

  const { isConnected } = useNetworkInfo();

  useEffect(() => {
    if (isConnected) {
      syncOfflineCases().catch(() => {
        // swallow; user can retry later
      });
    }
  }, [isConnected]);

  useEffect(() => {
      if (!(params.imageUri && params.crop)) {
        setLoading(false);
        return;
      }

    const run = async () => {
      if (!isConnected) {
        await enqueueOfflineCase({
          localId: `${Date.now()}`,
          cropType: params.crop as any,
          imageUri: params.imageUri,
          symptomsDescription: undefined,
          latitude: undefined,
          longitude: undefined,
          createdAt: new Date().toISOString(),
        });

        Alert.alert(t('diagnosis.savedOffline.title'), t('diagnosis.savedOffline.body'));
        router.back();
        return;
      }

      inferenceAPI
        .diagnose(params.imageUri, params.crop)
        .then(async res => {
          setResult(res.diagnosis);
          setTreatment(res.treatment);

          // Create case in backend so it appears in History + Home recent section
          // (Only when connected; offline is already queued in the else branch)
          console.log('createCase gate:', {
            isConnected,
            disease: res?.diagnosis?.primaryDiagnosis?.disease,
            primaryDiagnosis: res?.diagnosis?.primaryDiagnosis,
            diagnosisPayload: res?.diagnosis,
          });
          if (isConnected && res?.diagnosis?.primaryDiagnosis?.disease) {
            try {
              // backend expects cropType, diagnosis, imageUri, symptomsDescription, status, etc.
              // We pass what we have; Case schema will fill defaults where allowed.
              // Create case using the gateway: POST /api/cases
              // Note: the case-service route requires authentication (authMiddleware).
              // Use the gateway via axios instance in casesAPI.
              await casesAPI.createCase({
                cropType: params.crop as any,
                imageUri: params.imageUri,
                diagnosis: res.diagnosis,
                // IMPORTANT: Persist the treatment so History can show it.
                treatment: res?.treatment ?? undefined,
                symptomsDescription: undefined,
                latitude: undefined,
                longitude: undefined,
                followUpNotes: undefined,
              });
            } catch (e: any) {
              console.error('Failed to create case:', {
                message: e?.message,
                status: e?.response?.status,
                data: e?.response?.data,
              });
              // Don't block the UI; user can create later from history.
            }
          }
        })
        .catch(err => {
          // Make sure the screen doesn't blank due to an unhandled error
          Alert.alert('Diagnosis failed', 'Unable to run inference. Please try again.');
          console.error('Inference error:', err);
        })
        .finally(() => setLoading(false));
    };

    run();
  }, [params.imageUri, params.crop, isConnected, router]);

    if (loading) {
    console.log('🔄 Showing loading skeleton...');
    return <DiagnosisSkeleton />;
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title={t('diagnosis.title')} showBack />
        <View style={styles.center}>
          <Text style={styles.muted}>{t('diagnosis.failed')}</Text>
          <Text style={[styles.muted, { marginTop: 8, textAlign: 'center' }]}>
            {isConnected ? 'Try again later.' : 'Check your internet connection and retry.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={t('diagnosis.title')}
        showBack
        rightIcon="close"
        onRightPress={() => router.replace('/')}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {params.imageUri && (
          <Image source={{ uri: params.imageUri }} style={styles.image} resizeMode="cover" />
        )}

        <Card style={styles.card}>
          <Text style={styles.cropText}>{params.crop === 'tomato' ? t('history.filter.tomato') : t('history.filter.banana')}</Text>

          <Text style={styles.diseaseTitle}>{result.primaryDiagnosis.disease}</Text>

          {result.primaryDiagnosis.scientificName && (
            <Text style={styles.scientific}>{result.primaryDiagnosis.scientificName}</Text>
          )}

          <View style={styles.confRow}>
            <Text style={styles.confLabel}>{t('diagnosis.confidence')}</Text>
            <Text style={styles.confValue}>{result.primaryDiagnosis.confidence}%</Text>
          </View>

          <View style={styles.progressOuter}>
            <View
              style={[
                styles.progressInner,
                { width: `${result.primaryDiagnosis.confidence}%` },
              ]}
            />
          </View>

          {treatment && <Badge urgency={treatment.urgency} label={treatment.urgencyLabel} />}
        </Card>

        {result.alternativeDiagnoses.length > 0 && (
          <Card style={styles.altCard}>
            <Text style={styles.altTitle}>{t('diagnosis.alternativeTitle')}</Text>
            {result.alternativeDiagnoses.map((alt, i) => (
              <View key={i} style={styles.altRow}>
                <Text style={styles.altDisease}>{alt.disease}</Text>
                <Text style={styles.altConf}>{alt.confidence}%</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={{ marginTop: 12, marginBottom: 24 }}>
          <Button
            title={t('diagnosis.viewTreatmentPlan')}
            onPress={() =>
              router.push({
                pathname: '/treatment',
                params: {
                  crop: params.crop,
                  disease: result.primaryDiagnosis.disease,
                  treatment: JSON.stringify(treatment || {}),
                },
              })
            }
            icon="arrow-forward"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

