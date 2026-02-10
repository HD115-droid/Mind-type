import AsyncStorage from '@react-native-async-storage/async-storage';
import { MBTIType } from '@/data/mbtiTypes';

const SELECTED_BORDERS_KEY = 'mindtype_selected_borders';
const UNLOCKED_BORDERS_KEY = 'mindtype_unlocked_borders';
const WEEKLY_COMPLETIONS_KEY = 'mindtype_weekly_completions';
const STREAK_KEY = 'mindtype_streak';

export async function getSelectedBorder(agentType: MBTIType): Promise<string> {
  try {
    const data = await AsyncStorage.getItem(SELECTED_BORDERS_KEY);
    if (data) {
      const borders = JSON.parse(data);
      return borders[agentType] || 'default';
    }
    return 'default';
  } catch {
    return 'default';
  }
}

export async function setSelectedBorder(agentType: MBTIType, borderId: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(SELECTED_BORDERS_KEY);
    const borders = data ? JSON.parse(data) : {};
    borders[agentType] = borderId;
    await AsyncStorage.setItem(SELECTED_BORDERS_KEY, JSON.stringify(borders));
  } catch (error) {
    console.error('Error saving border:', error);
  }
}

export async function getAllSelectedBorders(): Promise<Record<string, string>> {
  try {
    const data = await AsyncStorage.getItem(SELECTED_BORDERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export async function getUnlockedBorders(agentType: MBTIType): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(UNLOCKED_BORDERS_KEY);
    if (data) {
      const unlocked = JSON.parse(data);
      return unlocked[agentType] || ['default'];
    }
    return ['default'];
  } catch {
    return ['default'];
  }
}

export async function addUnlockedBorder(agentType: MBTIType, borderId: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(UNLOCKED_BORDERS_KEY);
    const unlocked = data ? JSON.parse(data) : {};
    if (!unlocked[agentType]) {
      unlocked[agentType] = ['default'];
    }
    if (!unlocked[agentType].includes(borderId)) {
      unlocked[agentType].push(borderId);
    }
    await AsyncStorage.setItem(UNLOCKED_BORDERS_KEY, JSON.stringify(unlocked));
  } catch (error) {
    console.error('Error unlocking border:', error);
  }
}

export async function getAllUnlockedBorders(): Promise<Record<string, string[]>> {
  try {
    const data = await AsyncStorage.getItem(UNLOCKED_BORDERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export async function getWeeklyCompletions(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(WEEKLY_COMPLETIONS_KEY);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function incrementWeeklyCompletions(): Promise<number> {
  try {
    const current = await getWeeklyCompletions();
    const newCount = current + 1;
    await AsyncStorage.setItem(WEEKLY_COMPLETIONS_KEY, newCount.toString());
    return newCount;
  } catch {
    return 0;
  }
}

export async function getCurrentStreak(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    if (!data) return 0;
    const parsed = JSON.parse(data);
    const lastDate = new Date(parsed.lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    return parsed.count || 0;
  } catch {
    return 0;
  }
}

export async function updateStreak(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!data) {
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ count: 1, lastDate: today.toISOString() }));
      return 1;
    }
    
    const parsed = JSON.parse(data);
    const lastDate = new Date(parsed.lastDate);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return parsed.count;
    } else if (diffDays === 1) {
      const newCount = parsed.count + 1;
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ count: newCount, lastDate: today.toISOString() }));
      return newCount;
    } else {
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ count: 1, lastDate: today.toISOString() }));
      return 1;
    }
  } catch {
    return 0;
  }
}
