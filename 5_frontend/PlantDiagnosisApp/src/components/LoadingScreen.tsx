import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  className?: string;
}

// Single skeleton line/box with shimmer animation
function SkeletonBlock({ width = '100%', height = 16, className }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{ width: width as any, height, opacity }}
      className={`bg-gray-200 rounded-lg ${className || ''}`}
    />
  );
}

// ============================================
// SKELETON SCREENS
// ============================================

// Generic full-page skeleton with header
export function PageSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-[#E0E0E0]">
        <View className="flex-row items-center justify-between">
          <SkeletonBlock width={40} height={40} className="rounded-full" />
          <SkeletonBlock width={120} height={20} />
          <SkeletonBlock width={40} height={40} className="rounded-full" />
        </View>
      </View>
      {/* Content */}
      <View className="flex-1 px-6 pt-6 gap-4">
        <SkeletonBlock height={120} className="rounded-2xl" />
        <SkeletonBlock height={60} />
        <SkeletonBlock height={60} />
        <SkeletonBlock height={60} />
      </View>
    </View>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      {/* Greeting */}
      <View className="flex-row justify-between items-center">
        <View>
          <SkeletonBlock width={80} height={14} className="mb-2" />
          <SkeletonBlock width={120} height={24} />
        </View>
        <SkeletonBlock width={44} height={44} className="rounded-full" />
      </View>
      {/* Diagnose card */}
      <SkeletonBlock height={100} className="rounded-2xl" />
      {/* Crop selector */}
      <SkeletonBlock width={100} height={18} className="mb-2" />
      <View className="flex-row gap-3">
        <SkeletonBlock height={80} className="flex-1 rounded-2xl" />
        <SkeletonBlock height={80} className="flex-1 rounded-2xl" />
      </View>
      {/* Recent cases */}
      <SkeletonBlock width={140} height={18} className="mt-4 mb-2" />
      {[1, 2, 3].map(i => (
        <SkeletonBlock key={i} height={72} className="rounded-xl" />
      ))}
    </View>
  );
}

// Diagnosis loading skeleton
export function DiagnosisSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      <SkeletonBlock height={220} className="rounded-xl" />
      <SkeletonBlock height={160} className="rounded-2xl" />
      <SkeletonBlock height={100} className="rounded-2xl" />
      <SkeletonBlock height={48} className="rounded-xl" />
    </View>
  );
}

// Treatment loading skeleton
export function TreatmentSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      <View className="flex-row justify-between">
        <View>
          <SkeletonBlock width={180} height={24} className="mb-2" />
          <SkeletonBlock width={140} height={14} />
        </View>
        <SkeletonBlock width={100} height={28} className="rounded-full" />
      </View>
      {[1, 2, 3, 4].map(i => (
        <SkeletonBlock key={i} height={72} className="rounded-xl" />
      ))}
    </View>
  );
}

// List skeleton (history, cases)
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-3">
      <SkeletonBlock width={100} height={24} className="mb-2" />
      <View className="flex-row gap-6 mb-2">
        <SkeletonBlock width={80} height={20} />
        <SkeletonBlock width={80} height={20} />
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center gap-3 bg-white p-4 rounded-xl">
          <SkeletonBlock width={56} height={56} className="rounded-lg" />
          <View className="flex-1 gap-2">
            <SkeletonBlock width="60%" height={16} />
            <SkeletonBlock width="40%" height={12} />
          </View>
          <SkeletonBlock width={80} height={24} className="rounded-full" />
        </View>
      ))}
    </View>
  );
}

// Camera loading (full screen)
export function CameraSkeleton() {
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <View className="items-center gap-4">
        <SkeletonBlock width={280} height={280} className="rounded-2xl border-2 border-white/30 bg-transparent" />
        <SkeletonBlock width={200} height={16} className="bg-white/20" />
      </View>
    </View>
  );
}

// Default export for generic use
export function LoadingScreen({ variant = 'page' }: { variant?: 'page' | 'dashboard' | 'diagnosis' | 'treatment' | 'list' | 'camera' }) {
  const variants = {
    page: PageSkeleton,
    dashboard: DashboardSkeleton,
    diagnosis: DiagnosisSkeleton,
    treatment: TreatmentSkeleton,
    list: ListSkeleton,
    camera: CameraSkeleton,
  };
  const Component = variants[variant] || PageSkeleton;
  return <Component />;
}