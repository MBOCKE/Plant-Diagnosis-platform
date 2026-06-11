import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDiagnosis } from '../src/hooks/useDiagnosis';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';
import { LoadingScreen } from '../src/components/LoadingScreen';

export default function DiagnosisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri: string; crop: string }>();
  const { loading, result, treatment, diagnose } = useDiagnosis();

  // Auto-diagnose on mount
  React.useEffect(() => {
    if (params.imageUri && params.crop) {
      diagnose(params.imageUri, params.crop);
    }
  }, [params.imageUri, params.crop]);

  if (loading) {
    return <LoadingScreen variant="diagnosis" />;
  }

  if (!result) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <Header title="Diagnosis" showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#757575]">Failed to load diagnosis</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <Header title="Diagnosis" showBack />
      
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Image */}
        {params.imageUri && (
          <Image source={{ uri: params.imageUri }} className="w-full h-56 rounded-xl mt-4" resizeMode="cover" />
        )}

        {/* Primary Result */}
        <Card className="mt-4">
          <Text className="text-sm text-[#757575]">
            {params.crop === 'tomato' ? '🍅 Tomato' : '🍌 Banana/Plantain'}
          </Text>
          <Text className="text-2xl font-bold text-[#212121] mt-1">{result.primaryDiagnosis.disease}</Text>
          {result.primaryDiagnosis.scientificName && (
            <Text className="text-xs text-[#757575] italic mb-3">{result.primaryDiagnosis.scientificName}</Text>
          )}

          {/* Confidence */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs text-[#757575] uppercase tracking-wider">Confidence</Text>
            <Text className="text-sm font-bold text-[#2E7D32]">{result.primaryDiagnosis.confidence}%</Text>
          </View>
          <View className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden mb-3">
            <View className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${result.primaryDiagnosis.confidence}%` }} />
          </View>

          {treatment && <Badge urgency={treatment.urgency} label={treatment.urgencyLabel} />}
        </Card>

        {/* Alternative Diagnoses */}
        {result.alternativeDiagnoses.length > 0 && (
          <Card className="mt-3">
            <Text className="text-sm font-semibold text-[#757575] uppercase mb-3">Alternative Possibilities</Text>
            {result.alternativeDiagnoses.map((alt, i) => (
              <View key={i} className="flex-row justify-between py-2 border-b border-[#F5F5F5] last:border-0">
                <Text className="text-[#212121]">{alt.disease}</Text>
                <Text className="text-[#757575]">{alt.confidence}%</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Treatment CTA */}
        {treatment && (
          <Button
            title="View Treatment Plan"
            onPress={() => router.push({ pathname: '/treatment', params: { crop: params.crop, disease: result.primaryDiagnosis.disease } })}
            icon="arrow-forward"
            className="mt-4 mb-8"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}