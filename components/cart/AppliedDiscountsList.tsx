import { Icons } from '@/components/ui/icons';
import { Text } from '@/components/ui/text';
import { useCartStore } from '@/stores/cartStore';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

interface AppliedDiscountsListProps {
  onRemove?: (code: string) => void;
}

export function AppliedDiscountsList({ onRemove }: AppliedDiscountsListProps) {
  const { appliedDiscountCodes, removeDiscountCode } = useCartStore();

  const handleRemove = async (code: string) => {
    Alert.alert(
      'Remove Discount Code',
      `Are you sure you want to remove the discount code "${code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDiscountCode(code);
              onRemove?.(code);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove discount code');
            }
          },
        },
      ]
    );
  };

  if (appliedDiscountCodes.length === 0) {
    return null;
  }

  return (
    <View className="space-y-2">
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Applied Discount Codes
      </Text>
      
      {appliedDiscountCodes.map((code) => (
        <View
          key={code}
          className="flex-row items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <View className="flex-row items-center space-x-2">
            <Icons.Check size={16} color="#22C55E" />
            <Text className="text-sm font-medium text-green-800 dark:text-green-200">
              {code}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => handleRemove(code)}
            className="p-1 rounded-full bg-green-100 dark:bg-green-800/50"
          >
            <Icons.X size={14} color="#22C55E" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
} 