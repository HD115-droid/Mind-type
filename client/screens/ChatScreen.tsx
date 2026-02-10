import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { AgentAvatar } from '@/components/AgentAvatar';
import { MoodIndicator, MoodState } from '@/components/MoodIndicator';
import { useTheme } from '@/hooks/useTheme';
import { MBTIType, Gender, mbtiPersonalities, getAgentName } from '@/data/mbtiTypes';
import { Spacing, BorderRadius } from '@/constants/theme';
import { apiRequest, getApiUrl } from '@/lib/query-client';
import { getAllSelectedBorders } from '@/lib/borderStorage';
import { getBorderById } from '@/data/companionBorders';
import { LevelUpAnimation } from '@/components/LevelUpAnimation';

interface MoodData {
  value: number;
  state: MoodState;
  energy: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentType?: MBTIType;
  agentGender?: Gender;
  timestamp: number;
}

type ChatParams = {
  Chat: { agents: { type: MBTIType; gender: Gender }[] };
};

const DEVICE_ID_KEY = 'mindtype_device_id';

async function getDeviceId(): Promise<string> {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

const TypingIndicator = () => {
  const { theme } = useTheme();
  
  const Dot = ({ delay }: { delay: number }) => {
    const opacity = useSharedValue(0.3);
    
    useEffect(() => {
      opacity.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(1, { duration: 400 })),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        true
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View 
        style={[
          styles.typingDot, 
          { backgroundColor: theme.neonRed },
          animatedStyle
        ]} 
      />
    );
  };

  return (
    <View style={styles.typingContainer}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
};

const TrustIndicator = ({ level, trustLabel, xp, nextXp }: { level: number, trustLabel: string, xp: number, nextXp: number }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.floatingHeader}>
      <View style={styles.trustInfo}>
        <View style={styles.levelBadge}>
          <ThemedText type="small" style={styles.levelLabel}>LVL</ThemedText>
          <ThemedText type="h4" style={styles.levelNumber}>{level}</ThemedText>
        </View>
        <View style={styles.progressContainer}>
          <ThemedText type="small" style={styles.friendshipLabel}>
            {trustLabel}
          </ThemedText>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill,
                { 
                  backgroundColor: theme.neonRed,
                  width: `${Math.min(100, (xp / nextXp) * 100)}%` 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<RouteProp<ChatParams, 'Chat'>>();
  const flatListRef = useRef<FlatList>(null);

  const { agents } = route.params;
  const isGroupChat = agents.length > 1;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relationship, setRelationship] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodData>({ value: 0, state: 'neutral', energy: 50 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [selectedBorders, setSelectedBorders] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllSelectedBorders().then(setSelectedBorders);
    
    getDeviceId().then(id => {
      setDeviceId(id);
      if (!isGroupChat) {
        const agent = agents[0];
        fetch(new URL(`/api/relationship/${id}/${agent.type}`, getApiUrl()).toString())
          .then(res => res.json())
          .then(setRelationship)
          .catch(() => {});
        
        fetch(new URL(`/api/mood/${id}/${agent.type}`, getApiUrl()).toString())
          .then(res => res.json())
          .then(data => {
            if (data.state) setMood(data);
          })
          .catch(() => {});
      }
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading || !deviceId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        message: userMessage.content,
        deviceId,
        agents: agents.map(a => {
          const personality = mbtiPersonalities.find(p => p.type === a.type)!;
          return {
            type: a.type,
            gender: a.gender,
            name: getAgentName(personality, a.gender),
            role: personality.roleName,
            ambition: personality.ambition,
            desires: personality.desires,
            activities: personality.activities,
            backstory: personality.backstory,
          };
        }),
        isGroupChat,
      });

      const data = await response.json();

      if (isGroupChat && Array.isArray(data.responses)) {
        const newMessages: Message[] = data.responses.map((r: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          role: 'assistant' as const,
          content: r.content,
          agentType: r.type,
          agentGender: agents.find(a => a.type === r.type)?.gender || 'female',
          timestamp: Date.now() + index,
        }));
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      } else {
        const agent = agents[0];
        const assistantMessage: Message = {
          id: `${Date.now()}-response`,
          role: 'assistant',
          content: data.content,
          agentType: agent.type,
          agentGender: agent.gender,
          timestamp: Date.now(),
        };
        setMessages(prev => [assistantMessage, ...prev]);
        
        setRelationship({
          trustLevel: data.trustLevel,
          affectionXp: data.affectionXp,
          nextLevelXp: data.nextLevelXp,
          label: data.label,
          displayLevel: data.displayLevel
        });

        if (data.leveledUp) {
          setNewLevel(data.trustLevel);
          setShowLevelUp(true);
        }

        if (data.mood) {
          setMood(data.mood);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        agentType: agents[0].type,
        agentGender: agents[0].gender,
        timestamp: Date.now(),
      };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, agents, isGroupChat, deviceId]);

  const getRelationshipDisplay = () => {
    if (!relationship) return 'Stranger';
    if (relationship.trustLevel <= 5) return relationship.label;
    return `Soul Bond Lv.${relationship.trustLevel - 5}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const personality = item.agentType 
      ? mbtiPersonalities.find(p => p.type === item.agentType) 
      : null;

    return (
      <Animated.View 
        entering={isUser ? FadeIn.duration(300) : FadeInDown.duration(400).springify()}
        style={[styles.messageRow, isUser && styles.messageRowUser]}
      >
        {!isUser && personality ? (
          <AgentAvatar 
            type={item.agentType!} 
            gender={item.agentGender || 'female'} 
            size="small" 
            borderId={selectedBorders[item.agentType!] || 'default'}
          />
        ) : null}
        <View 
          style={[
            styles.messageBubble,
            isUser 
              ? [styles.userBubble, { backgroundColor: theme.backgroundSecondary }]
              : [styles.assistantBubble, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }],
          ]}
        >
          {!isUser && personality && isGroupChat ? (
            <ThemedText type="small" style={[styles.agentLabel, { color: theme.neonRed }]}>
              {getAgentName(personality, item.agentGender || 'female')} ({item.agentType})
            </ThemedText>
          ) : null}
          <ThemedText type="body" style={styles.messageText}>
            {item.content}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    const primaryAgent = agents[0];
    const personality = mbtiPersonalities.find(p => p.type === primaryAgent.type)!;
    const agentName = getAgentName(personality, primaryAgent.gender);
    
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.agentsPreview}>
          {agents.map((agent) => (
            <AgentAvatar 
              key={agent.type} 
              type={agent.type} 
              gender={agent.gender} 
              size="medium"
              showBorder
              borderId={selectedBorders[agent.type] || 'default'}
            />
          ))}
        </View>
        
          <ThemedText type="h4" style={styles.emptyTitle}>
          {`Chat with ${agentName}`}
        </ThemedText>
        
        <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
          {`${agentName} is a ${personality.roleName.toLowerCase()}. ${(relationship?.trustLevel || 1) === 1 ? "They don't know you yet, so they might be a bit reserved at first." : "They're warming up to you."}`}
        </ThemedText>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <LevelUpAnimation 
        visible={showLevelUp} 
        level={newLevel} 
        onComplete={() => setShowLevelUp(false)} 
      />
      {!isGroupChat && relationship && (
        <Animated.View entering={FadeIn} style={[styles.headerOverlay, { top: headerHeight }]}>
          <TrustIndicator 
            level={relationship.affectionLevel} 
            trustLabel={relationship.trustLabel}
            xp={relationship.affectionXp}
            nextXp={relationship.nextLevelXp}
          />
        </Animated.View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted={messages.length > 0}
        contentContainerStyle={[
          styles.messagesList,
          { paddingTop: headerHeight + (isGroupChat ? Spacing.lg : 100) },
          messages.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={isLoading ? (
          <View style={styles.loadingFooter}>
            <View style={styles.messageRow}>
              {agents[0] && (
                <AgentAvatar 
                  type={agents[0].type} 
                  gender={agents[0].gender} 
                  size="small" 
                  borderId={selectedBorders[agents[0].type] || 'default'}
                />
              )}
              <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
                <TypingIndicator />
              </View>
            </View>
          </View>
        ) : (
          !isGroupChat && relationship ? (
            <View style={styles.xpRow}>
              <View style={styles.xpBarBackground}>
                <View 
                  style={[
                    styles.xpProgress, 
                    { 
                      backgroundColor: theme.neonRed,
                      width: `${Math.min(100, (relationship.affectionXp / relationship.nextLevelXp) * 100)}%` 
                    }
                  ]} 
                />
              </View>
              <ThemedText type="small" style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 }}>
                {relationship.affectionXp} / {relationship.nextLevelXp} XP
              </ThemedText>
            </View>
          ) : null
        )}
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={[styles.inputRow, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={1000}
            editable={!isLoading}
            testID="input-message"
          />
          <Pressable 
            onPress={sendMessage} 
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              { 
                backgroundColor: inputText.trim() && !isLoading ? theme.neonRed : theme.disabled,
              },
            ]}
            testID="button-send"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  agentsPreview: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(15, 17, 23, 0.96)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(139, 92, 246, 0.7)',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  progressContainer: {
    flex: 1,
  },
  friendshipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  userBubble: {
    borderBottomRightRadius: BorderRadius.xs,
  },
  assistantBubble: {
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 0.5,
  },
  agentLabel: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  messageText: {
    lineHeight: 22,
  },
  loadingFooter: {
    paddingVertical: Spacing.md,
  },
  xpRow: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  xpBarBackground: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BorderRadius["2xl"],
    borderWidth: 0.5,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
