import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  optional?: boolean;
  error?: string;
}

export function Input({ label, placeholder, value, onChangeText, icon, secureTextEntry, keyboardType, autoCapitalize, optional, error }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs font-medium text-[#212121]">{label}</Text>
        {optional && <Text className="text-xs text-[#757575]">Optional</Text>}
      </View>
      <View className={`flex-row items-center bg-[#F5F5F5] rounded-xl border px-4 ${error ? 'border-red-500' : isFocused ? 'border-[#2E7D32]' : 'border-[#E0E0E0]'}`}>
        {icon && <Ionicons name={icon} size={20} color={error ? '#D32F2F' : '#757575'} />}
        <TextInput
          className="flex-1 h-12 ml-3 text-base text-[#212121]"
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}