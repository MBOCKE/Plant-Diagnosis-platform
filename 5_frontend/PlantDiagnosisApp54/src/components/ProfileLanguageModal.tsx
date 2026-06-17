import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { AppModal } from './AppModal';
import { useAuthStore } from '../store/authStore';

function normalizeLang(lang: any): 'en' | 'fr' {
  return lang === 'fr' ? 'fr' : 'en';
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileLanguageModal({ visible, onClose }: Props) {
  const { user } = useAuthStore();
  const initial = useMemo(() => normalizeLang(user?.preferredLanguage), [user?.preferredLanguage]);
  const [lang, setLang] = useState<'en' | 'fr'>(initial);

  // keep local state in sync when user changes
  React.useEffect(() => {
    setLang(initial);
  }, [initial]);

  const isFrench = lang === 'fr';

  return (
    <AppModal visible={visible} title="Preferred Language" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>English</Text>
          <View style={styles.switchWrap}>
            <Switch
              value={isFrench}
              onValueChange={(v) => setLang(v ? 'fr' : 'en')}
              trackColor={{ false: '#E0E0E0', true: '#2E7D32' }}
              thumbColor={isFrench ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <Text style={[styles.label, isFrench ? styles.activeLabel : null]}>Français</Text>
        </View>

        <Text style={styles.hint}>
          {lang === 'fr'
            ? 'Votre interface peut afficher le contenu en français.'
            : 'Your interface can display content in English.'}
        </Text>

        <Text style={styles.current}>
          Current: {lang === 'fr' ? 'Français' : 'English'}
        </Text>

        <Text style={styles.note}>
          Note: This demo UI keeps the selection locally. If you connect the backend preference update, we can persist it to your account.
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212121',
  },
  activeLabel: {
    color: '#2E7D32',
  },
  switchWrap: {
    width: 100,
    alignItems: 'center',
  },
  hint: {
    color: '#616161',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  current: {
    color: '#212121',
    fontSize: 14,
    fontWeight: '800',
  },
  note: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

