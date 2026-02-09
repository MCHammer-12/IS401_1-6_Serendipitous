import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { friends } from '@/lib/mock-data';
import type { Friend } from '@/lib/mock-data';

function FriendItem({ item, index }: { item: Friend; index: number }) {
  const handleMessage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.friendCard,
          pressed && styles.friendCardPressed,
        ]}
      >
        <View style={styles.friendLeft}>
          <Avatar
            uri={item.avatarUrl}
            size={52}
            borderColor={item.online ? Colors.dark.accent : Colors.dark.glassBorder}
            showOnline
            online={item.online}
          />
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={styles.friendMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleMessage}
          style={({ pressed }) => [
            styles.messageBtn,
            pressed && styles.messageBtnPressed,
          ]}
        >
          <Ionicons name="chatbubble" size={18} color={Colors.dark.accent} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={22} color={Colors.dark.secondary} />
          <Text style={styles.headerTitle}>Friends</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{friends.length}</Text>
        </View>
      </View>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FriendItem item={item} index={index} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 84 + 34 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.dark.textMuted} />
            <Text style={styles.emptyText}>No connections yet</Text>
            <Text style={styles.emptySubtext}>
              Head to the map to find people nearby
            </Text>
          </View>
        }
      />
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
    backgroundColor: Colors.dark.secondaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.secondary,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  friendCardPressed: {
    backgroundColor: Colors.dark.surfaceHover,
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.text,
  },
  friendMessage: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  messageBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.dark.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBtnPressed: {
    backgroundColor: Colors.dark.accentGlow,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
});
