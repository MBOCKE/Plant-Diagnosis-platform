import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

type BlockProps = {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
};

function Block({ width = '100%', height = 16, style }: BlockProps) {
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

  return (
    <Animated.View
      style={[styles.block, { width: width as any, height }, style, { opacity }]}
    />
  );

}

export function PageSkeleton() {
  return (
    <View style={styles.pageRoot}>
      <View style={styles.headerBox}>
        <Block width={120} height={20} />
      </View>
      <View style={styles.pageBody}>
        <Block height={120} style={styles.radius2xl} />
        <Block height={60} />
        <Block height={60} />
        <Block height={60} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.dashboardRoot}>
      <View style={styles.rowBetween}>
        <View>
          <Block width={80} height={14} />
          <View style={{ height: 8 }} />
          <Block width={120} height={24} />
        </View>
        <Block width={44} height={44} style={styles.radiusFull} />
      </View>
      <Block height={100} style={styles.radius2xl} />
      <Block width={100} height={18} />
      <View style={styles.rowGap3}>
        <View style={styles.flex1}>
          <Block height={80} style={styles.radius2xl} />
        </View>
        <View style={styles.flex1}>
          <Block height={80} style={styles.radius2xl} />
        </View>
      </View>
      <Block width={140} height={18} />
      <Block height={72} style={styles.radiusXl} />
      <View style={{ height: 8 }} />
      <Block height={72} style={styles.radiusXl} />
      <View style={{ height: 8 }} />
      <Block height={72} style={styles.radiusXl} />
    </View>
  );
}

export function DiagnosisSkeleton() {
  return (
    <View style={styles.dashboardRoot}>
      <Block height={220} style={styles.radiusXl} />
      <Block height={160} style={styles.radius2xl} />
      <Block height={100} style={styles.radius2xl} />
      <Block height={48} style={styles.radiusXl} />
    </View>
  );
}

export function TreatmentSkeleton() {
  return (
    <View style={styles.dashboardRoot}>
      <View style={styles.rowBetween}>
        <View>
          <Block width={180} height={24} />
          <View style={{ height: 8 }} />
          <Block width={140} height={14} />
        </View>
        <Block width={100} height={28} style={styles.radiusFull} />
      </View>
      <Block height={72} style={styles.radiusXl} />
      <View style={{ height: 8 }} />
      <Block height={72} style={styles.radiusXl} />
      <View style={{ height: 8 }} />
      <Block height={72} style={styles.radiusXl} />
      <View style={{ height: 8 }} />
      <Block height={72} style={styles.radiusXl} />
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View style={styles.listRoot}>
      <Block width={100} height={24} />
      <View style={styles.rowGap6}>
        <Block width={80} height={20} />
        <Block width={80} height={20} />
      </View>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.cardRow}>
          <Block width={56} height={56} style={styles.radiusLg} />
          <View style={{ flex: 1, gap: 8 } as any}>
            <Block width={'60%'} height={16} />
            <Block width={'40%'} height={12} />
          </View>
          <Block width={80} height={24} style={styles.radiusFull} />
        </View>
      ))}
    </View>
  );
}

export function CameraSkeleton() {
  return (
    <View style={styles.cameraRoot}>
      <Block
        width={280}
        height={280}
        style={{
          borderRadius: 20,
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.3)',
          backgroundColor: 'transparent',
        }}
      />
      <Block width={200} height={16} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
    </View>
  );
}

// Master component - choose by variant
interface LoadingScreenProps {
  variant?: 'page' | 'dashboard' | 'diagnosis' | 'treatment' | 'list' | 'camera';
}

export function LoadingScreen({ variant = 'page' }: LoadingScreenProps) {
  const variants: Record<NonNullable<LoadingScreenProps['variant']>, React.ComponentType> = {
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

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 12, // rounded-lg
  },
  radiusLg: { borderRadius: 10 },
  radiusXl: { borderRadius: 16 },
  radius2xl: { borderRadius: 20 },
  radiusFull: { borderRadius: 9999 },

  flex1: { flex: 1 },

  pageRoot: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBox: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 16 },
  pageBody: { flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 16 } as any,

  dashboardRoot: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 24, paddingTop: 24, gap: 16 } as any,
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowGap3: { flexDirection: 'row', gap: 12 } as any,

  listRoot: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 24, paddingTop: 24, gap: 12 } as any,
  rowGap6: { flexDirection: 'row', gap: 24 } as any,
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
  } as any,

  cameraRoot: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', gap: 16 } as any,
});

