import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { AppModal } from './AppModal';
import { useAuthStore } from '../store/authStore';
import { useI18n } from '../i18n/i18n';

function normalizeLang(lang: any): 'en' | 'fr' {
  return lang === 'fr' ? 'fr' : 'en';
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileLanguageModal({ visible, onClose }: Props) {
  const { user, setPreferredLanguage } = useAuthStore();

  const initial = useMemo(() => normalizeLang(user?.preferredLanguage), [user?.preferredLanguage]);
  const [lang, setLang] = useState<'en' | 'fr'>(initial);

  // keep local state in sync when user changes
  React.useEffect(() => {
    setLang(initial);
  }, [initial]);

  const isFrench = lang === 'fr';

  const { t } = useI18n();

  return (
    <AppModal visible={visible} title={t('profile.language.title')} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.language.english')}</Text>

          <View style={styles.switchWrap}>
            <Switch
              value={isFrench}
              onValueChange={(v) => {
                const next = v ? 'fr' : 'en';
                setLang(next);
                setPreferredLanguage(next);
              }}

              trackColor={{ false: '#E0E0E0', true: '#2E7D32' }}
              thumbColor={isFrench ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <Text style={[styles.label, isFrench ? styles.activeLabel : null]}>{t('profile.language.french')}</Text>
        </View>
        <Text style={styles.hint}>{t('profile.language.hint')}</Text>

        <Text style={styles.current}>{t('profile.language.current')} {lang === 'fr' ? t('profile.language.french') : t('profile.language.english')}</Text>

        <Text style={styles.note}>{t('profile.language.note')}</Text>
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

