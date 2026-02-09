import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currentUser as defaultUser, nearbyPeople } from '@/lib/mock-data';
import type { UserProfile } from '@/lib/mock-data';

const STORAGE_KEY = '@serendipitous_profile';
const THRESHOLD_KEY = '@serendipitous_threshold';

export const ALL_INTERESTS = [
  'Rock climbing',
  'Make playlists',
  'Play volleyball',
  'Cook ramen',
  'Watch Succession',
  'Thrift shopping',
  'Sunset hikes',
  'Photography',
  'Skateboarding',
  'Vinyl records',
  'Film festivals',
  'Play guitar',
  'Coffee tasting',
  'Board games',
  'Dance',
  'Yoga',
  'Podcasts',
  'Surf',
  'Cook',
  'Gaming',
  'Reading',
  'Running',
  'Painting',
  'Hiking',
  'Travel',
  'Music production',
  'Anime',
  'Gym',
  'Poetry',
  'Meditation',
];

export interface SerendipityScore {
  person: UserProfile;
  score: number;
  commonInterests: string[];
  sameSchool: boolean;
  sameMajor: boolean;
  sameHometown: boolean;
}

interface UserContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  interestThreshold: number;
  setInterestThreshold: (val: number) => void;
  getSerendipityScores: () => SerendipityScore[];
  getCommonInterestsWithPerson: (personId: string) => string[];
  filteredNearbyPeople: UserProfile[];
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultUser);
  const [interestThreshold, setInterestThresholdState] = useState<number>(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedProfile, savedThreshold] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(THRESHOLD_KEY),
        ]);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
        if (savedThreshold) {
          setInterestThresholdState(parseInt(savedThreshold, 10));
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
      setLoaded(true);
    })();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(console.error);
      return next;
    });
  };

  const setInterestThreshold = (val: number) => {
    setInterestThresholdState(val);
    AsyncStorage.setItem(THRESHOLD_KEY, val.toString()).catch(console.error);
  };

  const getCommonInterestsWithPerson = (personId: string): string[] => {
    const person = nearbyPeople.find(p => p.id === personId);
    if (!person) return [];
    return profile.interests.filter(i => person.interests.includes(i));
  };

  const getSerendipityScores = (): SerendipityScore[] => {
    return nearbyPeople.map(person => {
      const commonInterests = profile.interests.filter(i => person.interests.includes(i));
      const sameSchool = profile.school.toLowerCase() === person.school.toLowerCase();
      const sameMajor = profile.major.toLowerCase() === person.major.toLowerCase();
      const sameHometown = profile.hometown.toLowerCase() === person.hometown.toLowerCase();

      let score = 0;
      score += commonInterests.length * 15;
      if (sameSchool) score += 20;
      if (sameMajor) score += 25;
      if (sameHometown) score += 30;
      const ageDiff = Math.abs(profile.age - person.age);
      if (ageDiff <= 1) score += 10;
      else if (ageDiff <= 3) score += 5;

      const maxPossible = profile.interests.length * 15 + 20 + 25 + 30 + 10;
      score = Math.min(Math.round((score / Math.max(maxPossible, 1)) * 100), 99);
      score = Math.max(score, 5);

      return { person, score, commonInterests, sameSchool, sameMajor, sameHometown };
    }).sort((a, b) => b.score - a.score);
  };

  const filteredNearbyPeople = useMemo(() => {
    return nearbyPeople.filter(person => {
      const common = profile.interests.filter(i => person.interests.includes(i));
      return common.length >= interestThreshold;
    });
  }, [profile.interests, interestThreshold]);

  const value = useMemo(() => ({
    profile,
    updateProfile,
    interestThreshold,
    setInterestThreshold,
    getSerendipityScores,
    getCommonInterestsWithPerson,
    filteredNearbyPeople,
  }), [profile, interestThreshold, filteredNearbyPeople]);

  if (!loaded) return null;

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
