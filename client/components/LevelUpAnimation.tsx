import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withSequence, 
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface LevelUpAnimationProps {
  visible: boolean;
  level: number;
  onComplete: () => void;
}

const STAR_COUNT = 30;

function Star({ index, animate }: { index: number; animate: boolean }) {
  const starOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const starScale = useMemo(() => Math.random() * 0.8 + 0.2, []);

  useEffect(() => {
    if (animate) {
      const angle = (index / STAR_COUNT) * 2 * Math.PI;
      const distance = Math.random() * (width * 0.4) + 50;
      
      starOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(1000, withTiming(0, { duration: 1000 }))
      );

      translateX.value = withTiming(Math.cos(angle) * distance, {
        duration: 1500,
        easing: Easing.out(Easing.quad),
      });

      translateY.value = withTiming(Math.sin(angle) * distance, {
        duration: 1500,
        easing: Easing.out(Easing.quad),
      });
    } else {
      starOpacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: starOpacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: starScale },
    ],
  }));

  return (
    <Animated.View 
      style={[
        styles.star, 
        { 
          backgroundColor: index % 2 === 0 ? '#8B5CF6' : '#FFD700',
          shadowColor: index % 2 === 0 ? '#8B5CF6' : '#FFD700',
        }, 
        animatedStyle
      ]} 
    />
  );
}

export function LevelUpAnimation({ visible, level, onComplete }: LevelUpAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const textScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12 });
      
      textOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      textScale.value = withDelay(200, withSpring(1.5, { damping: 8 }));

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(setIsAnimating)(false);
          runOnJS(onComplete)();
        });
        textOpacity.value = withTiming(0, { duration: 500 });
        textScale.value = withTiming(0, { duration: 500 });
        scale.value = withTiming(0.5, { duration: 500 });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible && !isAnimating) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.container, containerStyle]}>
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <Star key={i} index={i} animate={visible || isAnimating} />
        ))}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <ThemedText style={styles.levelUpText}>LEVEL UP!</ThemedText>
          <ThemedText style={styles.levelNumber}>Lv. {level}</ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
  },
  levelUpText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8B5CF6',
    textShadowColor: 'rgba(139, 92, 246, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 5,
  },
});
