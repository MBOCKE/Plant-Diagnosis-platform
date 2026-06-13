import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CropType } from '../types';


interface CropSelectorProps {
  selected: CropType;
  onSelect: (crop: CropType) => void;
}

const crops = [
  { type: 'tomato' as CropType, emoji: '🍅', label: 'Tomato' },
  { type: 'banana_plantain' as CropType, emoji: '🍌', label: 'Banana / Plantain' },
];

export function CropSelector({ selected, onSelect }: CropSelectorProps) {
  return (
    <View>
      <Text style={styles.title}>Select Crop Type</Text>
      <View style={styles.row}>
        {crops.map(crop => {
          const isSelected = selected === crop.type;
          return (
            <TouchableOpacity
              key={crop.type}
              onPress={() => onSelect(crop.type)}
              style={[styles.card, isSelected ? styles.cardSelected : styles.cardUnselected]}
            >
              <Text style={styles.emoji}>{crop.emoji}</Text>
              <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>
                {crop.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  cardSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  cardUnselected: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelSelected: {
    color: '#2E7D32',
  },
  labelUnselected: {
    color: '#757575',
  },
});

