import { AccordionModule } from '@/types/sanity';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AccordionModuleProps {
  module: AccordionModule;
}

export const AccordionModuleComponent: React.FC<AccordionModuleProps> = ({ module }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemKey: string) => {
    setOpenItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(key => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  // Use groups if available, fallback to items
  const accordionData = module.groups || module.items || [];

  if (!accordionData || accordionData.length === 0) {
    return null;
  }

  return (
    <View className="p-6 bg-background">
      {module.title ? (
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {module.title}
        </Text>
      ) : null}

      {accordionData.map((item) => (
        <View key={item._key} className="mb-4 border-b border-gray-200 pb-4">
          <TouchableOpacity
            onPress={() => toggleItem(item._key)}
            className="flex-row justify-between items-center py-2"
          >
            <Text className="text-lg font-semibold text-gray-900 flex-1">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-lg">
              {openItems.includes(item._key) ? '−' : '+'}
            </Text>
          </TouchableOpacity>
          
          {openItems.includes(item._key) && (
            <View className="pt-2">
              <Text className="text-gray-600">
                {Array.isArray(item.content) 
                  ? item.content
                      .map((block: any) => {
                        if (typeof block === 'string') return block;
                        if (block?.children) {
                          return block.children
                            .map((child: any) => child.text || '')
                            .join('');
                        }
                        return '';
                      })
                      .join(' ')
                  : item.content}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}; 