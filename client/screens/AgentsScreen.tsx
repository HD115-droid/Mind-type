import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AgentAvatar } from '@/components/AgentAvatar';
import { GenderSelector } from '@/components/GenderSelector';
import { Button } from '@/components/Button';
import { WeeklyChallenge } from '@/components/WeeklyChallenge';
import { BorderSelector } from '@/components/BorderSelector';
import { BorderUnlockAnimation } from '@/components/BorderUnlockAnimation';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { MBTIType, Gender, mbtiPersonalities, getAgentName, categoryLabels } from '@/data/mbtiTypes';
import { companionBorders, getUnlockedBorders as getUnlockedBordersFromProgress, CompanionBorder, checkForNewUnlock } from '@/data/companionBorders';
import { getSelectedBorder, setSelectedBorder, getUnlockedBorders as getStoredUnlockedBorders, addUnlockedBorder, getAllSelectedBorders, getWeeklyCompletions, getCurrentStreak } from '@/lib/borderStorage';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getApiUrl } from '@/lib/query-client';

type RootStackParamList = {
  Chat: { agents: { type: MBTIType; gender: Gender }[] };
};

const DEVICE_ID_KEY = 'mindtype_device_id';

async function getDeviceId(): Promise<string> {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  return deviceId || 'default';
}

function UsersIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Path d="M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

function CloseIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
}

function AlertIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Path d="M12 9v4" />
      <Path d="M12 17h.01" />
    </Svg>
  );
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AgentsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const { getAgentGender, setAgentGender, hasCompletedTest, userMBTI } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<MBTIType | null>(null);
  const [relationships, setRelationships] = useState<Record<string, { trustLevel: number; affectionXp: number; nextLevelXp: number; label: string; displayLevel: number | null; lastInteractionAt: string }>>({});
  const [selectedBorders, setSelectedBorders] = useState<Record<string, string>>({});
  const [unlockedBorders, setUnlockedBorders] = useState<Record<string, string[]>>({});
  const [weeklyCompletions, setWeeklyCompletions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [borderUnlock, setBorderUnlock] = useState<CompanionBorder | null>(null);

  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId().then(setDeviceId);
    loadBorderData();
  }, []);

  const [challengeKey, setChallengeKey] = useState(0);

  useEffect(() => {
    if (isFocused && hasCompletedTest) {
      loadRelationships();
      loadBorderData();
      setChallengeKey(prev => prev + 1);
    }
  }, [isFocused, hasCompletedTest, deviceId]);

  const loadBorderData = async () => {
    const borders = await getAllSelectedBorders();
    setSelectedBorders(borders);
    const weekly = await getWeeklyCompletions();
    setWeeklyCompletions(weekly);
    const streak = await getCurrentStreak();
    setCurrentStreak(streak);
  };

  const loadRelationships = async () => {
    const deviceId = await getDeviceId();
    const rels: Record<string, any> = {};
    const newUnlocked: Record<string, string[]> = {};
    
    await Promise.all(mbtiPersonalities.map(async (p) => {
      try {
        const response = await fetch(new URL(`/api/relationship/${deviceId}/${p.type}`, getApiUrl()).toString());
        const data = await response.json();
        rels[p.type] = data;
        
        const trustLevel = data.trustLevel || 1;
        const unlockableBorders = getUnlockedBordersFromProgress(trustLevel, weeklyCompletions, currentStreak);
        const storedUnlocked = await getStoredUnlockedBorders(p.type);
        
        for (const border of unlockableBorders) {
          if (!storedUnlocked.includes(border.id)) {
            await addUnlockedBorder(p.type, border.id);
          }
        }
        
        newUnlocked[p.type] = unlockableBorders.map(b => b.id);
      } catch (e) {}
    }));
    
    setRelationships(rels);
    setUnlockedBorders(newUnlocked);
  };

  const handleBorderChange = async (agentType: MBTIType, borderId: string) => {
    await setSelectedBorder(agentType, borderId);
    setSelectedBorders(prev => ({ ...prev, [agentType]: borderId }));
  };

  const getRelationshipDisplay = (type: string) => {
    const rel = relationships[type];
    if (!rel) return 'Stranger';
    if (rel.trustLevel <= 5) return rel.label;
    return `Soul Bond Lv.${rel.trustLevel - 5}`;
  };

  const getDecayWarning = (type: string) => {
    const rel = relationships[type];
    if (!rel || !rel.lastInteractionAt || rel.trustLevel <= 1) return null;
    
    const lastInteraction = new Date(rel.lastInteractionAt);
    const now = new Date();
    const diffHours = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);
    
    if (diffHours >= 24) {
      return `Haven't talked in 24h – friendship will cool down soon`;
    }
    return null;
  };

  const filteredPersonalities = selectedFilter
    ? mbtiPersonalities.filter(p => p.categories.includes(selectedFilter))
    : mbtiPersonalities;

  const categories = Object.keys(categoryLabels);

  const shadowTypes: Record<MBTIType, MBTIType> = {
    INTJ: 'ESFP', INTP: 'ESFJ', ENTJ: 'ISFP', ENTP: 'ISFJ',
    INFJ: 'ESTP', INFP: 'ESTJ', ENFJ: 'ISTP', ENFP: 'ISTJ',
    ISTJ: 'ENFP', ISFJ: 'ENTP', ESTJ: 'INFP', ESFJ: 'INTP',
    ISTP: 'ENFJ', ISFP: 'ENTJ', ESTP: 'INFJ', ESFP: 'INTJ',
  };

  const shadowType = userMBTI ? shadowTypes[userMBTI] : null;
  const shadowPersonality = shadowType ? mbtiPersonalities.find(p => p.type === shadowType) : null;

  const handleAgentPress = (type: MBTIType) => {
    setSelectedAgent(type);
  };

  const handleStartChat = (type: MBTIType) => {
    const gender = getAgentGender(type);
    navigation.navigate('Chat', { agents: [{ type, gender }] });
    setSelectedAgent(null);
  };

  const handleGenderChange = (type: MBTIType, gender: Gender) => {
    setAgentGender(type, gender);
  };

  if (!hasCompletedTest) {
    return (
      <ThemedView style={[styles.emptyContainer, { paddingTop: headerHeight + Spacing["4xl"] }]}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />
        <Animated.View entering={FadeInUp.springify()} style={styles.emptyIcon}>
          <UsersIcon size={64} color={theme.textSecondary} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(200)}>
          <ThemedText type="h3" style={styles.emptyTitle}>Complete Your Test First</ThemedText>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(400)}>
          <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
            Take the personality test to unlock AI companions who can offer unique perspectives based on their personality type.
          </ThemedText>
        </Animated.View>
      </ThemedView>
    );
  }

  const getCompanionLevel = (type: string): number => {
    const rel = relationships[type];
    return rel?.trustLevel || 1;
  };

  const renderAgent = ({ item, index }: { item: typeof mbtiPersonalities[0]; index: number }) => {
    const gender = getAgentGender(item.type);
    const name = getAgentName(item, gender);
    const isUserType = item.type === userMBTI;
    const decayWarning = getDecayWarning(item.type);
    const level = getCompanionLevel(item.type);

    return (
      <AnimatedTouchable
        entering={FadeInUp.delay(index * 50).springify()}
        activeOpacity={0.8}
        onPress={() => handleAgentPress(item.type)}
        style={styles.agentItem}
        testID={`agent-${item.type}`}
      >
        <LinearGradient
          colors={isUserType 
            ? ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)']
            : [theme.backgroundDefault, theme.backgroundDefault]
          }
          style={[
            styles.agentCard,
            {
              borderColor: isUserType ? theme.neonRed : theme.border,
              borderWidth: isUserType ? 2 : 1,
            },
          ]}
        >
          <View style={styles.levelBadgeContainer}>
            <View style={[styles.levelBadge, { backgroundColor: level > 1 ? theme.neonRed : 'rgba(255, 255, 255, 0.15)' }]}>
              <ThemedText type="small" style={[styles.levelBadgeText, { color: level > 1 ? '#FFFFFF' : theme.textSecondary }]}>
                LV {level}
              </ThemedText>
            </View>
          </View>
          <AgentAvatar type={item.type} gender={gender} size="medium" borderId={selectedBorders[item.type] || 'default'} />
          <ThemedText type="body" style={styles.agentName}>{name}</ThemedText>
          <ThemedText type="small" style={[styles.agentRole, { color: theme.neonRed }]}>
            {item.roleName}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 4, fontSize: 10 }}>
            {getRelationshipDisplay(item.type)}
          </ThemedText>
          <View style={[styles.typeBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <ThemedText type="small" style={[styles.agentType, { color: theme.neonRed }]}>
              {item.type}
            </ThemedText>
          </View>
          {decayWarning ? (
            <View style={styles.decayWarning}>
              <AlertIcon size={12} color="#FF4444" />
              <ThemedText type="small" style={styles.decayText}>Cooling down</ThemedText>
            </View>
          ) : null}
          {isUserType ? (
            <View style={[styles.yourTypeBadge, { backgroundColor: theme.neonRed }]}>
              <ThemedText type="small" style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                YOUR TYPE
              </ThemedText>
            </View>
          ) : null}
        </LinearGradient>
      </AnimatedTouchable>
    );
  };

  const selectedPersonality = selectedAgent 
    ? mbtiPersonalities.find(p => p.type === selectedAgent) 
    : null;

  const selectedDecayWarning = selectedAgent ? getDecayWarning(selectedAgent) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.3 }}
      />
      <FlatList
        data={filteredPersonalities}
        renderItem={renderAgent}
        keyExtractor={(item) => item.type}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing["2xl"] },
        ]}
        columnWrapperStyle={styles.row}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.View entering={FadeIn} style={styles.headerRow}>
              <ThemedText type="h3">Companions</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(100)} style={styles.friendshipHint}>
              <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: 'center' }}>
                Friendships cool down after 24 hours without chatting – you'll drop by 1 level
              </ThemedText>
            </Animated.View>

            {deviceId && (
              <WeeklyChallenge 
                key={`challenge-${challengeKey}`}
                deviceId={deviceId} 
                onRewardClaimed={loadRelationships} 
              />
            )}

            {shadowPersonality && (
              <Animated.View entering={FadeInUp.delay(200)} style={styles.shadowContainer}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
                  style={[styles.shadowCard, { borderColor: theme.neonRed, borderWidth: 1 }]}
                >
                  <ThemedText type="h4" style={{ color: theme.neonRed, marginBottom: Spacing.xs }}>
                    Your Shadow Type: {shadowType}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.md }}>
                    Your shadow type represents the opposite cognitive functions – the less developed side of your personality. Talking to it can promote growth and self-awareness.
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => handleAgentPress(shadowType as MBTIType)}
                    style={[styles.shadowCTA, { backgroundColor: theme.neonRed }]}
                  >
                    <ThemedText style={styles.shadowCTAText}>
                      Explore your hidden side →
                    </ThemedText>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            >
              {categories.map((item, index) => (
                <Animated.View key={item} entering={FadeIn.delay(index * 50)}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSelectedFilter(selectedFilter === item ? null : item)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selectedFilter === item ? theme.neonRed : 'rgba(255, 255, 255, 0.05)',
                        borderColor: selectedFilter === item ? theme.neonRed : theme.border,
                      },
                    ]}
                    testID={`filter-${item}`}
                  >
                    <ThemedText 
                      type="small" 
                      style={{ 
                        color: selectedFilter === item ? '#FFFFFF' : theme.textSecondary,
                        fontWeight: selectedFilter === item ? '600' : '400',
                      }}
                    >
                      {categoryLabels[item]}
                    </ThemedText>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </View>
        }
      />

      <Modal
        visible={!!selectedAgent}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedAgent(null)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeInDown.springify()}
            style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}
          >
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'transparent']}
              style={styles.modalGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.5 }}
            />
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setSelectedAgent(null)}
                style={styles.closeButton}
              >
                <CloseIcon size={24} color={theme.text} />
              </TouchableOpacity>
              <ThemedText type="h4">Companion Details</ThemedText>
              <View style={{ width: 40 }} />
            </View>

            {selectedPersonality ? (
              <View style={{ flex: 1 }}>
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalAgentHeader}>
                    <AgentAvatar 
                      type={selectedPersonality.type} 
                      gender={getAgentGender(selectedPersonality.type)} 
                      size="large" 
                      selected 
                      borderId={selectedBorders[selectedPersonality.type] || 'default'}
                    />
                    <ThemedText type="h2" style={styles.modalAgentName}>
                      {getAgentName(selectedPersonality, getAgentGender(selectedPersonality.type))}
                    </ThemedText>
                    <ThemedText type="body" style={{ color: theme.neonRed, fontWeight: '600' }}>
                      {selectedPersonality.roleName}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
                      {getRelationshipDisplay(selectedPersonality.type)}
                    </ThemedText>
                    <View style={[styles.modalTypeBadge, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                      <ThemedText type="body" style={{ color: theme.neonRed, fontWeight: '700' }}>
                        {selectedPersonality.type}
                      </ThemedText>
                    </View>
                  </View>

                  {selectedDecayWarning && (
                    <View style={styles.modalDecayWarning}>
                      <AlertIcon size={16} color="#FF4444" />
                      <ThemedText type="small" style={{ color: '#FF4444', textAlign: 'center', marginLeft: Spacing.sm }}>
                        {selectedDecayWarning}
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.genderSection}>
                    <ThemedText type="small" style={[styles.genderLabel, { color: theme.textSecondary }]}>
                      Choose Voice
                    </ThemedText>
                    <GenderSelector
                      value={getAgentGender(selectedPersonality.type)}
                      onChange={(gender) => handleGenderChange(selectedPersonality.type, gender)}
                    />
                  </View>

                  <BorderSelector
                    selectedBorderId={selectedBorders[selectedPersonality.type] || 'default'}
                    unlockedBorderIds={unlockedBorders[selectedPersonality.type] || ['default']}
                    onSelectBorder={(borderId) => handleBorderChange(selectedPersonality.type, borderId)}
                  />

                  <View style={[styles.descriptionCard, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                    <ThemedText type="body" style={[styles.modalDescription, { color: theme.textSecondary }]}>
                      {selectedPersonality.description}
                    </ThemedText>
                  </View>
                  
                  <View style={{ height: 100 }} />
                </ScrollView>
                
                <View style={[styles.modalFooter, { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: theme.backgroundDefault }]}>
                  <Button onPress={() => handleStartChat(selectedPersonality.type)} testID="button-start-chat" size="large">
                    Start Conversation
                  </Button>
                </View>
              </View>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
      
      <BorderUnlockAnimation
        visible={borderUnlock !== null}
        border={borderUnlock}
        onComplete={() => setBorderUnlock(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  friendshipHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  shadowContainer: {
    marginBottom: Spacing.lg,
  },
  shadowCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  shadowCTA: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  shadowCTAText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  groupButton: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  filterList: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  agentItem: {
    flex: 1,
    maxWidth: '48%',
  },
  agentCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  agentName: {
    marginTop: Spacing.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  agentRole: {
    fontWeight: '500',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  typeBadge: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  agentType: {
    fontWeight: '700',
    fontSize: 12,
  },
  decayWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  decayText: {
    color: '#FF4444',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalDecayWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  yourTypeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalBody: {
    padding: Spacing.xl,
  },
  modalFooter: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalAgentHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalAgentName: {
    marginTop: Spacing.lg,
  },
  modalTypeBadge: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  genderSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  genderLabel: {
    marginBottom: Spacing.md,
  },
  descriptionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 26,
  },
  modalButtons: {
    paddingBottom: Spacing["2xl"],
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 1,
  },
  levelBadge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
