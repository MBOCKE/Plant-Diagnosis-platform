import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { Card } from './Card';
import type { Case, UrgencyLevel } from '../types';

type Props = {
  item: Case;
  onPress?: () => void;
};

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export function CasePreviewCard({ item, onPress }: Props) {
  const primary = item.diagnosis?.primaryDiagnosis;
  const urgency = (item.treatment?.urgency ?? 'monitor') as UrgencyLevel;
  const urgencyLabel = item.treatment?.urgencyLabel ?? 'Monitor';

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.imageWrap}>
          {/* Replace with <Image source={{ uri: item.imageUri }} /> when backend provides real photo URLs */}
          <Text style={styles.imageMock}>🖼️</Text>
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.disease} numberOfLines={1}>
            {primary?.disease ?? 'Unknown'}
          </Text>
          <Text style={styles.date}>{formatShortDate(item.createdAt)}</Text>
        </View>

        <Badge urgency={urgency as any} label={urgencyLabel} />

        <Ionicons name="chevron-forward" size={18} color="#757575" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageMock: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
  },
  disease: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
  },
  date: {
    marginTop: 2,
    fontSize: 12,
    color: '#757575',
  },
});

