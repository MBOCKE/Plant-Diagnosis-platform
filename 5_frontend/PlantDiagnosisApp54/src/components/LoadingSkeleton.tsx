import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

function Block({ width = '100%', height = 16, className = '' }: { width?: number | string; height?: number; className?: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={{ width: width as any, height, opacity }} className={`bg-gray-200 rounded-lg ${className}`} />;
}

export function PageSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <View className="bg-white px-6 py-4"><Block width={120} height={20} /></View>
      <View className="flex-1 px-6 pt-6 gap-4">
        <Block height={120} className="rounded-2xl" />
        <Block height={60} /><Block height={60} /><Block height={60} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      <View className="flex-row justify-between">
        <View><Block width={80} height={14} /><Block width={120} height={24} className="mt-2" /></View>
        <Block width={44} height={44} className="rounded-full" />
      </View>
      <Block height={100} className="rounded-2xl" />
      <Block width={100} height={18} />
      <View className="flex-row gap-3"><Block height={80} className="flex-1 rounded-2xl" /><Block height={80} className="flex-1 rounded-2xl" /></View>
      <Block width={140} height={18} />
      {[1, 2, 3].map(i => <Block key={i} height={72} className="rounded-xl" />)}
    </View>
  );
}

export function DiagnosisSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      <Block height={220} className="rounded-xl" />
      <Block height={160} className="rounded-2xl" />
      <Block height={100} className="rounded-2xl" />
      <Block height={48} className="rounded-xl" />
    </View>
  );
}

export function TreatmentSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-4">
      <View className="flex-row justify-between">
        <View><Block width={180} height={24} /><Block width={140} height={14} className="mt-2" /></View>
        <Block width={100} height={28} className="rounded-full" />
      </View>
      {[1, 2, 3, 4].map(i => <Block key={i} height={72} className="rounded-xl" />)}
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View className="flex-1 bg-[#F5F5F5] px-6 pt-6 gap-3">
      <Block width={100} height={24} />
      <View className="flex-row gap-6"><Block width={80} height={20} /><Block width={80} height={20} /></View>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} className="flex-row items-center gap-3 bg-white p-4 rounded-xl">
          <Block width={56} height={56} className="rounded-lg" />
          <View className="flex-1 gap-2"><Block width="60%" height={16} /><Block width="40%" height={12} /></View>
          <Block width={80} height={24} className="rounded-full" />
        </View>
      ))}
    </View>
  );
}

export function CameraSkeleton() {
  return (
    <View className="flex-1 bg-black items-center justify-center gap-4">
      <Block width={280} height={280} className="rounded-2xl border-2 border-white/30 bg-transparent" />
      <Block width={200} height={16} className="bg-white/20" />
    </View>
  );
}

// Master component - choose by variant
interface LoadingScreenProps {
  variant?: 'page' | 'dashboard' | 'diagnosis' | 'treatment' | 'list' | 'camera';
}

export function LoadingScreen({ variant = 'page' }: LoadingScreenProps) {
  const variants = {
    page: PageSkeleton,
    dashboard: DashboardSkeleton,
    diagnosis: DiagnosisSkeleton,
    treatment: TreatmentSkeleton,
    list: ListSkeleton,
    camera: CameraSkeleton,
  };
  const Component = variants[variant];
  return <Component />;
}