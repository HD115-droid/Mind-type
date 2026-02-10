import React, { ReactNode } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Shadows } from "@/constants/theme";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'small' | 'large';
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = 'primary',
  size = 'default',
  testID,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.97, { duration: 100 });
      opacity.value = withTiming(0.8, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withTiming(1, { duration: 150 });
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.disabled;
    switch (variant) {
      case 'primary': return theme.neonRed;
      case 'secondary': return theme.backgroundSecondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.neonRed;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: disabled ? theme.disabled : theme.neonRed,
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return theme.text;
      case 'outline': return theme.neonRed;
      case 'ghost': return theme.neonRed;
      default: return '#FFFFFF';
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small': return 36;
      case 'large': return 54;
      default: return Spacing.buttonHeight;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 15;
      case 'large': return 17;
      default: return 17;
    }
  };

  const getShadow = () => {
    if (disabled || variant !== 'primary') return {};
    return Shadows.medium;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
        },
        getBorderStyle(),
        getShadow(),
        style,
        animatedStyle,
      ]}
    >
      <ThemedText
        type="body"
        style={[styles.buttonText, { color: getTextColor(), fontSize: getFontSize() }]}
      >
        {children}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    fontWeight: "600",
  },
});
