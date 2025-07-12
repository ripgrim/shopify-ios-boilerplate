import { Text } from '@/components/ui/text';
import { useCartStore } from '@/stores/cartStore';
import React from 'react';
import { View } from 'react-native';

interface DiscountSavingsProps {
  showLabel?: boolean;
}

export function DiscountSavings({ showLabel = true }: DiscountSavingsProps) {
  const { discountSavings, currencyCode } = useCartStore();

  if (parseFloat(discountSavings) === 0) {
    return null;
  }

  return (
    <View className="flex-row justify-between items-center">
      {showLabel && (
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Discount Savings
        </Text>
      )}
      <Text className="text-sm font-medium text-green-600 dark:text-green-400">
        -{currencyCode} {discountSavings}
      </Text>
    </View>
  );
} 