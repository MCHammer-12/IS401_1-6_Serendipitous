import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { currentUser } from '@/lib/mock-data';

function InterestChip({ text, index }: { text: string; index: number }) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300 + index * 60).duration(400)}
      style={styles.chip}
    >
      <Text style={styles.chipText}>{text}</Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  const handleSettings = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#100A1F', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={handleSettings} style={styles.settingsBtn}>
          <Feather name="settings" size={20} color={Colors.dark.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'web' ? 84 + 34 : 120 },
        ]}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.profileSection}>
          <View style={styles.avatarGlow}>
            <Avatar
              uri={currentUser.avatarUrl}
              size={110}
              borderColor={Colors.dark.accent}
            />
          </View>

          <Text style={styles.name}>{currentUser.name}</Text>

          <View style={styles.schoolBadge}>
            <Ionicons name="school" size={14} color={Colors.dark.secondary} />
            <Text style={styles.schoolText}>{currentUser.school}</Text>
          </View>

          <Text style={styles.joinDate}>
            member since {currentUser.joinDate}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.statsRow}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentUser.connectionCount}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentUser.interests.length}</Text>
            <Text style={styles.statLabel}>Interests</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentUser.major.split(' ').length > 1 ? currentUser.major.split(' ').map(w => w[0]).join('') : currentUser.major.substring(0, 3)}</Text>
            <Text style={styles.statLabel}>Major</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.quoteCard}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.dark.pink} />
          <Text style={styles.quoteText}>"{currentUser.quote}"</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(350).duration(400)}
          style={styles.interestsSection}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color={Colors.dark.accent} />
            <Text style={styles.sectionTitle}>Interests</Text>
          </View>
          <View style={styles.chipContainer}>
            {currentUser.interests.map((interest, idx) => (
              <InterestChip key={interest} text={interest} index={idx} />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.infoSection}
        >
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={Colors.dark.textMuted} />
            <Text style={styles.infoText}>{currentUser.hometown}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="book" size={18} color={Colors.dark.textMuted} />
            <Text style={styles.infoText}>{currentUser.major}</Text>
          </View>
        </Animated.View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  profileSection: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  avatarGlow: {
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    marginTop: 8,
  },
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.secondaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  schoolText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.secondary,
  },
  joinDate: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.dark.divider,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.accent,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.dark.pinkLight,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  quoteText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.text,
    fontStyle: 'italic' as const,
    flex: 1,
    lineHeight: 22,
  },
  interestsSection: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.text,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textSecondary,
  },
  infoSection: {
    gap: 14,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
});
