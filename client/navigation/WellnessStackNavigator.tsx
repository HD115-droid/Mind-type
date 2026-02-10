import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WellnessScreen from '@/screens/WellnessScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';

export type WellnessStackParamList = {
  Wellness: undefined;
};

const Stack = createNativeStackNavigator<WellnessStackParamList>();

export default function WellnessStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Wellness"
        component={WellnessScreen}
        options={{
          headerTitle: 'Cognitive Wellness',
        }}
      />
    </Stack.Navigator>
  );
}
