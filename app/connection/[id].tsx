import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { nearbyPeople } from '@/lib/mock-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ConnectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  const person = nearbyPeople.find(p => p.id === id);

  const glowScale = useSharedValue(1);
  const btnScale = useSharedValue(1);
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    glowScale.value = withRepeat(
      withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  if (!person) {
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <Text style={styles.errorText}>Person not found</Text>
      </View>
    );
  }

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    btnScale.value = withSpring(0.9, {}, () => {
      btnScale.value = withSpring(1);
    });
    router.push({ pathname: '/about/[id]', params: { id: person.id } });
  };

  const handleDismiss = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#1A0A2E', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <Pressable style={styles.closeBtn} onPress={handleDismiss}>
        <Ionicons name="close" size={24} color={Colors.dark.textSecondary} />
      </Pressable>

      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Animated.Text
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.title}
        >
          New Connection{'\n'}Nearby
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(250).duration(500)}
          style={styles.avatarSection}
        >
          <Animated.View style={[styles.avatarGlow, glowStyle]}>
            <View style={styles.glowCircle} />
          </Animated.View>
          <Animated.View style={[styles.avatarRing, ringStyle]}>
            <View style={styles.ringDot} />
            <View style={[styles.ringDot, styles.ringDot2]} />
            <View style={[styles.ringDot, styles.ringDot3]} />
          </Animated.View>
          <Avatar
            uri={person.avatarUrl}
            size={130}
            borderColor={Colors.dark.pink}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={styles.infoSection}
        >
          <View style={styles.nameRow}>
            <Text style={styles.label}>Name: </Text>
            <Text style={styles.value}>{person.name}</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.label}>Age: </Text>
            <Text style={styles.value}>{person.age}</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).duration(500)}
          style={styles.quoteSection}
        >
          <Text style={styles.quoteText}>"{person.quote}"</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(650).duration(500)}
          style={styles.actionSection}
        >
          <Animated.View style={btnAnimStyle}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareBtn,
                pressed && styles.shareBtnPressed,
              ]}
            >
              <LinearGradient
                colors={[Colors.dark.accent, '#00B894']}
                style={styles.shareBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="hand-right" size={24} color="#fff" />
                <Text style={styles.shareBtnText}>Share info?</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Pressable onPress={handleDismiss} style={styles.noThanksBtn}>
            <Ionicons name="close" size={16} color={Colors.dark.textMuted} />
            <Text style={styles.noThanksText}>No thanks</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 67 + 12 : 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 28,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  avatarGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 105, 180, 0.12)',
  },
  avatarRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.15)',
    borderStyle: 'dashed',
  },
  ringDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.pink,
    top: -3,
    left: '50%',
    marginLeft: -3,
  },
  ringDot2: {
    top: '50%',
    left: -3,
    marginLeft: 0,
    marginTop: -3,
    backgroundColor: Colors.dark.accent,
  },
  ringDot3: {
    top: '50%',
    left: undefined,
    right: -3,
    marginLeft: 0,
    marginTop: -3,
    backgroundColor: Colors.dark.secondary,
  },
  infoSection: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
  },
  quoteSection: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic' as const,
    lineHeight: 24,
  },
  actionSection: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  shareBtn: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shareBtnPressed: {
    opacity: 0.9,
  },
  shareBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
    paddingVertical: 18,
    minWidth: 220,
  },
  shareBtnText: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
  },
  noThanksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  noThanksText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textMuted,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});
