import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import WelcomeScreen from '@/screens/WelcomeScreen';
import ResultsScreen from '@/screens/ResultsScreen';
import TypeSelectorScreen from '@/screens/TypeSelectorScreen';
import ChatScreen from '@/screens/ChatScreen';
import LoopDetailsScreen from '@/screens/LoopDetailsScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { useApp } from '@/context/AppContext';
import { MBTIType, Gender } from '@/data/mbtiTypes';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Results: { type: string };
  TypeSelector: undefined;
  Chat: { agents: { type: MBTIType; gender: Gender }[] };
  LoopDetails: { type: MBTIType };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { hasSeenWelcome } = useApp();

  return (
    <Stack.Navigator 
      screenOptions={screenOptions}
      initialRouteName={hasSeenWelcome ? 'Main' : 'Welcome'}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          headerTitle: 'Your Type',
        }}
      />
      <Stack.Screen
        name="TypeSelector"
        component={TypeSelectorScreen}
        options={{
          headerTitle: 'Select Type',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: 'Chat',
        }}
      />
      <Stack.Screen
        name="LoopDetails"
        component={LoopDetailsScreen}
        options={({ route }) => ({
          headerTitle: `${route.params.type} Loop`,
        })}
      />
    </Stack.Navigator>
  );
}
