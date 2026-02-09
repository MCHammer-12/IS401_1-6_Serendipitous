import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

function Particle({ x, y, size, delay, color }: ParticleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.4, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-20, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        animStyle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
      ]}
    />
  );
}

const particles = Array.from({ length: 15 }, (_, i) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 2000,
  color: [Colors.dark.accent, Colors.dark.secondary, Colors.dark.pink][i % 3],
}));

export function ParticleBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
