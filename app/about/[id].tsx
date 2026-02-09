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
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { nearbyPeople } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

export default function AboutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const { profile, getCommonInterestsWithPerson, getSerendipityScores } = useUser();

  const person = nearbyPeople.find(p => p.id === id);
  const commonInterests = person ? getCommonInterestsWithPerson(person.id) : [];
  const scores = getSerendipityScores();
  const personScore = scores.find(s => s.person.id === id);

  if (!person) {
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <Text style={styles.errorText}>Person not found</Text>
      </View>
    );
  }

  const handleMessage = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.dismissAll();
  };

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.dismissAll();
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#0D1A2E', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <Pressable style={styles.closeBtn} onPress={handleClose}>
        <Ionicons name="close" size={24} color={Colors.dark.textSecondary} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.Text
          entering={FadeIn.duration(500)}
          style={styles.title}
        >
          About
        </Animated.Text>

        {personScore && (
          <Animated.View
            entering={FadeIn.delay(100).duration(400)}
            style={styles.scoreBanner}
          >
            <Ionicons name="sparkles" size={18} color={Colors.dark.accent} />
            <Text style={styles.scoreBannerText}>
              Serendipity Score: <Text style={styles.scoreBannerNumber}>{personScore.score}%</Text>
            </Text>
          </Animated.View>
        )}

        <View style={styles.compareSection}>
          <Animated.View
            entering={FadeInLeft.delay(200).duration(500)}
            style={styles.personCard}
          >
            <Avatar
              uri={person.avatarUrl}
              size={90}
              borderColor={Colors.dark.pink}
            />
            <Text style={styles.personName}>{person.name}</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={13} color={Colors.dark.textMuted} />
              <Text style={styles.detailText}>{person.hometown}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="book" size={13} color={Colors.dark.textMuted} />
              <Text style={styles.detailText}>{person.major}</Text>
            </View>
            <View style={styles.schoolTag}>
              <Text style={styles.schoolTagText}>{person.school}</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(350).duration(500)}
            style={styles.vsContainer}
          >
            <View style={styles.vsLine} />
            <View style={styles.vsBadge}>
              <Ionicons name="link" size={16} color={Colors.dark.accent} />
            </View>
            <View style={styles.vsLine} />
          </Animated.View>

          <Animated.View
            entering={FadeInRight.delay(200).duration(500)}
            style={styles.personCard}
          >
            <Avatar
              uri={profile.avatarUrl}
              size={90}
              borderColor={Colors.dark.accent}
            />
            <Text style={styles.personName}>Me</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={13} color={Colors.dark.textMuted} />
              <Text style={styles.detailText}>{profile.hometown}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="book" size={13} color={Colors.dark.textMuted} />
              <Text style={styles.detailText}>{profile.major}</Text>
            </View>
            <View style={styles.schoolTag}>
              <Text style={styles.schoolTagText}>{profile.school}</Text>
            </View>
          </Animated.View>
        </View>

        {personScore && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(400)}
            style={styles.matchDetails}
          >
            <Text style={styles.matchDetailsTitle}>Why you match</Text>
            <View style={styles.matchGrid}>
              {personScore.sameSchool && (
                <View style={styles.matchTag}>
                  <Ionicons name="school" size={13} color={Colors.dark.secondary} />
                  <Text style={styles.matchTagText}>Same school</Text>
                </View>
              )}
              {personScore.sameMajor && (
                <View style={styles.matchTag}>
                  <Ionicons name="book" size={13} color={Colors.dark.accent} />
                  <Text style={styles.matchTagText}>Same major</Text>
                </View>
              )}
              {personScore.sameHometown && (
                <View style={styles.matchTag}>
                  <Ionicons name="location" size={13} color={Colors.dark.pink} />
                  <Text style={styles.matchTagText}>Same hometown</Text>
                </View>
              )}
              {commonInterests.length > 0 && (
                <View style={styles.matchTag}>
                  <Ionicons name="heart" size={13} color={Colors.dark.warning} />
                  <Text style={styles.matchTagText}>{commonInterests.length} shared {commonInterests.length === 1 ? 'interest' : 'interests'}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {commonInterests.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(450).duration(500)}
            style={styles.commonSection}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={18} color={Colors.dark.pink} />
              <Text style={styles.sectionTitle}>Common interests</Text>
            </View>
            <View style={styles.interestList}>
              {commonInterests.map((interest, idx) => (
                <Animated.View
                  key={interest}
                  entering={FadeInUp.delay(500 + idx * 80).duration(400)}
                  style={styles.interestItem}
                >
                  <View style={styles.interestDot} />
                  <Text style={styles.interestText}>{interest}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInUp.delay(650).duration(500)}
          style={styles.meetupSection}
        >
          <View style={styles.meetupIcon}>
            <Ionicons name="phone-portrait" size={24} color={Colors.dark.accent} />
          </View>
          <Text style={styles.meetupText}>
            Find them + tap phones{'\n'}to become friends!
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(750).duration(500)}
          style={styles.actionSection}
        >
          <Pressable
            onPress={handleMessage}
            style={({ pressed }) => [
              styles.messageBtn,
              pressed && styles.messageBtnPressed,
            ]}
          >
            <LinearGradient
              colors={[Colors.dark.secondary, '#5A4EE0']}
              style={styles.messageBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="chatbubble" size={20} color="#fff" />
              <Text style={styles.messageBtnText}>Message them!</Text>
            </LinearGradient>
          </Pressable>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 50,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.accentLight,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  scoreBannerText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textSecondary,
  },
  scoreBannerNumber: {
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.accent,
    fontSize: 18,
  },
  compareSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 0,
    width: '100%',
  },
  personCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 20,
    padding: 16,
    paddingTop: 20,
  },
  personName: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  schoolTag: {
    backgroundColor: Colors.dark.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  schoolTagText: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.secondary,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    width: 36,
  },
  vsLine: {
    width: 1,
    height: 20,
    backgroundColor: Colors.dark.divider,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.accentLight,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  matchDetails: {
    width: '100%',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  matchDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.surfaceHover,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  matchTagText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.text,
  },
  commonSection: {
    width: '100%',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.text,
  },
  interestList: {
    gap: 12,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interestDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.accent,
  },
  interestText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textSecondary,
  },
  meetupSection: {
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.dark.accentLight,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.2)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  meetupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetupText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.accent,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  messageBtn: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  messageBtnPressed: {
    opacity: 0.9,
  },
  messageBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
    paddingVertical: 18,
    minWidth: 220,
  },
  messageBtnText: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});
