import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MBTIType, Gender } from '@/data/mbtiTypes';

interface AgentPreference {
  type: MBTIType;
  gender: Gender;
}

interface AppState {
  userMBTI: MBTIType | null;
  hasCompletedTest: boolean;
  agentPreferences: Record<MBTIType, Gender>;
  hasSeenWelcome: boolean;
}

interface AppContextType extends AppState {
  setUserMBTI: (type: MBTIType | null) => void;
  setHasCompletedTest: (completed: boolean) => void;
  setAgentGender: (type: MBTIType, gender: Gender) => void;
  getAgentGender: (type: MBTIType) => Gender;
  setHasSeenWelcome: (seen: boolean) => void;
  resetTest: () => void;
}

const defaultAgentPreferences: Record<MBTIType, Gender> = {
  INTJ: 'female', INTP: 'male', ENTJ: 'male', ENTP: 'female',
  INFJ: 'female', INFP: 'female', ENFJ: 'male', ENFP: 'female',
  ISTJ: 'male', ISFJ: 'female', ESTJ: 'male', ESFJ: 'female',
  ISTP: 'male', ISFP: 'female', ESTP: 'male', ESFP: 'female',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_MBTI: '@mbti_user_type',
  HAS_COMPLETED_TEST: '@mbti_has_completed_test',
  AGENT_PREFERENCES: '@mbti_agent_preferences',
  HAS_SEEN_WELCOME: '@mbti_has_seen_welcome',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userMBTI, setUserMBTIState] = useState<MBTIType | null>(null);
  const [hasCompletedTest, setHasCompletedTestState] = useState(false);
  const [agentPreferences, setAgentPreferencesState] = useState<Record<MBTIType, Gender>>(defaultAgentPreferences);
  const [hasSeenWelcome, setHasSeenWelcomeState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedMBTI, storedCompleted, storedPreferences, storedWelcome] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_MBTI),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_TEST),
        AsyncStorage.getItem(STORAGE_KEYS.AGENT_PREFERENCES),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_WELCOME),
      ]);

      if (storedMBTI) setUserMBTIState(storedMBTI as MBTIType);
      if (storedCompleted) setHasCompletedTestState(storedCompleted === 'true');
      if (storedPreferences) setAgentPreferencesState(JSON.parse(storedPreferences));
      if (storedWelcome) setHasSeenWelcomeState(storedWelcome === 'true');
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setUserMBTI = async (type: MBTIType | null) => {
    setUserMBTIState(type);
    try {
      if (type) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_MBTI, type);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_MBTI);
      }
    } catch (error) {
      console.error('Error saving user MBTI:', error);
    }
  };

  const setHasCompletedTest = async (completed: boolean) => {
    setHasCompletedTestState(completed);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_TEST, String(completed));
    } catch (error) {
      console.error('Error saving test completion:', error);
    }
  };

  const setAgentGender = async (type: MBTIType, gender: Gender) => {
    const newPreferences = { ...agentPreferences, [type]: gender };
    setAgentPreferencesState(newPreferences);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AGENT_PREFERENCES, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving agent preference:', error);
    }
  };

  const getAgentGender = (type: MBTIType): Gender => {
    return agentPreferences[type] || 'female';
  };

  const setHasSeenWelcome = async (seen: boolean) => {
    setHasSeenWelcomeState(seen);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_WELCOME, String(seen));
    } catch (error) {
      console.error('Error saving welcome state:', error);
    }
  };

  const resetTest = async () => {
    setUserMBTIState(null);
    setHasCompletedTestState(false);
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER_MBTI, STORAGE_KEYS.HAS_COMPLETED_TEST]);
    } catch (error) {
      console.error('Error resetting test:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        userMBTI,
        hasCompletedTest,
        agentPreferences,
        hasSeenWelcome,
        setUserMBTI,
        setHasCompletedTest,
        setAgentGender,
        getAgentGender,
        setHasSeenWelcome,
        resetTest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
