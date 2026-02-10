import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { TypeBadge } from '@/components/TypeBadge';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { MBTIType, getPersonalityByType } from '@/data/mbtiTypes';
import { AxisScores } from '@/data/mbtiQuestions';
import { Spacing, Shadows, BorderRadius } from '@/constants/theme';

type RootStackParamList = {
  Results: { type: string; scores?: AxisScores };
  Main: undefined;
  TypeSelector: undefined;
};

interface AxisBarProps {
  leftLetter: string;
  rightLetter: string;
  leftScore: number;
  rightScore: number;
  winnerLetter: string;
  isWeak: boolean;
}

function AxisBar({ leftLetter, rightLetter, leftScore, rightScore, winnerLetter, isWeak }: AxisBarProps) {
  const { theme } = useTheme();
  const total = leftScore + rightScore;
  const leftPercent = total > 0 ? (leftScore / total) * 100 : 50;
  const isLeftWinner = winnerLetter === leftLetter;

  return (
    <View style={styles.axisContainer}>
      <View style={styles.axisLabels}>
        <View style={styles.axisLabelLeft}>
          <ThemedText 
            type="body" 
            style={[
              styles.axisLetter, 
              { color: isLeftWinner ? theme.neonRed : theme.textSecondary }
            ]}
          >
            {leftLetter}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {leftScore}
          </ThemedText>
        </View>
        <View style={styles.axisLabelRight}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {rightScore}
          </ThemedText>
          <ThemedText 
            type="body" 
            style={[
              styles.axisLetter, 
              { color: !isLeftWinner ? theme.neonRed : theme.textSecondary }
            ]}
          >
            {rightLetter}
          </ThemedText>
        </View>
      </View>
      <View style={[styles.axisBar, { backgroundColor: theme.backgroundSecondary }]}>
        <View 
          style={[
            styles.axisBarFill, 
            { 
              width: `${leftPercent}%`,
              backgroundColor: isLeftWinner ? theme.neonRed : 'rgba(139, 92, 246, 0.3)',
            }
          ]} 
        />
        <View 
          style={[
            styles.axisBarFillRight, 
            { 
              width: `${100 - leftPercent}%`,
              backgroundColor: !isLeftWinner ? theme.neonRed : 'rgba(139, 92, 246, 0.3)',
            }
          ]} 
        />
      </View>
      {isWeak ? (
        <ThemedText type="small" style={[styles.weakLabel, { color: theme.textSecondary }]}>
          Weak preference
        </ThemedText>
      ) : null}
    </View>
  );
}

export default function ResultsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Results'>>();
  const { setUserMBTI, setHasCompletedTest } = useApp();

  const type = route.params.type as MBTIType;
  const scores = route.params.scores;
  const personality = getPersonalityByType(type);

  useEffect(() => {
  }, []);

  const handleAdjust = () => {
    navigation.navigate('TypeSelector');
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  const handleConfirm = async () => {
    await setUserMBTI(type);
    await setHasCompletedTest(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', state: { routes: [{ name: 'AgentsTab' }] } }],
      })
    );
  };

  const handleGoToCompanions = async () => {
    await setUserMBTI(type);
    await setHasCompletedTest(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', state: { routes: [{ name: 'AgentsTab' }] } }],
      })
    );
  };

  if (!personality) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Type not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + Spacing["3xl"] },
      ]}
    >
      <Animated.View entering={FadeIn.delay(200)} style={styles.badgeContainer}>
        <View style={[styles.glowContainer, Shadows.neonGlow]}>
          <TypeBadge type={type} size="large" selected />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.titleContainer}>
        <ThemedText type="h3" style={styles.roleName}>
          {personality.roleName}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500)} style={styles.descriptionContainer}>
        <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
          {personality.description}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(550)} style={styles.ctaCardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleGoToCompanions}
          style={[styles.ctaCard, { backgroundColor: theme.neonRed, ...Shadows.buttonGlow }]}
        >
          <ThemedText type="h4" style={styles.ctaText}>
            Chat with your personality companions now →
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>

      {scores ? (
        <Animated.View entering={FadeInUp.delay(550)} style={styles.scoresContainer}>
          <ThemedText type="h4" style={styles.sectionTitle}>Your Axis Scores</ThemedText>
          <View style={[styles.scoresCard, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
            <AxisBar 
              leftLetter="E" 
              rightLetter="I" 
              leftScore={scores.E} 
              rightScore={scores.I}
              winnerLetter={scores.E >= scores.I ? 'E' : 'I'}
              isWeak={scores.E === scores.I}
            />
            <AxisBar 
              leftLetter="S" 
              rightLetter="N" 
              leftScore={scores.S} 
              rightScore={scores.N}
              winnerLetter={scores.S >= scores.N ? 'S' : 'N'}
              isWeak={scores.S === scores.N}
            />
            <AxisBar 
              leftLetter="T" 
              rightLetter="F" 
              leftScore={scores.T} 
              rightScore={scores.F}
              winnerLetter={scores.T >= scores.F ? 'T' : 'F'}
              isWeak={scores.T === scores.F}
            />
            <AxisBar 
              leftLetter="J" 
              rightLetter="P" 
              leftScore={scores.J} 
              rightScore={scores.P}
              winnerLetter={scores.J >= scores.P ? 'J' : 'P'}
              isWeak={scores.J === scores.P}
            />
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(600)} style={styles.strengthsContainer}>
        <ThemedText type="h4" style={styles.sectionTitle}>Your Strengths</ThemedText>
        <View style={styles.strengthsGrid}>
          {personality.strengths.map((strength, index) => (
            <View 
              key={index} 
              style={[styles.strengthChip, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
            >
              <ThemedText type="small">{strength}</ThemedText>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700)} style={styles.questionContainer}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Does this sound like you?
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(800)} style={styles.buttonContainer}>
        <Button onPress={handleConfirm} testID="button-confirm-type">
          Yes, that's me!
        </Button>
        <Button variant="outline" onPress={handleAdjust} testID="button-adjust-type">
          No, let me choose my type
        </Button>
        <Button variant="ghost" onPress={handleRetake} testID="button-retake">
          Retake the test
        </Button>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  badgeContainer: {
    marginBottom: Spacing["2xl"],
  },
  glowContainer: {
    borderRadius: BorderRadius.lg,
  },
  titleContainer: {
    marginBottom: Spacing.md,
  },
  roleName: {
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  description: {
    textAlign: 'center',
    lineHeight: 26,
  },
  ctaCardContainer: {
    width: '100%',
    marginVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  ctaCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
  scoresContainer: {
    width: '100%',
    marginBottom: Spacing["2xl"],
  },
  scoresCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.lg,
  },
  axisContainer: {
    gap: Spacing.xs,
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  axisLabelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  axisLetter: {
    fontWeight: '700',
    fontSize: 18,
  },
  axisBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  axisBarFill: {
    height: '100%',
  },
  axisBarFillRight: {
    height: '100%',
  },
  weakLabel: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 11,
  },
  strengthsContainer: {
    width: '100%',
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  strengthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  strengthChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  questionContainer: {
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
});
