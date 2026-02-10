import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { MBTIType, Gender, mbtiPersonalities, getAgentName } from '@/data/mbtiTypes';
import { CompanionBorder, getBorderById } from '@/data/companionBorders';
import { ThemedText } from './ThemedText';
import { BorderRadius, Spacing } from '@/constants/theme';

interface AgentAvatarProps {
  type: MBTIType;
  gender: Gender;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  selected?: boolean;
  borderId?: string;
}

const getAvatarColors = (type: MBTIType): { bg: string; icon: string } => {
  const analysts = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
  const diplomats = ['INFJ', 'INFP', 'ENFJ', 'ENFP'];
  const sentinels = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
  const explorers = ['ISTP', 'ISFP', 'ESTP', 'ESFP'];

  if (analysts.includes(type)) return { bg: '#1a1025', icon: '#9b59b6' };
  if (diplomats.includes(type)) return { bg: '#0f2520', icon: '#2ecc71' };
  if (sentinels.includes(type)) return { bg: '#1a2535', icon: '#3498db' };
  if (explorers.includes(type)) return { bg: '#2a1a10', icon: '#e67e22' };
  return { bg: '#1a1a1a', icon: '#8B5CF6' };
};

const getIconForType = (type: MBTIType): keyof typeof Feather.glyphMap => {
  const iconMap: Partial<Record<MBTIType, keyof typeof Feather.glyphMap>> = {
    INTJ: 'target',
    INTP: 'cpu',
    ENTJ: 'briefcase',
    ENTP: 'zap',
    INFJ: 'eye',
    INFP: 'heart',
    ENFJ: 'users',
    ENFP: 'sun',
    ISTJ: 'check-square',
    ISFJ: 'shield',
    ESTJ: 'clipboard',
    ESFJ: 'gift',
    ISTP: 'tool',
    ISFP: 'feather',
    ESTP: 'trending-up',
    ESFP: 'star',
  };
  return iconMap[type] || 'user';
};

export function AgentAvatar({ type, gender, size = 'medium', showBorder = false, selected = false, borderId = 'default' }: AgentAvatarProps) {
  const { theme } = useTheme();
  const colors = getAvatarColors(type);
  const icon = getIconForType(type);
  const border = getBorderById(borderId);

  const getDimensions = () => {
    switch (size) {
      case 'small': return { size: 40, iconSize: 18, borderWidth: 2 };
      case 'medium': return { size: 60, iconSize: 26, borderWidth: 2 };
      case 'large': return { size: 100, iconSize: 44, borderWidth: 3 };
    }
  };

  const dims = getDimensions();
  const hasBorder = borderId !== 'default';
  const borderColor = hasBorder ? border.borderColor : (selected ? theme.neonRed : theme.border);
  const glowColor = hasBorder ? border.glowColor : (selected ? theme.neonRed : 'transparent');

  return (
    <View
      style={[
        styles.container,
        {
          width: dims.size,
          height: dims.size,
          backgroundColor: hasBorder ? border.backgroundColor : colors.bg,
          borderWidth: hasBorder || showBorder || selected ? dims.borderWidth : 0,
          borderColor: borderColor,
        },
        (hasBorder || selected) && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: hasBorder ? 0.8 : 0.6,
          shadowRadius: hasBorder ? 12 : 8,
          elevation: 8,
        },
      ]}
    >
      <Feather name={icon} size={dims.iconSize} color={hasBorder ? border.accentColor : colors.icon} />
    </View>
  );
}

interface AgentCardProps {
  type: MBTIType;
  gender: Gender;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function AgentCard({ type, gender, onPress, onLongPress, selected = false, compact = false }: AgentCardProps) {
  const { theme } = useTheme();
  const personality = mbtiPersonalities.find(p => p.type === type);
  if (!personality) return null;

  const name = getAgentName(personality, gender);

  if (compact) {
    return (
      <View style={[styles.compactCard, { backgroundColor: theme.backgroundDefault }]}>
        <AgentAvatar type={type} gender={gender} size="small" selected={selected} />
        <View style={styles.compactInfo}>
          <ThemedText type="small" style={styles.compactName}>{name}</ThemedText>
          <ThemedText type="small" style={[styles.compactType, { color: theme.textSecondary }]}>{type}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.backgroundDefault, borderColor: selected ? theme.neonRed : theme.border }]}>
      <AgentAvatar type={type} gender={gender} size="medium" selected={selected} />
      <View style={styles.cardInfo}>
        <ThemedText type="body" style={styles.cardName}>{name}</ThemedText>
        <ThemedText type="small" style={[styles.cardRole, { color: theme.neonRed }]}>{personality.roleName}</ThemedText>
        <ThemedText type="small" style={[styles.cardType, { color: theme.textSecondary }]}>{type}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontWeight: '600',
  },
  compactType: {
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.lg,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  cardRole: {
    fontWeight: '500',
    marginBottom: 2,
  },
  cardType: {
    fontSize: 12,
  },
});
