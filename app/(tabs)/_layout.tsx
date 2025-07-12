import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
  const { effectiveColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[effectiveColorScheme ?? 'light'].tint,

        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute',
        //   },
        //   default: {},
        // }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => ({
            sfSymbol: "house",
            symbolWeight: "thin"
          }),
        }}
      />
      <Tabs.Screen
        name="ProductsScreen"
        options={{
          title: 'Products',
          tabBarIcon: () => ({
            sfSymbol: "square.grid.2x2",
            symbolWeight: "medium"
          }),
        }}
      />
      <Tabs.Screen
        name="CollectionsScreen"
        options={{
          title: 'Collections',
          tabBarIcon: () => ({ sfSymbol: "rectangle.stack" }),
        }}
      />
      <Tabs.Screen
        name="AccountScreen"
        options={{
          title: 'Account',
          tabBarIcon: () => ({ sfSymbol: "person" }),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: 'Settings',
          tabBarIcon: () => ({ sfSymbol: "gearshape" }),
        }}
      />
      <Tabs.Screen
        name="TestScreen"
        options={{
          title: 'Test',
          tabBarIcon: () => ({ sfSymbol: "checkmark.circle" }),
        }}
      />
    </Tabs>
  );
}
