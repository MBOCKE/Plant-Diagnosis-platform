import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
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
      Alert.alert('Permission Required', 'Camera access is needed to diagnose plants');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Image Preview Mode
  if (image) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: image }} className="flex-1" resizeMode="cover" />
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
          <CropSelector selected={selectedCrop} onSelect={setSelectedCrop} />
          <View className="flex-row gap-3 mt-4">
            <Button title="Retake" onPress={() => setImage(null)} variant="outline" className="flex-1" />
            <Button
              title="Diagnose Plant"
              onPress={() => router.push({ pathname: '/diagnosis', params: { imageUri: image, crop: selectedCrop } })}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    );
  }

  // Camera Mode
  return (
    <View className="flex-1 bg-black">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-base font-medium">Capture Plant Leaf</Text>
        <TouchableOpacity onPress={pickFromGallery} className="p-2">
          <Ionicons name="images" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Guide Frame */}
      <View className="flex-1 items-center justify-center px-10">
        <View className="w-full aspect-square border-2 border-dashed border-white/40 rounded-2xl items-center justify-center">
          <Text className="text-white/60 text-center px-8">
            Position the affected leaf in the center and tap to focus
          </Text>
        </View>
      </View>

      {/* Capture Button */}
      <View className="items-center pb-12">
        <TouchableOpacity
          className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
          onPress={takePhoto}
          activeOpacity={0.8}
        >
          <View className="w-16 h-16 bg-white rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}