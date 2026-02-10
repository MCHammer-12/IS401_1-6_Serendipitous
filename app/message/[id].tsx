import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { nearbyPeople, friends, Friend } from '@/lib/mock-data';

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
}

function generateMockMessages(personId: string, personName: string): Message[] {
  const friend = friends.find(f => f.id === personId);
  const nearby = nearbyPeople.find(p => p.id === personId);

  if (friend) {
    return [
      { id: '1', text: friend.lastMessage, sent: false, timestamp: '2m ago' },
      { id: '2', text: 'haha for real!', sent: true, timestamp: '5m ago' },
      { id: '3', text: 'we should hang out again soon', sent: false, timestamp: '8m ago' },
      { id: '4', text: 'totally down, lmk when you\'re free', sent: true, timestamp: '10m ago' },
      { id: '5', text: 'this weekend works?', sent: false, timestamp: '12m ago' },
      { id: '6', text: 'yesss let\'s do it', sent: true, timestamp: '15m ago' },
    ];
  }

  if (nearby) {
    const sharedInterest = nearby.interests[0] || 'stuff';
    return [
      { id: '1', text: `hey! nice to meet you`, sent: false, timestamp: '1m ago' },
      { id: '2', text: `hey ${personName}! likewise :)`, sent: true, timestamp: '3m ago' },
      { id: '3', text: `i saw you're into ${sharedInterest.toLowerCase()} too!`, sent: false, timestamp: '5m ago' },
      { id: '4', text: `yes! it's the best`, sent: true, timestamp: '7m ago' },
    ];
  }

  return [
    { id: '1', text: 'hey!', sent: false, timestamp: '1m ago' },
    { id: '2', text: 'hi there!', sent: true, timestamp: '2m ago' },
  ];
}

export default function MessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');

  const person = useMemo(() => {
    return nearbyPeople.find(p => p.id === id) || friends.find(f => f.id === id);
  }, [id]);

  const personName = person?.name ?? 'User';
  const personAvatar = person?.avatarUrl ?? '';
  const isFriend = !!(person && 'lastMessage' in person);
  const isOnline = isFriend ? (person as Friend).online : undefined;

  const [messages, setMessages] = useState<Message[]>(() =>
    generateMockMessages(id ?? '', personName)
  );

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: trimmed,
      sent: true,
      timestamp: 'now',
    };

    setMessages(prev => [newMessage, ...prev]);
    setInputText('');
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sent ? styles.sentBubble : styles.receivedBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sent ? styles.sentText : styles.receivedText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.messageTime,
          item.sent ? styles.sentTime : styles.receivedTime,
        ]}
      >
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0A0A0F', '#0D1117', '#0A0A0F']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.dark.text} />
          </TouchableOpacity>
          <Avatar
            uri={personAvatar}
            size={40}
            borderColor={Colors.dark.accent}
            showOnline={isFriend}
            online={isOnline}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{personName}</Text>
            {isFriend && isOnline !== undefined && (
              <Text style={styles.headerStatus}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            )}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.divider} />

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={styles.messagesList}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: bottomPadding + 8 },
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.dark.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  inputText.trim()
                    ? Colors.dark.accent
                    : Colors.dark.textMuted
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.dark.glass,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.glassBorder,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
  },
  headerStatus: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 1,
  },
  headerSpacer: {
    width: 40,
  },
  divider: {
    height: 0,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 3,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark.accent,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sentText: {
    fontFamily: 'Outfit_400Regular',
    color: '#0A0A0F',
  },
  receivedText: {
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  sentTime: {
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(10, 10, 15, 0.5)',
    textAlign: 'right',
  },
  receivedTime: {
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: Colors.dark.glass,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.dark.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.dark.text,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    marginLeft: 8,
    padding: 6,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
