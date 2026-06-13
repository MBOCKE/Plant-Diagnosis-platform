import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CropType } from '../src/types';
import { Button } from '../src/components/Button';
import { CropSelector } from '../src/components/CropSelector';

export default function CameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ crop?: string }>();
  const [image, setImage] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropType>((params.crop as CropType) || 'tomato');

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [4, 3] });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCancel = () => {
    // Requirement: allow user to exit without doing anything.
    router.back();
  };

  if (image) {
    return (
      <View style={styles.root}>
        <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />

        <View style={styles.bottomSheet}>
          <CropSelector selected={selectedCrop} onSelect={setSelectedCrop} />

          <View style={styles.actionRow}>
            <Button title="Retake" onPress={() => setImage(null)} variant="outline" style={{ flex: 1 }} />
            <Button
              title="Diagnose Plant"
              onPress={() =>
                router.push({
                  pathname: '/diagnosis',
                  params: { imageUri: image, crop: selectedCrop },
                })
              }
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleCancel} style={styles.topIconBtn}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Capture Plant Leaf</Text>
        <TouchableOpacity onPress={pickFromGallery} style={styles.topIconBtn}>
          <Ionicons name="images" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerArea}>
        <View style={styles.focusBox}>
          <Text style={styles.focusText}>
            Position the affected leaf in the center and tap to focus
          </Text>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} activeOpacity={0.8}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 12,
  },
  topIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  focusBox: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusText: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  bottomArea: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});

