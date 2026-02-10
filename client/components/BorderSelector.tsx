import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { CompanionBorder, companionBorders, getBorderById } from '@/data/companionBorders';
import { Spacing, BorderRadius } from '@/constants/theme';

interface BorderSelectorProps {
  selectedBorderId: string;
  unlockedBorderIds: string[];
  onSelectBorder: (borderId: string) => void;
}

export function BorderSelector({ selectedBorderId, unlockedBorderIds, onSelectBorder }: BorderSelectorProps) {
  const { theme } = useTheme();

  const handleSelect = (borderId: string) => {
    if (unlockedBorderIds.includes(borderId)) {
      onSelectBorder(borderId);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
        Choose Border
      </ThemedText>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {companionBorders.map((border, index) => {
          const isUnlocked = unlockedBorderIds.includes(border.id);
          const isSelected = selectedBorderId === border.id;

          return (
            <Animated.View 
              key={border.id}
              entering={FadeIn.delay(index * 50)}
              style={styles.borderWrapper}
            >
              <TouchableOpacity
                activeOpacity={isUnlocked ? 0.7 : 1}
                onPress={() => handleSelect(border.id)}
                style={[
                  styles.borderOption,
                  {
                    borderColor: isSelected ? border.borderColor : theme.border,
                    backgroundColor: isUnlocked ? border.backgroundColor : 'rgba(255, 255, 255, 0.02)',
                    opacity: isUnlocked ? 1 : 0.4,
                  },
                  isSelected && {
                    shadowColor: border.glowColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 8,
                  }
                ]}
              >
                <View style={[styles.borderPreview, { borderColor: border.borderColor }]} />
                <ThemedText 
                  type="small" 
                  style={[
                    styles.borderName, 
                    { color: isUnlocked ? border.accentColor : theme.textSecondary }
                  ]}
                >
                  {border.name}
                </ThemedText>
                
                <View style={[styles.tierBadge, { backgroundColor: border.tierColor }]}>
                  <ThemedText type="small" style={styles.tierText}>{border.tier}</ThemedText>
                </View>

                {!isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Feather name="lock" size={14} color="rgba(255, 255, 255, 0.5)" />
                  </View>
                )}
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: border.accentColor }]}>
                    <Feather name="check" size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              {!isUnlocked && border.unlockLabel && (
                <ThemedText type="small" style={styles.unlockHint}>
                  {border.unlockLabel}
                </ThemedText>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  borderWrapper: {
    alignItems: 'center',
  },
  borderOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    minWidth: 90,
    paddingTop: Spacing.lg,
  },
  borderPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: Spacing.sm,
  },
  borderName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  tierText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BorderRadius.lg,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockHint: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 90,
  },
});
