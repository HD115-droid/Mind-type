import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgentsScreen from '@/screens/AgentsScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';

export type AgentsStackParamList = {
  Agents: undefined;
};

const Stack = createNativeStackNavigator<AgentsStackParamList>();

export default function AgentsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Agents"
        component={AgentsScreen}
        options={{
          headerTitle: 'Companions',
        }}
      />
    </Stack.Navigator>
  );
}
