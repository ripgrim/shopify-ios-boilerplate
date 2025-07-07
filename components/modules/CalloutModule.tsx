import { CalloutModule } from '@/types/sanity';
import React from 'react';
import { Text, View } from 'react-native';

interface CalloutModuleProps {
  module: CalloutModule;
}

export const CalloutModuleComponent: React.FC<CalloutModuleProps> = ({ module }) => {
  if (!module.text) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (module.tone) {
      case 'critical':
        return 'bg-red-100 border-red-300';
      case 'positive':
        return 'bg-green-100 border-green-300';
      case 'caution':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-blue-100 border-blue-300';
    }
  };

  const getTextColor = () => {
    switch (module.tone) {
      case 'critical':
        return 'text-red-800';
      case 'positive':
        return 'text-green-800';
      case 'caution':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  const renderText = () => {
    if (Array.isArray(module.text)) {
      return module.text
        .map(block => {
          if (typeof block === 'string') return block;
          if (block?.children) {
            return block.children
              .map((child: any) => child.text || '')
              .join('');
          }
          return '';
        })
        .join(' ');
    }
    return module.text;
  };

  return (
    <View className={`p-6 m-4 rounded-lg border-2 ${getBackgroundColor()}`}>
      <Text className={`text-center ${getTextColor()}`}>
        {renderText()}
      </Text>
    </View>
  );
}; 