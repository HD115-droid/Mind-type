import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';
import { TypeBadge } from '@/components/TypeBadge';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { MBTIType, mbtiPersonalities } from '@/data/mbtiTypes';
import { loopData } from '@/data/loopInfo';
import { Spacing, BorderRadius } from '@/constants/theme';

type RootStackParamList = {
  LoopDetails: { type: MBTIType };
};

function AlertIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 8v4M12 16h.01" />
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </Svg>
  );
}

function ChevronRightIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

const ALL_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function WellnessScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { hasCompletedTest, userMBTI } = useApp();

  const handleTypePress = (type: MBTIType) => {
    navigation.navigate('LoopDetails', { type });
  };

  const renderIntro = () => (
    <View style={styles.introSection}>
      <Animated.View entering={FadeInUp.delay(100).springify()}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
          style={[styles.introCard, { borderColor: theme.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
            <AlertIcon size={28} color={theme.neonRed} />
          </View>
          <ThemedText type="h3" style={styles.introTitle}>
            Personality Stress Loops
          </ThemedText>
          <ThemedText type="body" style={[styles.introText, { color: theme.textSecondary }]}>
            When we get very stressed, we often ignore our balanced "wise" side and get stuck in a repetitive cycle of reacting poorly. This is called a "Loop." Understanding yours helps you spot the pattern and snap out of it.
          </ThemedText>
        </LinearGradient>
      </Animated.View>

      {hasCompletedTest && userMBTI ? (
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTypePress(userMBTI)}
            testID="button-your-loop"
          >
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.25)', 'rgba(139, 92, 246, 0.1)']}
              style={[styles.yourTypeCard, { borderColor: theme.neonRed }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.yourTypeHeader}>
                <View>
                  <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: 4 }}>
                    Your Loop Pattern
                  </ThemedText>
                  <ThemedText type="h4" style={{ color: theme.neonRed }}>
                    {loopData[userMBTI]?.loopName}
                  </ThemedText>
                </View>
                <View style={styles.typeAndArrow}>
                  <TypeBadge type={userMBTI} size="small" selected />
                  <ChevronRightIcon size={20} color={theme.neonRed} />
                </View>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {loopData[userMBTI]?.loopFunctions}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeIn.delay(300)}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          All Type Loops
        </ThemedText>
      </Animated.View>
    </View>
  );

  const renderType = ({ item, index }: { item: MBTIType; index: number }) => {
    const loop = loopData[item];
    const isUserType = item === userMBTI;

    return (
      <AnimatedTouchable
        entering={FadeInUp.delay(index * 40).springify()}
        activeOpacity={0.8}
        onPress={() => handleTypePress(item)}
        style={styles.typeItem}
        testID={`loop-${item}`}
      >
        <LinearGradient
          colors={isUserType 
            ? ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.08)']
            : [theme.backgroundDefault, theme.backgroundDefault]
          }
          style={[
            styles.typeCard, 
            { 
              borderColor: isUserType ? theme.neonRed : theme.border,
              borderWidth: isUserType ? 2 : 1,
            }
          ]}
        >
          <View style={styles.typeHeader}>
            <TypeBadge type={item} size="small" selected={isUserType} />
            {isUserType ? (
              <View style={[styles.yourBadge, { backgroundColor: theme.neonRed }]}>
                <ThemedText type="small" style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>YOU</ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText type="small" style={[styles.loopName, { color: theme.neonRed }]} numberOfLines={1}>
            {loop.loopName}
          </ThemedText>
          <ThemedText type="small" style={[styles.loopFunctions, { color: theme.textSecondary }]}>
            {loop.loopFunctions}
          </ThemedText>
        </LinearGradient>
      </AnimatedTouchable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.3 }}
      />
      <FlatList
        data={ALL_TYPES}
        renderItem={renderType}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        columnWrapperStyle={styles.row}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        ListHeaderComponent={renderIntro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  introSection: {
    marginBottom: Spacing.xl,
  },
  introCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  introTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  introText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  yourTypeCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
  },
  yourTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeAndArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  typeItem: {
    flex: 1,
    maxWidth: '48%',
  },
  typeCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  yourBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  loopName: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  loopFunctions: {
    textAlign: 'center',
    fontSize: 11,
  },
});
