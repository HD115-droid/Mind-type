import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';

export type MoodState = 'irritated' | 'neutral' | 'pleased' | 'delighted';

interface MoodIndicatorProps {
  state: MoodState;
  value: number;
  compact?: boolean;
}

const moodLabels: Record<MoodState, string> = {
  irritated: 'Irritated',
  neutral: 'Neutral',
  pleased: 'Pleased',
  delighted: 'Delighted',
};

export function MoodIndicator({ state, value, compact = false }: MoodIndicatorProps) {
  const { theme } = useTheme();
  
  const glowIntensity = useSharedValue(0.3);
  const pulseScale = useSharedValue(1);
  
  const moodColor = getMoodColor(state, theme.neonRed);
  
  useEffect(() => {
    if (state === 'irritated') {
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
    } else if (state === 'delighted') {
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1,
        true
      );
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.05, { damping: 10 }),
          withSpring(1, { damping: 10 })
        ),
        -1,
        true
      );
    } else {
      glowIntensity.value = withTiming(0.5, { duration: 400 });
      pulseScale.value = withSpring(1);
    }
  }, [state]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (compact) {
    return (
      <Animated.View style={[styles.compactContainer, animatedContainerStyle]}>
        <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
        <Animated.View 
          style={[
            styles.moodGlow, 
            { backgroundColor: moodColor },
            animatedGlowStyle
          ]} 
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.moodVisual}>
        <View style={[styles.moodOrb, { backgroundColor: moodColor }]}>
          <Animated.View 
            style={[
              styles.orbGlow, 
              { backgroundColor: moodColor },
              animatedGlowStyle
            ]} 
          />
        </View>
        <View style={styles.moodBar}>
          <View 
            style={[
              styles.moodBarFill, 
              { 
                width: `${Math.abs(value) / 2}%`,
                backgroundColor: moodColor,
                alignSelf: value >= 0 ? 'flex-start' : 'flex-end',
                marginLeft: value >= 0 ? '50%' : undefined,
                marginRight: value < 0 ? '50%' : undefined,
              }
            ]} 
          />
          <View style={[styles.moodBarCenter, { backgroundColor: theme.border }]} />
        </View>
      </View>
      <ThemedText type="small" style={[styles.moodLabel, { color: moodColor }]}>
        {moodLabels[state]}
      </ThemedText>
    </Animated.View>
  );
}

function getMoodColor(state: MoodState, neonRed: string): string {
  switch (state) {
    case 'irritated': return '#FF4444';
    case 'neutral': return '#888888';
    case 'pleased': return '#44AA88';
    case 'delighted': return neonRed;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactContainer: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  moodGlow: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 0,
  },
  moodVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moodOrb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  moodBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'visible',
    position: 'relative',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  moodBarCenter: {
    position: 'absolute',
    width: 2,
    height: 8,
    left: '50%',
    top: -2,
    marginLeft: -1,
    borderRadius: 1,
  },
  moodLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
});
