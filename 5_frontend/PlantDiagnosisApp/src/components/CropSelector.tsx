import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CropType } from '../types';

interface CropSelectorProps {
  selected: CropType;
  onSelect: (crop: CropType) => void;
}

const crops: { type: CropType; emoji: string; label: string }[] = [
  { type: 'tomato', emoji: '🍅', label: 'Tomato' },
  { type: 'banana_plantain', emoji: '🍌', label: 'Banana / Plantain' },
];

export function CropSelector({ selected, onSelect }: CropSelectorProps) {
  return (
    <View>
      <Text className="text-lg font-semibold text-[#212121] mb-3">Select Crop Type</Text>
      <View className="flex-row gap-3">
        {crops.map((crop) => (
          <TouchableOpacity
            key={crop.type}
            className={`flex-1 py-4 rounded-xl items-center border-2 ${
              selected === crop.type ? 'border-[#2E7D32] bg-[#E8F5E9]' : 'border-[#E0E0E0] bg-white'
            }`}
            onPress={() => onSelect(crop.type)}
          >
            <Text className="text-3xl mb-1">{crop.emoji}</Text>
            <Text className={`font-medium text-sm ${selected === crop.type ? 'text-[#2E7D32]' : 'text-[#757575]'}`}>
              {crop.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}