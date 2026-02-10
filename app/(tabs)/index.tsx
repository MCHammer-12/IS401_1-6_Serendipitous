import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  Pressable,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useUser } from '@/lib/user-context';
import { useDiscovery } from '@/lib/discovery-context';
import { ParticleBackground } from '@/components/ParticleBackground';
import type { SerendipityScore } from '@/lib/user-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function getColorForScore(score: number): string {
  if (score >= 60) return Colors.dark.mapDotNew;
  if (score >= 30) return Colors.dark.secondary;
  return Colors.dark.mapDotOther;
}

function getPlanetSize(score: number): number {
  const minSize = 50;
  const maxSize = 120;
  const t = Math.pow(score / 100, 1.8);
  return minSize + t * (maxSize - minSize);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface SpherePoint {
  theta: number;
  phi: number;
  radius: number;
}

function generateSpherePositions(count: number, sphereRadius: number): SpherePoint[] {
  const points: SpherePoint[] = [];
  for (let i = 0; i < count; i++) {
    const seed1 = seededRandom(i * 137.508 + 1);
    const seed2 = seededRandom(i * 237.113 + 2);
    const seed3 = seededRandom(i * 331.771 + 3);
    const theta = seed1 * Math.PI * 2;
    const phi = Math.acos(2 * seed2 - 1);
    const r = sphereRadius * (0.65 + seed3 * 0.35);
    points.push({ theta, phi, radius: r });
  }
  return points;
}

interface OrbitingPlanetProps {
  scored: SerendipityScore;
  spherePoint: SpherePoint;
  rotationX: number;
  rotationY: number;
  centerX: number;
  centerY: number;
  onPress: () => void;
  isHighlighted: boolean;
  isNewlyDiscovered: boolean;
  autoAngle: number;
}

function OrbitingPlanet({
  scored,
  spherePoint,
  rotationX,
  rotationY,
  centerX,
  centerY,
  onPress,
  isHighlighted,
  isNewlyDiscovered,
  autoAngle,
}: OrbitingPlanetProps) {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(isHighlighted ? 1.4 : 1.15, {
        duration: isHighlighted ? 800 : 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [isHighlighted]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const planetSize = getPlanetSize(scored.score);
  const color = isHighlighted ? Colors.dark.warning : getColorForScore(scored.score);

  const { theta, phi, radius } = spherePoint;
  const currentTheta = theta + autoAngle;

  const x3d = radius * Math.sin(phi) * Math.cos(currentTheta);
  const y3d = radius * Math.cos(phi);
  const z3d = radius * Math.sin(phi) * Math.sin(currentTheta);

  const cosRX = Math.cos(rotationX);
  const sinRX = Math.sin(rotationX);
  const cosRY = Math.cos(rotationY);
  const sinRY = Math.sin(rotationY);

  const x1 = x3d * cosRY + z3d * sinRY;
  const z1 = -x3d * sinRY + z3d * cosRY;
  const y1 = y3d * cosRX - z1 * sinRX;
  const z2 = y3d * sinRX + z1 * cosRX;

  const perspective = 600;
  const scale3d = perspective / (perspective + z2);
  const screenX = centerX + x1 * scale3d;
  const screenY = centerY + y1 * scale3d;
  const depthOpacity = Math.max(0.25, Math.min(1, 0.4 + scale3d * 0.6));
  const depthScale = Math.max(0.4, scale3d);

  const isBehindCenter = z2 > 0;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const zIndex = Math.round(scale3d * 1000);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.planetContainer,
        {
          left: screenX - planetSize / 2 - 8,
          top: screenY - planetSize / 2 - 8,
          zIndex,
          opacity: depthOpacity,
        },
      ]}
    >
      <View style={{ transform: [{ scale: depthScale }], alignItems: 'center' }}>
        <Animated.View
          style={[
            styles.planetGlow,
            pulseStyle,
            {
              width: planetSize + 16,
              height: planetSize + 16,
              borderRadius: (planetSize + 16) / 2,
              backgroundColor: color + '25',
            },
          ]}
        />
        <View
          style={[
            styles.planetImageWrap,
            {
              width: planetSize,
              height: planetSize,
              borderRadius: planetSize / 2,
              borderColor: isHighlighted ? Colors.dark.warning : color,
              shadowColor: color,
              borderWidth: planetSize > 50 ? 3 : 2,
            },
          ]}
        >
          <Image
            source={{ uri: scored.person.avatarUrl }}
            style={{
              width: planetSize - 4,
              height: planetSize - 4,
              borderRadius: (planetSize - 4) / 2,
            }}
            contentFit="cover"
            transition={300}
          />
        </View>
        {!isBehindCenter && (
          <View style={styles.planetLabelRow}>
            <Text style={[styles.planetLabel, { color, fontSize: planetSize > 50 ? 12 : 10 }]} numberOfLines={1}>
              {scored.person.name}
            </Text>
            <View style={[styles.planetScoreBadge, { backgroundColor: color + '30' }]}>
              <Text style={[styles.planetScoreText, { color }]}>{scored.score}%</Text>
            </View>
          </View>
        )}
        {isNewlyDiscovered && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function ScanButton() {
  const { isScanning, startScanning, stopScanning, hasPermission, requestPermission } = useDiscovery();
  const scanPulse = useSharedValue(1);

  useEffect(() => {
    if (isScanning) {
      scanPulse.value = withRepeat(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      scanPulse.value = withTiming(1);
    }
  }, [isScanning]);

  const scanPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanPulse.value }],
    opacity: isScanning ? 0.3 : 0,
  }));

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (!hasPermission) {
      await requestPermission();
    }
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.scanBtnContainer}>
      <Animated.View style={[styles.scanPulseRing, scanPulseStyle]} />
      <LinearGradient
        colors={isScanning ? [Colors.dark.warning, '#FF4444'] : [Colors.dark.accent, '#00B894']}
        style={styles.scanBtnGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons
          name={isScanning ? 'stop' : 'bluetooth'}
          size={20}
          color="#fff"
        />
      </LinearGradient>
    </Pressable>
  );
}

