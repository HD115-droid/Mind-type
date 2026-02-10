import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { MBTIType } from '@/data/mbtiTypes';
import { ThemedText } from './ThemedText';
import { BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface TypeBadgeProps {
  type: MBTIType;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  onPress?: () => void;
}

export function TypeBadge({ type, size = 'medium', selected = false, onPress }: TypeBadgeProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'small': return { padding: Spacing.sm, fontSize: 12 };
      case 'medium': return { padding: Spacing.md, fontSize: 16 };
      case 'large': return { padding: Spacing.xl, fontSize: 32 };
    }
  };

  const dims = getDimensions();

  const content = (
    <View
      style={[
        styles.badge,
        {
          paddingVertical: dims.padding,
          paddingHorizontal: dims.padding * 1.5,
          borderColor: selected ? theme.neonRed : theme.border,
          backgroundColor: selected ? 'rgba(139, 92, 246, 0.1)' : theme.backgroundSecondary,
        },
        selected && Shadows.neonGlowSmall,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          {
            fontSize: dims.fontSize,
            color: selected ? theme.neonRed : theme.text,
          },
        ]}
      >
        {type}
      </ThemedText>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={handlePress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 2,
  },
});
