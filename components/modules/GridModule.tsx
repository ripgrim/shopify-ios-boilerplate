import { GridModule } from '@/types/sanity';
import React from 'react';
import { Text, View } from 'react-native';

interface GridModuleProps {
  module: GridModule;
}

export const GridModuleComponent: React.FC<GridModuleProps> = ({ module }) => {
  if (!module.items || module.items.length === 0) {
    return null;
  }

  return (
    <View className="p-6 bg-background">
      {module.title ? (
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {module.title}
        </Text>
      ) : null}

      <View className="flex-row flex-wrap justify-between">
        {module.items.map((item, index) => (
          <View 
            key={index} 
            className="w-full sm:w-1/2 md:w-1/3 p-2 mb-4"
          >
            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="text-gray-600">
                {typeof item === 'string' ? item : 'Grid item'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}; 