import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { ProfileAboutContent } from '../../src/components/ProfileAboutContent';
import { ProfilePrivacyPolicyContent } from '../../src/components/ProfilePrivacyPolicyContent';
import { ProfileLanguageModal } from '../../src/components/ProfileLanguageModal';
import { ProfileLocationModal } from '../../src/components/ProfileLocationModal';
import { AppModal } from '../../src/components/AppModal';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const [langVisible, setLangVisible] = React.useState(false);
  const [locationVisible, setLocationVisible] = React.useState(false);
  const [aboutVisible, setAboutVisible] = React.useState(false);
  const [privacyVisible, setPrivacyVisible] = React.useState(false);

  const preferredLabel = user?.preferredLanguage === 'fr' ? 'Français' : 'English';
  const locationLabel = typeof user?.location === 'string' ? user?.location : 'Not set';

  const menuItems = [
    {
      icon: 'language' as const,
      label: 'Preferred Language',
      value: preferredLabel,
      onPress: () => setLangVisible(true),
    },
    {
      icon: 'location' as const,
      label: 'My Location',
      value: locationLabel,
      onPress: () => setLocationVisible(true),
    },
    { icon: 'notifications' as const, label: 'Notifications', toggle: true },
    { icon: 'information-circle' as const, label: 'About', onPress: () => setAboutVisible(true) },
    { icon: 'shield-checkmark' as const, label: 'Privacy Policy', onPress: () => setPrivacyVisible(true) },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{(user?.name || 'F').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Farmer'}</Text>
          <Text style={styles.email}>{user?.email || 'farmer@email.com'}</Text>
        </View>

        <Card style={styles.card}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={item.toggle ? undefined : item.onPress}
              disabled={item.toggle}
            >
              <View style={[styles.menuRow, i === menuItems.length - 1 ? styles.menuRowLast : null]}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={22} color="#757575" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>

                {item.toggle ? (
                  <View style={styles.toggleTrack}>
                    <View style={styles.toggleThumb} />
                  </View>
                ) : (
                  <View style={styles.menuRight}>
                    {'value' in item && item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                    <Ionicons name="chevron-forward" size={18} color="#757575" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <View style={{ marginTop: 12 }}>
          <Button title="Logout" onPress={logout} variant="danger" icon="log-out-outline" />
        </View>
        <View style={{ height: 18 }} />
      </ScrollView>

      <ProfileLanguageModal visible={langVisible} onClose={() => setLangVisible(false)} />
      <ProfileLocationModal visible={locationVisible} onClose={() => setLocationVisible(false)} />

      <AppModal visible={aboutVisible} title="About" onClose={() => setAboutVisible(false)}>
        <ProfileAboutContent />
      </AppModal>

      <AppModal visible={privacyVisible} title="Privacy Policy" onClose={() => setPrivacyVisible(false)}>
        <ProfilePrivacyPolicyContent />
      </AppModal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  avatarBlock: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 22,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarLetter: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', color: '#212121' },
  email: { marginTop: 6, fontSize: 13, color: '#757575' },

  card: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuRowLast: { borderBottomWidth: 0 },

  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { color: '#212121', fontSize: 15, fontWeight: '800' },

  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuValue: { fontSize: 13, color: '#757575', fontWeight: '700' },

  toggleTrack: {
    width: 44,
    height: 24,
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
});

