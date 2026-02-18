import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Avatar } from '@/components/Avatar';
import { useUser, ALL_INTERESTS } from '@/lib/user-context';

const MAX_INTERESTS = 10;

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.sectionLabel}>
      <Ionicons name={icon as any} size={16} color={Colors.dark.accent} />
      <Text style={styles.sectionLabelText}>{label}</Text>
    </View>
  );
}

function FieldCard({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  icon: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon as any} size={16} color={Colors.dark.textMuted} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={Colors.dark.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const { profile, updateProfile, interestThreshold, setInterestThreshold } = useUser();

  const [name, setName] = useState(profile.name);
  const [school, setSchool] = useState(profile.school);
  const [major, setMajor] = useState(profile.major);
  const [hometown, setHometown] = useState(profile.hometown);
  const [quote, setQuote] = useState(profile.quote);
  const [age, setAge] = useState(profile.age.toString());
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests);
  const [threshold, setThreshold] = useState(interestThreshold);

  const handlePickImage = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        updateProfile({ avatarUrl: result.assets[0].uri });
      }
    } catch (e) {
      console.error('Image picker error', e);
    }
  }, []);

  const toggleInterest = (interest: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      if (prev.length >= MAX_INTERESTS) {
        if (Platform.OS === 'web') {
          alert(`You can only select up to ${MAX_INTERESTS} interests`);
        } else {
          Alert.alert('Limit reached', `You can only select up to ${MAX_INTERESTS} interests`);
        }
        return prev;
      }
      return [...prev, interest];
    });
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    updateProfile({
      name: name.trim() || profile.name,
      school: school.trim() || profile.school,
      major: major.trim() || profile.major,
      hometown: hometown.trim() || profile.hometown,
      quote: quote.trim() || profile.quote,
      age: parseInt(age, 10) || profile.age,
      interests: selectedInterests,
      interestThreshold: threshold,
    });
    setInterestThreshold(threshold);
    router.back();
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const adjustThreshold = (delta: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setThreshold(prev => Math.max(0, Math.min(10, prev + delta)));
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <LinearGradient
        colors={['#0A0A0F', '#100A1F', '#0D1117', '#0A0A0F']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <LinearGradient
            colors={[Colors.dark.accent, '#00B894']}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'web' ? 34 : 50 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.delay(50).duration(400)} style={styles.avatarSection}>
          <Pressable onPress={handlePickImage}>
            <Avatar
              uri={profile.avatarUrl}
              size={100}
              borderColor={Colors.dark.accent}
            />
            <View style={styles.editBadge}>
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </Pressable>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <SectionLabel icon="person" label="About You" />
          <View style={styles.fieldsGroup}>
            <FieldCard label="Name" value={name} onChangeText={setName} icon="person-outline" />
            <FieldCard
              label="Age"
              value={age}
              onChangeText={setAge}
              icon="calendar-outline"
            />
            <FieldCard
              label="Quote"
              value={quote}
              onChangeText={setQuote}
              icon="chatbubble-outline"
              placeholder="Your vibe..."
              multiline
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <SectionLabel icon="school" label="Education" />
          <View style={styles.fieldsGroup}>
            <FieldCard label="School" value={school} onChangeText={setSchool} icon="business-outline" />
            <FieldCard label="Major" value={major} onChangeText={setMajor} icon="book-outline" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <SectionLabel icon="location" label="Location" />
          <View style={styles.fieldsGroup}>
            <FieldCard label="Hometown" value={hometown} onChangeText={setHometown} icon="navigate-outline" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)}>
          <SectionLabel icon="sparkles" label={`Interests (${selectedInterests.length}/${MAX_INTERESTS})`} />
          <View style={styles.interestsGrid}>
            {ALL_INTERESTS.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Pressable
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    isSelected && styles.interestChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.interestChipText,
                      isSelected && styles.interestChipTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={14} color={Colors.dark.accent} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(400)}>
          <SectionLabel icon="options" label="Connection Threshold" />
          <View style={styles.thresholdCard}>
            <Text style={styles.thresholdDesc}>
              Only show people on the map with at least this many interests in common with you
            </Text>
            <View style={styles.thresholdControl}>
              <Pressable
                onPress={() => adjustThreshold(-1)}
                style={[styles.thresholdBtn, threshold <= 0 && styles.thresholdBtnDisabled]}
                disabled={threshold <= 0}
              >
                <Ionicons name="remove" size={20} color={threshold <= 0 ? Colors.dark.textMuted : Colors.dark.text} />
              </Pressable>
              <View style={styles.thresholdValue}>
                <Text style={styles.thresholdNumber}>{threshold}</Text>
                <Text style={styles.thresholdLabel}>
                  {threshold === 1 ? 'interest' : 'interests'}
                </Text>
              </View>
              <Pressable
                onPress={() => adjustThreshold(1)}
                style={[styles.thresholdBtn, threshold >= 10 && styles.thresholdBtnDisabled]}
                disabled={threshold >= 10}
              >
                <Ionicons name="add" size={20} color={threshold >= 10 ? Colors.dark.textMuted : Colors.dark.text} />
              </Pressable>
            </View>
            {threshold > 0 && (
              <View style={styles.thresholdHint}>
                <Ionicons name="information-circle" size={14} color={Colors.dark.secondary} />
                <Text style={styles.thresholdHintText}>
                  Setting to 0 shows everyone nearby
                </Text>
              </View>
            )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  saveBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  changePhotoText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionLabelText: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.dark.text,
  },
  fieldsGroup: {
    gap: 10,
  },
  fieldCard: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  fieldInput: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.text,
    padding: 0,
  },
  fieldInputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  interestChipSelected: {
    backgroundColor: Colors.dark.accentLight,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  interestChipText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: Colors.dark.textSecondary,
  },
  interestChipTextSelected: {
    color: Colors.dark.accent,
  },
  thresholdCard: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  thresholdDesc: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  thresholdControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  thresholdBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  thresholdBtnDisabled: {
    opacity: 0.4,
  },
  thresholdValue: {
    alignItems: 'center',
    minWidth: 60,
  },
  thresholdNumber: {
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    color: Colors.dark.accent,
  },
  thresholdLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.textMuted,
    marginTop: -2,
  },
  thresholdHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  thresholdHintText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.dark.secondary,
  },
});
