import { MBTIType } from './mbtiTypes';

export interface CompanionBorder {
  id: string;
  name: string;
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Exotic';
  tierColor: string;
  description: string;
  borderColor: string;
  glowColor: string;
  backgroundColor: string;
  accentColor: string;
  unlockType: 'default' | 'friendship' | 'weekly' | 'streak';
  unlockRequirement?: number;
  unlockLabel?: string;
}

export const companionBorders: CompanionBorder[] = [
  {
    id: 'default',
    name: 'Classic',
    tier: 'Common',
    tierColor: '#B0B0B0',
    description: 'The original look',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    glowColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    accentColor: '#FFFFFF',
    unlockType: 'default',
  },
  {
    id: 'warm_glow',
    name: 'Warm Glow',
    tier: 'Uncommon',
    tierColor: '#2ECC71',
    description: 'A gentle amber aura',
    borderColor: '#2ECC71',
    glowColor: 'rgba(46, 204, 113, 0.3)',
    backgroundColor: 'rgba(46, 204, 113, 0.08)',
    accentColor: '#2ECC71',
    unlockType: 'friendship',
    unlockRequirement: 2,
    unlockLabel: 'Reach Level 2',
  },
  {
    id: 'neon_shadow',
    name: 'Neon Shadow',
    tier: 'Rare',
    tierColor: '#3498DB',
    description: 'Cyberpunk energy pulses',
    borderColor: '#3498DB',
    glowColor: 'rgba(52, 152, 219, 0.4)',
    backgroundColor: 'rgba(52, 152, 219, 0.12)',
    accentColor: '#3498DB',
    unlockType: 'friendship',
    unlockRequirement: 4,
    unlockLabel: 'Reach Level 4',
  },
  {
    id: 'eternal_bond',
    name: 'Eternal Bond',
    tier: 'Epic',
    tierColor: '#9B59B6',
    description: 'The ultimate connection',
    borderColor: '#9B59B6',
    glowColor: 'rgba(155, 89, 182, 0.5)',
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    accentColor: '#9B59B6',
    unlockType: 'friendship',
    unlockRequirement: 5,
    unlockLabel: 'Reach Level 5',
  },
  {
    id: 'soul_fire',
    name: 'Soul Fire',
    tier: 'Legendary',
    tierColor: '#F39C12',
    description: 'Burning with passion',
    borderColor: '#F39C12',
    glowColor: 'rgba(243, 156, 18, 0.45)',
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    accentColor: '#F39C12',
    unlockType: 'weekly',
    unlockRequirement: 3,
    unlockLabel: '3 Weekly Challenges',
  },
  {
    id: 'midnight_aurora',
    name: 'Midnight Aurora',
    tier: 'Mythic',
    tierColor: '#E91E63',
    description: 'Northern lights shimmer',
    borderColor: '#E91E63',
    glowColor: 'rgba(233, 30, 99, 0.35)',
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    accentColor: '#E91E63',
    unlockType: 'streak',
    unlockRequirement: 7,
    unlockLabel: '7-Day Streak',
  },
  {
    id: 'cosmic_void',
    name: 'Cosmic Void',
    tier: 'Exotic',
    tierColor: '#FFD700',
    description: 'Deep space mystery',
    borderColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    accentColor: '#FFD700',
    unlockType: 'streak',
    unlockRequirement: 30,
    unlockLabel: '30-Day Streak',
  },
];

export function getBorderById(borderId: string): CompanionBorder {
  return companionBorders.find(b => b.id === borderId) || companionBorders[0];
}

export function getUnlockedBorders(
  level: number,
  weeklyChallengesCompleted: number,
  currentStreak: number
): CompanionBorder[] {
  return companionBorders.filter(border => {
    if (border.unlockType === 'default') return true;
    if (border.unlockType === 'friendship' && border.unlockRequirement && level >= border.unlockRequirement) return true;
    if (border.unlockType === 'weekly' && border.unlockRequirement && weeklyChallengesCompleted >= border.unlockRequirement) return true;
    if (border.unlockType === 'streak' && border.unlockRequirement && currentStreak >= border.unlockRequirement) return true;
    return false;
  });
}

export function checkForNewUnlock(
  previouslyUnlocked: string[],
  level: number,
  weeklyChallengesCompleted: number,
  currentStreak: number
): CompanionBorder | null {
  const nowUnlocked = getUnlockedBorders(level, weeklyChallengesCompleted, currentStreak);
  for (const border of nowUnlocked) {
    if (!previouslyUnlocked.includes(border.id)) {
      return border;
    }
  }
  return null;
}
