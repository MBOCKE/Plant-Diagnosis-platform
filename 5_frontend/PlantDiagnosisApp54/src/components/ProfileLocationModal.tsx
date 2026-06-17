import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { AppModal } from './AppModal';
import { useAuthStore } from '../store/authStore';

function formatLocation(loc: any): string | null {
  if (!loc) return null;
  if (typeof loc === 'string') return loc;
  try {
    // handle object-like location in future
    if (typeof loc === 'object') {
      const region = loc.region || loc.state || '';
      const town = loc.town || loc.city || '';
      const country = loc.country || '';
      const parts = [town, region, country].filter(Boolean);
      return parts.length ? parts.join(', ') : JSON.stringify(loc);
    }
  } catch {
    return null;
  }
  return null;
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileLocationModal({ visible, onClose }: Props) {
  const { user } = useAuthStore();
  const locationString = useMemo(() => formatLocation(user?.location), [user?.location]);
  const [showLocation, setShowLocation] = useState(false);

  React.useEffect(() => {
    if (visible) setShowLocation(false);
  }, [visible]);

  return (
    <AppModal visible={visible} title="My Location" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Show location</Text>
          <Switch
            value={showLocation}
            onValueChange={(v) => setShowLocation(v)}
            trackColor={{ false: '#E0E0E0', true: '#2E7D32' }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        {!showLocation ? (
          <Text style={styles.hiddenText}>Location is hidden.</Text>
        ) : (
          <Text style={styles.locationText}>{locationString ?? 'Location not set.'}</Text>
        )}

        <Text style={styles.note}>
          Location is displayed based on your account data. You can hide it anytime using the toggle.
        </Text>
      </ScrollView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 6,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212121',
  },
  hiddenText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '700',
  },
  locationText: {
    color: '#212121',
    fontSize: 14,
    fontWeight: '800',
  },
  note: {
    color: '#616161',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

