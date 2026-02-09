import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.card, styles.fallback, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  fallback: {
    backgroundColor: Colors.dark.glass,
  },
  inner: {
    padding: 16,
  },
});
