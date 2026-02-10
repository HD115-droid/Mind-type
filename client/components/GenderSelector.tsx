import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Gender } from '@/data/mbtiTypes';
import { ThemedText } from './ThemedText';
import { BorderRadius, Spacing } from '@/constants/theme';

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  compact?: boolean;
}

export function GenderSelector({ value, onChange, compact = false }: GenderSelectorProps) {
  const { theme } = useTheme();

  const handleSelect = (gender: Gender) => {
    onChange(gender);
  };

  const genders: { value: Gender; icon: keyof typeof Feather.glyphMap; label: string }[] = [
    { value: 'male', icon: 'user', label: 'Male' },
    { value: 'female', icon: 'user', label: 'Female' },
  ];

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {genders.map((g) => (
          <Pressable
            key={g.value}
            onPress={() => handleSelect(g.value)}
            style={[
              styles.compactOption,
              {
                backgroundColor: value === g.value ? theme.neonRed : theme.backgroundSecondary,
                borderColor: value === g.value ? theme.neonRed : theme.border,
              },
            ]}
          >
            <Feather 
              name={g.icon} 
              size={14} 
              color={value === g.value ? '#FFFFFF' : theme.textSecondary} 
            />
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {genders.map((g) => (
        <Pressable
          key={g.value}
          onPress={() => handleSelect(g.value)}
          style={[
            styles.option,
            {
              backgroundColor: value === g.value ? theme.neonRed : theme.backgroundSecondary,
              borderColor: value === g.value ? theme.neonRed : theme.border,
            },
          ]}
        >
          <Feather 
            name={g.icon} 
            size={18} 
            color={value === g.value ? '#FFFFFF' : theme.textSecondary} 
          />
          <ThemedText 
            type="small" 
            style={{ color: value === g.value ? '#FFFFFF' : theme.textSecondary }}
          >
            {g.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  compactContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  compactOption: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
