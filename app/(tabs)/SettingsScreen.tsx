import { ThemeToggle } from '@/components/ThemeToggle';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="p-6">
        <Text className="text-2xl font-bold text-foreground mb-6">
          Settings
        </Text>
        <View className="bg-card rounded-lg p-4 border border-border">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-card-foreground">
                Dark Mode
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Toggle between light and dark themes
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen; 