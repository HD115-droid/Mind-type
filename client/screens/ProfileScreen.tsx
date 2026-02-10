import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TypeBadge } from '@/components/TypeBadge';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { mbtiPersonalities, getPersonalityByType } from '@/data/mbtiTypes';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';

type RootStackParamList = {
  TestTab: undefined;
  TypeSelector: undefined;
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userMBTI, hasCompletedTest, resetTest } = useApp();

  const personality = userMBTI ? getPersonalityByType(userMBTI) : null;

  const handleRetakeTest = async () => {
    await resetTest();
    navigation.navigate('TestTab');
  };

  const handleChangeType = () => {
    navigation.navigate('TypeSelector');
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.xl, paddingBottom: tabBarHeight + Spacing.xl },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.avatarSection}>
        <View style={[styles.avatarContainer, Shadows.neonGlow]}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <ThemedText type="h3" style={styles.appName}>MindType</ThemedText>
      </View>

      {hasCompletedTest && userMBTI && personality ? (
        <Card elevation={1} style={styles.typeCard}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Your Personality Type
          </ThemedText>
          <View style={styles.typeRow}>
            <TypeBadge type={userMBTI} size="medium" selected />
            <View style={styles.typeInfo}>
              <ThemedText type="h4">{personality.roleName}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {personality.functionStack.dominant} - {personality.functionStack.auxiliary} - {personality.functionStack.tertiary} - {personality.functionStack.inferior}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
            {personality.description}
          </ThemedText>
        </Card>
      ) : (
        <Card elevation={1} style={styles.emptyCard}>
          <Feather name="help-circle" size={48} color={theme.textSecondary} />
          <ThemedText type="h4" style={styles.emptyTitle}>No Type Set</ThemedText>
          <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
            Take the cognitive function test to discover your MBTI type
          </ThemedText>
        </Card>
      )}

      <View style={styles.actionsSection}>
        <Button onPress={handleRetakeTest} variant="outline" testID="button-retake">
          {hasCompletedTest ? 'Retake Test' : 'Take Test'}
        </Button>
        {hasCompletedTest ? (
          <Button onPress={handleChangeType} variant="ghost" testID="button-change-type">
            Change Type Manually
          </Button>
        ) : null}
      </View>

      <View style={styles.infoSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>About This App</ThemedText>
        <Card elevation={1} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="cpu" size={20} color={theme.neonRed} />
            <View style={styles.infoContent}>
              <ThemedText type="body">Cognitive Function Analysis</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Uses 8 cognitive functions for accurate typing
              </ThemedText>
            </View>
          </View>
        </Card>
        <Card elevation={1} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="users" size={20} color={theme.neonRed} />
            <View style={styles.infoContent}>
              <ThemedText type="body">AI Personality Agents</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Chat with 16 unique personality types
              </ThemedText>
            </View>
          </View>
        </Card>
        <Card elevation={1} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="heart" size={20} color={theme.neonRed} />
            <View style={styles.infoContent}>
              <ThemedText type="body">Mental Wellness</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Learn about cognitive loops and how to break them
              </ThemedText>
            </View>
          </View>
        </Card>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing["2xl"],
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  appName: {
    marginTop: Spacing.sm,
  },
  typeCard: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  typeInfo: {
    flex: 1,
  },
  description: {
    lineHeight: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
  },
  actionsSection: {
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  infoCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  infoContent: {
    flex: 1,
  },
});