function DiscoveryBanner() {
  const { discoveredPeople, isScanning } = useDiscovery();

  const discoveredCount = discoveredPeople.length;
  const notifiedCount = discoveredPeople.filter(d => d.notified).length;
  const pendingCount = discoveredCount - notifiedCount;

  if (!isScanning && discoveredCount === 0) return null;

  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.discoveryBanner}>
      <View style={styles.discoveryBannerInner}>
        {isScanning && (
          <View style={styles.scanningRow}>
            <View style={styles.scanningDot} />
            <Text style={styles.scanningText}>Scanning for nearby people...</Text>
          </View>
        )}
        {discoveredCount > 0 && (
          <Text style={styles.discoveredText}>
            {discoveredCount} {discoveredCount === 1 ? 'person' : 'people'} detected
            {pendingCount > 0 ? ` (${pendingCount} approaching)` : ''}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

function SphereWireframe({ sphereRadius, centerX, centerY, rotationX, rotationY }: {
  sphereRadius: number; centerX: number; centerY: number; rotationX: number; rotationY: number;
}) {
  const perspective = 600;
  const cosRX = Math.cos(rotationX);
  const sinRX = Math.sin(rotationX);
  const cosRY = Math.cos(rotationY);
  const sinRY = Math.sin(rotationY);

  const dotElements: React.ReactElement[] = [];

  const rings = [
    { phi: Math.PI * 0.5, color: 'rgba(0, 212, 170, 0.06)', label: 'equator' },
    { phi: Math.PI * 0.3, color: 'rgba(108, 99, 255, 0.05)', label: 'upper' },
    { phi: Math.PI * 0.7, color: 'rgba(108, 99, 255, 0.05)', label: 'lower' },
  ];

  rings.forEach((ring) => {
    const points = 50;
    const ringRadius = sphereRadius * Math.sin(ring.phi);
    const ringY = sphereRadius * Math.cos(ring.phi);

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * Math.PI * 2;
      const x3d = ringRadius * Math.cos(theta);
      const z3d = ringRadius * Math.sin(theta);
      const y3d = ringY;

      const x1 = x3d * cosRY + z3d * sinRY;
      const z1 = -x3d * sinRY + z3d * cosRY;
      const y1 = y3d * cosRX - z1 * sinRX;
      const z2 = y3d * sinRX + z1 * cosRX;

      const scale3d = perspective / (perspective + z2);
      const sx = centerX + x1 * scale3d;
      const sy = centerY + y1 * scale3d;
      const opacity = Math.max(0.03, scale3d * 0.12);

      dotElements.push(
        <View
          key={`${ring.label}-${i}`}
          style={{
            position: 'absolute',
            left: sx - 1,
            top: sy - 1,
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: ring.color,
            opacity,
          }}
        />
      );
    }
  });

  const meridianCount = 3;
  const meridianPoints = 40;
  for (let m = 0; m < meridianCount; m++) {
    const mTheta = (m / meridianCount) * Math.PI;
    for (let i = 0; i < meridianPoints; i++) {
      const mPhi = (i / meridianPoints) * Math.PI * 2;
      const x3d = sphereRadius * Math.cos(mTheta) * Math.sin(mPhi);
      const y3d = sphereRadius * Math.cos(mPhi);
      const z3d = sphereRadius * Math.sin(mTheta) * Math.sin(mPhi);

      const x1 = x3d * cosRY + z3d * sinRY;
      const z1 = -x3d * sinRY + z3d * cosRY;
      const y1 = y3d * cosRX - z1 * sinRX;
      const z2 = y3d * sinRX + z1 * cosRX;

      const scale3d = perspective / (perspective + z2);
      const sx = centerX + x1 * scale3d;
      const sy = centerY + y1 * scale3d;
      const opacity = Math.max(0.02, scale3d * 0.08);

      dotElements.push(
        <View
          key={`meridian-${m}-${i}`}
          style={{
            position: 'absolute',
            left: sx - 0.75,
            top: sy - 0.75,
            width: 1.5,
            height: 1.5,
            borderRadius: 0.75,
            backgroundColor: 'rgba(0, 212, 170, 0.04)',
            opacity,
          }}
        />
      );
    }
  }

  return <>{dotElements}</>;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const { filteredNearbyPeople, getSerendipityScores, interestThreshold, profile } = useUser();
  const { highlightedPersonId, clearHighlight, discoveredPeople, isScanning } = useDiscovery();

  const scores = getSerendipityScores();
  const filteredScores = scores.filter(s =>
    filteredNearbyPeople.some(p => p.id === s.person.id)
  );

  const [rotationX, setRotationX] = useState(-0.3);
  const [rotationY, setRotationY] = useState(0);
  const [autoAngle, setAutoAngle] = useState(0);

  const rotXRef = useRef(rotationX);
  const rotYRef = useRef(rotationY);
  const lastRotX = useRef(rotationX);
  const lastRotY = useRef(rotationY);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const momentumRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMoveTime = useRef(0);
  const prevDx = useRef(0);
  const prevDy = useRef(0);

  useEffect(() => {
    rotXRef.current = rotationX;
    rotYRef.current = rotationY;
  }, [rotationX, rotationY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoAngle(prev => prev + 0.004);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (highlightedPersonId) {
      const timeout = setTimeout(() => clearHighlight(), 10000);
      return () => clearTimeout(timeout);
    }
  }, [highlightedPersonId]);

  const stopMomentum = () => {
    if (momentumRef.current) {
      clearInterval(momentumRef.current);
      momentumRef.current = null;
    }
  };

  const startMomentum = (vx: number, vy: number) => {
    stopMomentum();
    let currentVX = vx;
    let currentVY = vy;
    const friction = 0.96;
    const minVelocity = 0.00005;

    momentumRef.current = setInterval(() => {
      currentVX *= friction;
      currentVY *= friction;

      if (Math.abs(currentVX) < minVelocity && Math.abs(currentVY) < minVelocity) {
        stopMomentum();
        return;
      }

      setRotationY(prev => prev + currentVX);
      setRotationX(prev => prev + currentVY);
    }, 16);
  };

  useEffect(() => {
    return () => stopMomentum();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: () => {
        stopMomentum();
        lastRotX.current = rotXRef.current;
        lastRotY.current = rotYRef.current;
        prevDx.current = 0;
        prevDy.current = 0;
        lastMoveTime.current = Date.now();
      },
      onPanResponderMove: (_, gestureState) => {
        const sensitivity = 0.012;
        const newRotY = lastRotY.current + gestureState.dx * sensitivity;
        const newRotX = lastRotX.current + gestureState.dy * sensitivity;
        setRotationY(newRotY);
        setRotationX(newRotX);

        const now = Date.now();
        const dt = Math.max(1, now - lastMoveTime.current);
        velocityX.current = ((gestureState.dx - prevDx.current) * sensitivity) / (dt / 16);
        velocityY.current = ((gestureState.dy - prevDy.current) * sensitivity) / (dt / 16);
        prevDx.current = gestureState.dx;
        prevDy.current = gestureState.dy;
        lastMoveTime.current = now;
      },
      onPanResponderRelease: () => {
        const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
        if (speed > 0.001) {
          startMomentum(velocityX.current, velocityY.current);
        }
      },
    })
  ).current;

  const headerHeight = 60;
  const tabBarHeight = Platform.OS === 'web' ? 84 + 34 : 90;
  const availableHeight = SCREEN_HEIGHT - topPadding - headerHeight - tabBarHeight;
  const centerX = SCREEN_WIDTH / 2;
  const centerY = topPadding + headerHeight + availableHeight * 0.42;
  const localCenterY = centerY - topPadding - headerHeight;

  const sphereRadius = Math.min(SCREEN_WIDTH, availableHeight) * 0.48;

  const spherePositions = useMemo(() => {
    return generateSpherePositions(filteredScores.length, sphereRadius);
  }, [filteredScores.length, sphereRadius]);

  const handleDotPress = (personId: string) => {
    router.push({ pathname: '/connection/[id]', params: { id: personId } });
  };

  const selfAvatarSize = 72;
  const perspective = 600;
  const selfZIndex = Math.round((perspective / perspective) * 1000);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#0D1117', '#0F1923', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <ParticleBackground />

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
          <ScanButton />
        </View>
      </Animated.View>

      {isScanning && <DiscoveryBanner />}

      <View style={styles.solarSystem} {...panResponder.panHandlers}>
        <SphereWireframe
          sphereRadius={sphereRadius}
          centerX={centerX}
          centerY={localCenterY}
          rotationX={rotationX}
          rotationY={rotationY}
        />

        <View
          style={[
            styles.selfContainer,
            {
              left: centerX - selfAvatarSize / 2,
              top: localCenterY - selfAvatarSize / 2,
              zIndex: selfZIndex,
            },
          ]}
        >
          <View style={styles.selfGlow} />
          <View style={styles.selfBorder}>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.selfImage}
              contentFit="cover"
              transition={300}
            />
          </View>
          <Text style={styles.selfLabel}>You</Text>
        </View>

        {filteredScores.map((scored, idx) => {
          const isDiscovered = discoveredPeople.some(d => d.person.id === scored.person.id && d.notified);
          return (
            <OrbitingPlanet
              key={scored.person.id}
              scored={scored}
              spherePoint={spherePositions[idx] || { theta: 0, phi: Math.PI / 2, radius: sphereRadius * 0.5 }}
              rotationX={rotationX}
              rotationY={rotationY}
              centerX={centerX}
              centerY={localCenterY}
              onPress={() => handleDotPress(scored.person.id)}
              isHighlighted={scored.person.id === highlightedPersonId}
              isNewlyDiscovered={isDiscovered}
              autoAngle={autoAngle}
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
        ) : !isScanning ? (
          <View style={styles.hintCard}>
            <Ionicons name="planet" size={16} color={Colors.dark.accent} />
            <Text style={styles.hintText}>Drag to rotate - tap a planet to connect</Text>
          </View>
        ) : (
          <View style={styles.hintCard}>
            <Ionicons name="sparkles" size={16} color={Colors.dark.accent} />
            <Text style={styles.hintText}>Scanning - tap a planet to learn more</Text>
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
  scanBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.accent,
  },
  scanBtnGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoveryBanner: {
    paddingHorizontal: 24,
    zIndex: 10,
  },
  discoveryBannerInner: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.accent,
  },
  scanningText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.accent,
  },
  discoveredText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
  solarSystem: {
    flex: 1,
    position: 'relative',
  },
  selfContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  selfGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 212, 170, 0.08)',
    top: -14,
    left: -14,
  },
  selfBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  selfImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  selfLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.accent,
    marginTop: 4,
  },
  planetContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  planetGlow: {
    position: 'absolute',
  },
  planetImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  planetLabelRow: {
    alignItems: 'center',
    marginTop: 3,
    gap: 2,
  },
  planetLabel: {
    fontFamily: 'Outfit_600SemiBold',
    textAlign: 'center',
  },
  planetScoreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  planetScoreText: {
    fontSize: 9,
    fontFamily: 'Outfit_700Bold',
  },
  newBadge: {
    backgroundColor: Colors.dark.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginTop: 2,
  },
  newBadgeText: {
    fontSize: 8,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.warning,
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
