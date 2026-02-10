import React, { useMemo } from 'react';
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
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { events, friends } from '@/lib/mock-data';
import type { Event } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

function EventCard({ event, index, userInterests }: { event: Event; index: number; userInterests: string[] }) {
  const friendsGoingData = useMemo(() => {
    return friends.filter(f => event.friendsGoing.includes(f.id));
  }, [event.friendsGoing]);

  const displayedFriends = friendsGoingData.slice(0, 3);
  const extraFriends = friendsGoingData.length - 3;

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(400)}>
      <View style={styles.card}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {event.description}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.dark.textSecondary} />
            <Text style={styles.infoText}>{event.date} at {event.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={Colors.dark.textSecondary} />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>

          <View style={styles.tagsRow}>
            {event.tags.map((tag) => {
              const isMatch = userInterests.includes(tag);
              return (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    isMatch ? styles.tagMatch : styles.tagDefault,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isMatch ? styles.tagTextMatch : styles.tagTextDefault,
                    ]}
                  >
                    {tag}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              {friendsGoingData.length > 0 && (
                <View style={styles.avatarStack}>
                  {displayedFriends.map((friend, i) => (
                    <View key={friend.id} style={[styles.avatarWrap, { marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }]}>
                      <Avatar
                        uri={friend.avatarUrl}
                        size={28}
                        borderColor={Colors.dark.background}
                      />
                    </View>
                  ))}
                  {extraFriends > 0 && (
                    <Text style={styles.extraText}>+{extraFriends}</Text>
                  )}
                </View>
              )}
              <View style={styles.attendeeRow}>
                <Ionicons name="people-outline" size={14} color={Colors.dark.textMuted} />
                <Text style={styles.attendeeText}>{event.attendeeCount} going</Text>
              </View>
            </View>

            <Pressable style={({ pressed }) => [styles.goingBtn, pressed && styles.goingBtnPressed]}>
              <LinearGradient
                colors={[Colors.dark.accent, '#00B894']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goingGradient}
              >
                <Ionicons name="checkmark" size={16} color="#000" />
                <Text style={styles.goingText}>Going</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const { profile } = useUser();

  const { friendEvents, openEvents } = useMemo(() => {
    const friendIds = friends.map(f => f.id);
    const fEvents = events.filter(e => e.friendsGoing.some(id => friendIds.includes(id)));
    const oEvents = events.filter(e => !e.friendsGoing.some(id => friendIds.includes(id)));
    return { friendEvents: fEvents, openEvents: oEvents };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={22} color={Colors.dark.accent} />
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{events.length}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'web' ? 84 + 34 : 100 },
        ]}
      >
        {friendEvents.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={16} color={Colors.dark.secondary} />
              <Text style={styles.sectionTitle}>Friends are going</Text>
            </View>
            {friendEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                userInterests={profile.interests}
              />
            ))}
          </>
        )}

        {openEvents.length > 0 && (
          <>
            <View style={[styles.sectionHeader, friendEvents.length > 0 && { marginTop: 24 }]}>
              <Ionicons name="compass" size={16} color={Colors.dark.pink} />
              <Text style={styles.sectionTitle}>Open events</Text>
            </View>
            {openEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index + friendEvents.length}
                userInterests={profile.interests}
              />
            ))}
          </>
        )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: Colors.dark.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.accent,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.textSecondary,
  },
  card: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.text,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagMatch: {
    backgroundColor: Colors.dark.accentLight,
  },
  tagDefault: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
  },
  tagTextMatch: {
    color: Colors.dark.accent,
  },
  tagTextDefault: {
    color: Colors.dark.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  extraText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeeText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
  },
  goingBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  goingBtnPressed: {
    opacity: 0.8,
  },
  goingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goingText: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#000',
  },
});
