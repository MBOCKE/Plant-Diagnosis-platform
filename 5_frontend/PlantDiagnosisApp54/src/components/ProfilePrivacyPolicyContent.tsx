import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const privacyText = `Last updated: June 2026\n\n1. Information We Collect\nWhen you use Plant Diagnosis, we collect:\n• Your name and email address for account creation\n• Your phone number (optional) for account recovery\n• Your location (with your permission) for regional disease tracking\n• Photos of plant leaves that you submit for diagnosis\n• Diagnosis history and treatment follow-up notes\n\n2. How We Use Your Data\nYour data is used to:\n• Provide accurate disease diagnosis for your crops\n• Deliver personalized treatment recommendations\n• Improve our AI models for better accuracy\n• Track regional disease patterns to help other farmers\nWe NEVER sell your personal information to third parties.\n\n3. Location Data\nYour location is collected only with your explicit permission. It is used to:\n• Identify disease outbreaks in specific regions\n• Provide location-specific treatment advice\n• Alert agricultural authorities about potential epidemics\nYour exact farm location is anonymized before being used for regional tracking.\n\n4. Photo Data\nPlant photos you submit are:\n• Processed by our AI model for disease diagnosis\n• Stored securely to improve model accuracy\n• Anonymized before being used for research\n• Never shared without your consent\n\n5. Data Security\nWe protect your data with:\n• Encrypted transmission (HTTPS)\n• Secure password storage (bcrypt hashing)\n• JWT token-based authentication\n• Rate limiting to prevent abuse\n• Regular security updates\n\n6. Your Rights\nYou have the right to:\n• Access your personal data\n• Request deletion of your account and data\n• Opt out of location tracking\n• Withdraw consent at any time\nContact us through the app to exercise these rights.\n\n7. Contact\nFor privacy concerns, contact:\nEmail: mbockegabriel@gmail.com\nInstitution: Institut Universitaire de la Côte (IUC)`;

function splitToSections(text: string) {
  const raw = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return raw.length ? raw : [text.trim()];
}

function isBulletLine(line: string) {
  return line.trim().startsWith('•');
}

function renderSectionLines(lines: string[], keyPrefix: string) {
  return lines.map((line, i) => {
    const bullet = isBulletLine(line);
    const cleaned = bullet ? line.replace(/^•\s?/, '') : line;
    const isLinkLike = /@/.test(cleaned) || /Email:/i.test(cleaned);

    return (
      <View key={`${keyPrefix}-line-${i}`} style={styles.row}>
        {bullet ? <Text style={styles.bullet}>•</Text> : null}
        <Text style={[styles.rowText, isLinkLike ? styles.linkText : null]}>{cleaned}</Text>
      </View>
    );
  });
}

export function ProfilePrivacyPolicyContent() {
  const sections = splitToSections(privacyText);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {sections.map((block, i) => {
        const lines = block
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);

        const header = lines.length >= 2 ? lines[0] : '';
        const body = header ? lines.slice(1) : lines;

        const isLastUpdated = /^Last updated:/i.test(header);

        return (
          <View key={`privacy-section-${i}`} style={styles.section}>
            {header ? (
              <View style={styles.headerRow}>
                <Text style={[styles.sectionHeader, isLastUpdated ? styles.lastUpdatedHeader : null]}>
                  {header}
                </Text>
              </View>
            ) : null}

            {body.length ? renderSectionLines(body, `privacy-${i}`) : null}
            <View style={styles.separator} />
          </View>
        );
      })}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 520,
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  headerRow: {
    marginBottom: 8,
  },
  sectionHeader: {
    color: '#1565C0',
    fontSize: 14,
    fontWeight: '900',
  },
  lastUpdatedHeader: {
    color: '#6D4C41',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  bullet: {
    color: '#212121',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '900',
  },
  rowText: {
    color: '#212121',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    flex: 1,
  },
  linkText: {
    fontWeight: '800',
    color: '#0D47A1',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 10,
  },
  bottomSpace: {
    height: 8,
  },
});

