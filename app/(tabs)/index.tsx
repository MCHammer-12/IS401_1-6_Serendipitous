import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useUser } from '@/lib/user-context';
import { ParticleBackground } from '@/components/ParticleBackground';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapDotProps {
  x: number;
  y: number;
  color: string;
  label: string;
  score?: number;
  delay: number;
  onPress?: () => void;
  isSelf?: boolean;
}

function MapDot({ x, y, color, label, score, delay, onPress, isSelf }: MapDotProps) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);
  const floatY = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withDelay(
      delay,
      withRepeat(
        withTiming(2.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    pulseOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    floatY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-4, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.();
  };

  const dotSize = isSelf ? 18 : score ? Math.max(12, Math.min(20, score / 5)) : 14;

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.dotContainer, { left: x - 22, top: y - 22 }]}
    >
      <Animated.View style={floatStyle}>
        <Animated.View
          style={[
            styles.dotPulse,
            pulseStyle,
            { backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              shadowColor: color,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
            },
          ]}
        />
        {isSelf && (
          <View style={styles.selfRing} />
        )}
      </Animated.View>
      <View style={styles.dotLabelRow}>
        <Text style={[styles.dotLabel, { color }]} numberOfLines={1}>{label}</Text>
        {!isSelf && score !== undefined && (
          <View style={[styles.scoreBadge, { backgroundColor: color + '30' }]}>
            <Text style={[styles.scoreText, { color }]}>{score}%</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function getColorForScore(score: number): string {
  if (score >= 60) return Colors.dark.mapDotNew;
  if (score >= 30) return Colors.dark.secondary;
  return Colors.dark.mapDotOther;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const { filteredNearbyPeople, getSerendipityScores, interestThreshold } = useUser();

  const scores = getSerendipityScores();
  const filteredScores = scores.filter(s =>
    filteredNearbyPeople.some(p => p.id === s.person.id)
  );

  const dotPositions = [
    { x: SCREEN_WIDTH * 0.35, y: SCREEN_HEIGHT * 0.28 },
    { x: SCREEN_WIDTH * 0.65, y: SCREEN_HEIGHT * 0.35 },
    { x: SCREEN_WIDTH * 0.25, y: SCREEN_HEIGHT * 0.52 },
    { x: SCREEN_WIDTH * 0.7, y: SCREEN_HEIGHT * 0.55 },
  ];

  const selfPosition = { x: SCREEN_WIDTH * 0.48, y: SCREEN_HEIGHT * 0.42 };

  const handleDotPress = (personId: string) => {
    router.push({ pathname: '/connection/[id]', params: { id: personId } });
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#0D1117', '#0F1923', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <ParticleBackground />

      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={`h${i}`}
            style={[
              styles.gridLine,
              {
                top: (SCREEN_HEIGHT / 12) * i,
                width: '100%',
                height: 1,
              },
            ]}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`v${i}`}
            style={[
              styles.gridLine,
              {
                left: (SCREEN_WIDTH / 8) * i,
                height: '100%',
                width: 1,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="navigate" size={22} color={Colors.dark.accent} />
          <Text style={styles.headerTitle}>Nearby</Text>
        </View>
        <View style={styles.headerRight}>
          {interestThreshold > 0 && (
            <View style={styles.filterBadge}>
              <Ionicons name="funnel" size={12} color={Colors.dark.secondary} />
              <Text style={styles.filterText}>{interestThreshold}+</Text>
            </View>
          )}
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{filteredScores.length} active</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.mapArea}>
        <MapDot
          x={selfPosition.x}
          y={selfPosition.y - topPadding - 60}
          color={Colors.dark.mapDotSelf}
          label="You"
          delay={0}
          isSelf
        />
        {filteredScores.map((scored, idx) => {
          const pos = dotPositions[idx % dotPositions.length];
          if (!pos) return null;
          return (
            <MapDot
              key={scored.person.id}
              x={pos.x}
              y={pos.y - topPadding - 60}
              color={getColorForScore(scored.score)}
              label={scored.person.name}
              score={scored.score}
              delay={(idx + 1) * 300}
              onPress={() => handleDotPress(scored.person.id)}
            />
          );
        })}
      </View>

      <Animated.View
        entering={FadeIn.delay(500).duration(600)}
        style={[
          styles.bottomHint,
          { bottom: Platform.OS === 'web' ? 84 + 34 : 100 },
        ]}
      >
        {filteredScores.length === 0 ? (
          <View style={styles.hintCard}>
            <Ionicons name="funnel" size={16} color={Colors.dark.warning} />
            <Text style={styles.hintText}>No matches at threshold {interestThreshold}. Try lowering it in settings.</Text>
          </View>
        ) : (
          <View style={styles.hintCard}>
            <Ionicons name="sparkles" size={16} color={Colors.dark.accent} />
            <Text style={styles.hintText}>Tap a dot to discover someone new</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.secondary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.accent,
  },
  liveText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.accent,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  dotContainer: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  dotPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
  },
  dot: {
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  selfRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    alignSelf: 'center',
  },
  dotLabelRow: {
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  dotLabel: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    textAlign: 'center',
  },
  scoreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 9,
    fontFamily: 'Outfit_700Bold',
  },
  bottomHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  hintText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
});
