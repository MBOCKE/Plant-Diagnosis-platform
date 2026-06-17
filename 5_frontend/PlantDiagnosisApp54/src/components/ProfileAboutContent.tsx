import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const aboutText = `What This App Does\n\nPlant Diagnosis is a mobile application that helps farmers identify diseases in tomato\nand banana/plantain crops using artificial intelligence. Simply take a photo of an affected\nleaf, and the app will diagnose the disease and provide treatment recommendations.\n\nHow It Works\nStep 1: Take a Photo - Capture a clear photo of the affected plant leaf using your phone camera.\nStep 2: AI Analysis - Our AI model analyzes the image and identifies the disease with confidence scoring.\nStep 3: Get Treatment - Receive localized treatment recommendations in English or French.\n\nSupported Crops\n🍅 Tomato - 5 diseases detected (Early Blight, Late Blight, TYLCV, Bacterial Spot, Healthy)\n🍌 Banana/Plantain - 4 diseases detected (Black Sigatoka, BBTV, Fusarium Wilt, Healthy)\n\nDeveloped by MBOCKE MBOCKE MAXIME GABRIEL\nInstitut Universitaire de la Côte (IUC)\nAcademic Year 2025-2026\nVersion 1.0.0`;

function splitToSections(text: string) {
  const raw = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return raw.length ? raw : [text.trim()];
}

function renderBlock(block: string, key: string) {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const maybeHeader = lines.length >= 2 ? lines[0] : '';
  const rest = maybeHeader ? lines.slice(1) : lines;

  return (
    <View key={key} style={styles.section}>
      {maybeHeader ? <Text style={styles.sectionHeader}>{maybeHeader}</Text> : null}

      {rest.map((line, i) => {
        const isStep = /^Step\s\d+:/.test(line);
        const isEmojiLine = /^([🍅🍌].*)|^[•]/.test(line);

        const rowText = isEmojiLine && !isStep ? `• ${line}` : line;

        return (
          <View key={`${key}-line-${i}`} style={styles.row}>
            <Text
              style={[
                styles.rowText,
                isStep ? styles.stepText : null,
                isEmojiLine && !isStep ? styles.emojiText : null,
              ]}
            >
              {rowText}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function ProfileAboutContent() {
  const sections = splitToSections(aboutText);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {sections.map((s, i) => renderBlock(s, `about-section-${i}`))}
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
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  sectionHeader: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowText: {
    color: '#212121',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  stepText: {
    fontWeight: '800',
  },
  emojiText: {
    fontWeight: '700',
  },
  bottomSpace: {
    height: 8,
  },
});

