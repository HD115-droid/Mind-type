import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { TypeBadge } from '@/components/TypeBadge';
import { useTheme } from '@/hooks/useTheme';
import { MBTIType, mbtiPersonalities } from '@/data/mbtiTypes';
import { loopData } from '@/data/loopInfo';
import { Spacing, BorderRadius } from '@/constants/theme';

type RouteParams = {
  LoopDetails: { type: MBTIType };
};

export default function LoopDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<RouteProp<RouteParams, 'LoopDetails'>>();

  const { type } = route.params;
  const loop = loopData[type];
  const personality = mbtiPersonalities.find(p => p.type === type);

  if (!loop || !personality) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Loop information not found</ThemedText>
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
      <View style={styles.header}>
        <TypeBadge type={type} size="large" selected />
        <ThemedText type="h4" style={styles.roleName}>{personality.roleName}</ThemedText>
      </View>

      <Card elevation={1} style={styles.loopCard}>
        <View style={styles.loopHeader}>
          <Feather name="repeat" size={24} color={theme.neonRed} />
          <ThemedText type="h4" style={{ color: theme.neonRed }}>{loop.loopName}</ThemedText>
        </View>
        <ThemedText type="small" style={[styles.loopFunctions, { color: theme.textSecondary }]}>
          {loop.loopFunctions}
        </ThemedText>
        <ThemedText type="body" style={[styles.loopDescription, { color: theme.textSecondary }]}>
          {loop.description}
        </ThemedText>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="alert-triangle" size={20} color={theme.error} />
          <ThemedText type="h4">Warning Signs</ThemedText>
        </View>
        {loop.warningSigns.map((sign, index) => (
          <View key={index} style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: theme.error }]} />
            <ThemedText type="body" style={styles.listText}>{sign}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="compass" size={20} color={theme.success} />
          <ThemedText type="h4">Breaking the Loop</ThemedText>
        </View>
        {loop.breakingStrategies.map((strategy, index) => (
          <View key={index} style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: theme.success }]} />
            <ThemedText type="body" style={styles.listText}>{strategy}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="activity" size={20} color={theme.neonRed} />
          <ThemedText type="h4">Practical Exercises</ThemedText>
        </View>
        {loop.exercises.map((exercise, index) => (
          <Card key={index} elevation={2} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={[styles.exerciseNumber, { backgroundColor: theme.neonRed }]}>
                <ThemedText type="small" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText type="body" style={styles.exerciseText}>{exercise}</ThemedText>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  roleName: {
    marginTop: Spacing.md,
  },
  loopCard: {
    marginBottom: Spacing.xl,
  },
  loopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  loopFunctions: {
    marginBottom: Spacing.md,
  },
  loopDescription: {
    lineHeight: 24,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingRight: Spacing.lg,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: Spacing.md,
  },
  listText: {
    flex: 1,
    lineHeight: 24,
  },
  exerciseCard: {
    marginBottom: Spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseText: {
    flex: 1,
    lineHeight: 24,
  },
});
