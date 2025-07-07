import { InstagramModule } from '@/types/sanity';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

interface InstagramModuleProps {
  module: InstagramModule;
}

export const InstagramModuleComponent: React.FC<InstagramModuleProps> = ({ module }) => {
  const handleInstagramPress = () => {
    if (module.url) {
      Linking.openURL(module.url);
    }
  };

  if (!module.url) {
    return null;
  }

  return (
    <View className="p-6 bg-background">
      <TouchableOpacity
        onPress={handleInstagramPress}
        className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 px-6 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          View on Instagram
        </Text>
        <Text className="text-white text-center text-sm opacity-75 mt-1">
          {module.url}
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 