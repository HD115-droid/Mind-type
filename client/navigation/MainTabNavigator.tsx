import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import TestStackNavigator from '@/navigation/TestStackNavigator';
import AgentsStackNavigator from '@/navigation/AgentsStackNavigator';
import WellnessStackNavigator from '@/navigation/WellnessStackNavigator';
import ProfileStackNavigator from '@/navigation/ProfileStackNavigator';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius } from '@/constants/theme';

export type MainTabParamList = {
  TestTab: undefined;
  AgentsTab: undefined;
  WellnessTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TestIcon({ color, size }: { color: string; size: number }) {
  return (
    <View style={{ paddingTop: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 20h9" />
        <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </Svg>
    </View>
  );
}

function AgentsIcon({ color, size }: { color: string; size: number }) {
  return (
    <View style={{ paddingTop: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Path d="M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Svg>
    </View>
  );
}

function WellnessIcon({ color, size }: { color: string; size: number }) {
  return (
    <View style={{ paddingTop: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </Svg>
    </View>
  );
}

function ProfileIcon({ color, size }: { color: string; size: number }) {
  return (
    <View style={{ paddingTop: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <Path d="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      </Svg>
    </View>
  );
}

export default function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="AgentsTab"
      screenOptions={{
        tabBarActiveTintColor: theme.neonRed,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 32 : 12,
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: theme.backgroundDefault,
            web: theme.backgroundDefault,
          }),
          borderTopWidth: 0.5,
          borderTopColor: theme.separator,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TestTab"
        component={TestStackNavigator}
        options={{
          title: 'Test',
          tabBarIcon: ({ color }) => <TestIcon color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="AgentsTab"
        component={AgentsStackNavigator}
        options={{
          title: 'Companions',
          tabBarIcon: ({ color }) => <AgentsIcon color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="WellnessTab"
        component={WellnessStackNavigator}
        options={{
          title: 'Wellness',
          tabBarIcon: ({ color }) => <WellnessIcon color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={22} />,
        }}
      />
    </Tab.Navigator>
  );
}
