import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  FadeIn, 
  FadeInRight, 
  FadeOutLeft, 
  FadeInUp,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { questions, calculateResults, TestResults } from '@/data/mbtiQuestions';
import { Spacing, BorderRadius } from '@/constants/theme';

import { AxisScores } from '@/data/mbtiQuestions';

type RootStackParamList = {
  Results: { type: string; scores?: AxisScores };
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TestScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { hasCompletedTest, userMBTI } = useApp();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const question = questions[currentQuestion];
  const progress = (currentQuestion + 1) / questions.length;

  const pulseScale = useSharedValue(1);

  const handleOptionSelect = useCallback((option: 'A' | 'B') => {
    setSelectedOption(option);
    
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);
    
    pulseScale.value = withSequence(
      withSpring(1.02, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(answers[questions[currentQuestion + 1]?.id] || null);
      } else {
        const results = calculateResults(newAnswers);
        navigation.navigate('Results', { type: results.type, scores: results.scores });
      }
    }, 300);
  }, [pulseScale, answers, question.id, currentQuestion, navigation]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] ?? null);
    }
  }, [currentQuestion, answers]);

  const handleStartTest = useCallback(() => {
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
  }, []);

  if (!isStarted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.15)', 'transparent', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />
        <ScrollView
          contentContainerStyle={[
            styles.startContent,
            { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
        >
          <Animated.View entering={FadeIn.delay(100)} style={styles.startContainer}>
            <Animated.View entering={FadeInUp.delay(200).springify()}>
              <ThemedText type="h1" style={styles.startTitle}>
                Discover Your Mind
              </ThemedText>
            </Animated.View>
            
            <Animated.View entering={FadeIn.delay(400)}>
              <ThemedText type="body" style={[styles.startDescription, { color: theme.textSecondary }]}>
                Answer 14 quick questions to uncover your personality type. Simply choose whichever option feels more natural to you.
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.infoCards}>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: theme.neonRed }]}>
                <ThemedText type="h3" style={{ color: theme.neonRed }}>14</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Questions</ThemedText>
              </View>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: theme.neonRed }]}>
                <ThemedText type="h3" style={{ color: theme.neonRed }}>2-3</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Minutes</ThemedText>
              </View>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: theme.neonRed }]}>
                <ThemedText type="h3" style={{ color: theme.neonRed }}>A/B</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Choices</ThemedText>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(700)} style={styles.startButtonContainer}>
              {hasCompletedTest && userMBTI ? (
                <View style={styles.retakeContainer}>
                  <View style={[styles.currentTypeBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: theme.neonRed }]}>
                    <ThemedText type="small" style={{ color: theme.textSecondary }}>
                      Current type:
                    </ThemedText>
                    <ThemedText type="h4" style={{ color: theme.neonRed }}>{userMBTI}</ThemedText>
                  </View>
                  <Button onPress={handleStartTest} testID="button-retake-test">
                    Retake Test
                  </Button>
                </View>
              ) : (
                <Button onPress={handleStartTest} testID="button-start-test" size="large">
                  Begin Your Journey
                </Button>
              )}
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.3 }}
      />
      
      <View style={[styles.progressContainer, { paddingTop: headerHeight + Spacing.md }]}>
        <View style={styles.progressHeader}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Question {currentQuestion + 1} of {questions.length}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.neonRed, fontWeight: '700' }}>
            {Math.round(progress * 100)}%
          </ThemedText>
        </View>
        <ProgressBar progress={progress} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.questionContent, { paddingBottom: tabBarHeight + Spacing["3xl"] }]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <Animated.View 
          key={currentQuestion} 
          entering={FadeInRight.duration(300).springify()} 
          exiting={FadeOutLeft.duration(200)}
        >
          <ThemedText type="h3" style={styles.questionText}>
            {question.text}
          </ThemedText>

          <View style={styles.options}>
            <AnimatedTouchable
              entering={FadeInUp.delay(80).springify()}
              activeOpacity={0.8}
              onPress={() => handleOptionSelect('A')}
              testID="option-a"
              style={[
                styles.optionTouchable,
                {
                  backgroundColor: selectedOption === 'A' ? 'rgba(139, 92, 246, 0.2)' : theme.backgroundElevated,
                  borderColor: selectedOption === 'A' ? theme.neonRed : theme.border,
                  borderWidth: selectedOption === 'A' ? 2 : 1,
                },
                selectedOption === 'A' && styles.optionSelected,
              ]}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionLabel,
                    {
                      backgroundColor: selectedOption === 'A' ? theme.neonRed : 'rgba(139, 92, 246, 0.2)',
                    },
                  ]}
                >
                  <ThemedText type="body" style={[styles.optionLabelText, { color: selectedOption === 'A' ? '#FFFFFF' : theme.neonRed }]}>
                    A
                  </ThemedText>
                </View>
                <ThemedText type="body" style={[styles.optionText, selectedOption === 'A' && { color: theme.text, fontWeight: '500' }]}>
                  {question.optionA.text}
                </ThemedText>
              </View>
            </AnimatedTouchable>

            <AnimatedTouchable
              entering={FadeInUp.delay(160).springify()}
              activeOpacity={0.8}
              onPress={() => handleOptionSelect('B')}
              testID="option-b"
              style={[
                styles.optionTouchable,
                {
                  backgroundColor: selectedOption === 'B' ? 'rgba(139, 92, 246, 0.2)' : theme.backgroundElevated,
                  borderColor: selectedOption === 'B' ? theme.neonRed : theme.border,
                  borderWidth: selectedOption === 'B' ? 2 : 1,
                },
                selectedOption === 'B' && styles.optionSelected,
              ]}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionLabel,
                    {
                      backgroundColor: selectedOption === 'B' ? theme.neonRed : 'rgba(139, 92, 246, 0.2)',
                    },
                  ]}
                >
                  <ThemedText type="body" style={[styles.optionLabelText, { color: selectedOption === 'B' ? '#FFFFFF' : theme.neonRed }]}>
                    B
                  </ThemedText>
                </View>
                <ThemedText type="body" style={[styles.optionText, selectedOption === 'B' && { color: theme.text, fontWeight: '500' }]}>
                  {question.optionB.text}
                </ThemedText>
              </View>
            </AnimatedTouchable>
          </View>
        </Animated.View>
      </ScrollView>

      {currentQuestion > 0 ? (
        <View style={[styles.footer, { paddingBottom: tabBarHeight + Spacing.lg, backgroundColor: theme.backgroundRoot }]}>
          <LinearGradient
            colors={['transparent', theme.backgroundRoot]}
            style={styles.footerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handleBack}
            style={[styles.backButton, { borderColor: theme.border }]}
            testID="button-back"
          >
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Back
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startContent: {
    paddingHorizontal: Spacing.lg,
  },
  startContainer: {
    alignItems: 'center',
  },
  startTitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  startDescription: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    lineHeight: 26,
  },
  infoCards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing["3xl"],
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  startButtonContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  retakeContainer: {
    alignItems: 'center',
    width: '100%',
    gap: Spacing.xl,
  },
  currentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  questionContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  questionText: {
    marginBottom: Spacing["2xl"],
    lineHeight: 34,
  },
  options: {
    gap: Spacing.lg,
  },
  optionTouchable: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  optionSelected: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  optionLabel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelText: {
    fontWeight: '700',
    fontSize: 18,
  },
  optionText: {
    flex: 1,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    alignItems: 'flex-start',
  },
  footerGradient: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 40,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
});
