import { Hero } from '@/types/sanity';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

interface HeroProps {
  hero: Hero;
}

export const HeroComponent: React.FC<HeroProps> = ({ hero }) => {
  const handleCtaPress = () => {
    if (hero.cta?.url) {
      Linking.openURL(hero.cta.url);
    }
  };

  return (
    <View className="p-6 bg-background">
      
      {hero.title ? (
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {hero.title}
        </Text>
      ) : null}

      {hero.description ? (
        <Text className="text-gray-600 mb-4">
          {hero.description}
        </Text>
      ) : null}

      {hero.cta && hero.cta.title && hero.cta.url ? (
        <TouchableOpacity 
          onPress={handleCtaPress}
          className="bg-blue-600 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            {hero.cta.title}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}; 