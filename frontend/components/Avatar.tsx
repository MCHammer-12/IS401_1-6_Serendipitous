import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/colors';

interface AvatarProps {
  uri: string;
  size?: number;
  borderColor?: string;
  showOnline?: boolean;
  online?: boolean;
}

export function Avatar({ uri, size = 80, borderColor, showOnline, online }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.borderWrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: borderColor || Colors.dark.accent,
          },
        ]}
      >
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size - 4,
              height: size - 4,
              borderRadius: (size - 4) / 2,
            },
          ]}
          contentFit="cover"
          transition={300}
        />
      </View>
      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              backgroundColor: online ? '#00D4AA' : 'rgba(255,255,255,0.2)',
              bottom: size * 0.02,
              right: size * 0.02,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  borderWrap: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: Colors.dark.surface,
  },
  onlineDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
});
