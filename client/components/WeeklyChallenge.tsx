import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  FadeInUp, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { apiRequest, getApiUrl } from '@/lib/query-client';

const { width } = Dimensions.get('window');

interface WeeklyChallengeProps {
  deviceId: string;
  onRewardClaimed?: () => void;
}

export const WeeklyChallenge = ({ deviceId, onRewardClaimed }: WeeklyChallengeProps) => {
  const { theme } = useTheme();
  const [challenge, setChallenge] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    fetchChallenge();
  }, [deviceId]);

  // Add effect to refresh on prop change if needed, 
  // but better to add an interval or handle it via focus
  useEffect(() => {
    const interval = setInterval(fetchChallenge, 30000); // Every 30s as fallback
    return () => clearInterval(interval);
  }, [deviceId]);

  const fetchChallenge = async () => {
    try {
      const response = await fetch(new URL(`/api/weekly-challenge/${deviceId}`, getApiUrl()).toString());
      const data = await response.json();
      setChallenge(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const handleClaim = async () => {
    if (isClaiming || challenge?.isClaimed) return;
    
    setIsClaiming(true);
    
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(0.9),
      withSpring(1)
    );

    try {
      await apiRequest('POST', '/api/weekly-challenge/claim', { deviceId });
      await fetchChallenge();
      if (onRewardClaimed) onRewardClaimed();
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!challenge) return null;

  const uniqueCount = challenge.uniqueAgentsChatted?.length || 0;
  const progress = Math.min(uniqueCount / 3, 1);
  const isComplete = uniqueCount >= 3;
  const isClaimed = challenge.isClaimed === 1;

  if (isClaimed) return null;

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.container}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
        style={[styles.card, { borderColor: theme.neonRed }]}
      >
        <View style={styles.header}>
          <View>
            <ThemedText type="h4" style={{ color: theme.neonRed }}>Weekly Challenge</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Chat with 3 different personalities
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ color: theme.neonRed, fontWeight: '700' }}>
            {uniqueCount}/3
          </ThemedText>
        </View>

        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: theme.neonRed,
                width: `${progress * 100}%` 
              }
            ]} 
          />
        </View>

        {isComplete ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleClaim}
            style={[styles.claimButton, { backgroundColor: theme.neonRed }]}
          >
            <ThemedText style={styles.claimText}>
              {isClaiming ? 'Claiming...' : 'Claim Bonus XP! 🔥'}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm, fontStyle: 'italic' }}>
            Talk to {3 - uniqueCount} more companions to earn 500 bonus XP!
          </ThemedText>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  claimButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  claimText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
