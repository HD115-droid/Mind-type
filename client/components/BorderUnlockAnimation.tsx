import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { CompanionBorder } from '@/data/companionBorders';
import { Spacing, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

interface BorderUnlockAnimationProps {
  visible: boolean;
  border: CompanionBorder | null;
  onComplete: () => void;
}

function Particle({ delay, color }: { delay: number; color: string }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    scale.value = withDelay(delay, withSpring(1 + Math.random() * 0.5));
    rotation.value = withDelay(delay, withTiming(Math.random() * 360, { duration: 1500 }));
    translateX.value = withDelay(delay, withTiming(targetX, { duration: 1200 }));
    translateY.value = withDelay(delay, withTiming(targetY, { duration: 1200 }));
    opacity.value = withDelay(delay + 800, withTiming(0, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <View style={[styles.sparkle, { backgroundColor: color }]} />
    </Animated.View>
  );
}

export function BorderUnlockAnimation({ visible, border, onComplete }: BorderUnlockAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && border) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10 })
      );

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        setTimeout(onComplete, 300);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, border]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !border) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <View style={styles.particleContainer}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <Particle key={i} delay={i * 30} color={border.accentColor} />
        ))}
      </View>
      
      <Animated.View style={[styles.card, cardStyle, { borderColor: border.borderColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: border.backgroundColor }]}>
          <View style={[styles.borderPreview, { 
            borderColor: border.borderColor,
            shadowColor: border.glowColor,
          }]} />
        </View>
        
        <ThemedText type="h3" style={styles.title}>New Border Unlocked!</ThemedText>
        <View style={[styles.tierBadge, { backgroundColor: border.tierColor }]}>
          <ThemedText type="small" style={styles.tierText}>{border.tier}</ThemedText>
        </View>
        <ThemedText type="h4" style={[styles.borderName, { color: border.accentColor }]}>
          {border.name}
        </ThemedText>
        <ThemedText type="small" style={styles.description}>
          {border.description}
        </ThemedText>
        <ThemedText type="small" style={styles.message}>
          "Look at me now! What do you think?"
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  particleContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
  sparkle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#1A1A1F',
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: 300,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  borderPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  borderName: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
