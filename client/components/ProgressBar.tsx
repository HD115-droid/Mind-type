import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
}

export function ProgressBar({ progress, height = 4 }: ProgressBarProps) {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${withSpring(Math.min(100, Math.max(0, progress * 100)), { damping: 15 })}%`,
  }));

  return (
    <View style={[styles.container, { height, backgroundColor: theme.backgroundSecondary }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            height,
            backgroundColor: theme.neonRed,
            shadowColor: theme.neonRed,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: BorderRadius.full,
  },
});
