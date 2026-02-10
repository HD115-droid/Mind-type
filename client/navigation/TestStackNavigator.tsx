import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from '@/screens/TestScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';

export type TestStackParamList = {
  Test: undefined;
};

const Stack = createNativeStackNavigator<TestStackParamList>();

export default function TestStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{
          headerTitle: 'MBTI Test',
        }}
      />
    </Stack.Navigator>
  );
}
