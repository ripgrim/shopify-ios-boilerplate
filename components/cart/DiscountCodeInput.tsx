import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCartStore } from '@/stores/cartStore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, View } from 'react-native';


export function DiscountCodeInput() {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { applyDiscountCode } = useCartStore();
  const iconColor = useThemeColor({}, 'text');

  const handleApply = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a discount code');
      return;
    }

    setIsApplying(true);
    try {
      await applyDiscountCode(code.trim());
      console.log('trying code', code);
      setCode('');
      Alert.alert('Success', 'Discount code applied successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply discount code';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <View className="space-y-3">
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Discount Code
      </Text>
      
      <View className="flex-row space-x-2">
        <View className="flex-1">
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter discount code"
            placeholderTextColor="#9CA3AF"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-gray-900 dark:text-gray-100"
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isApplying}
            onSubmitEditing={handleApply}
            returnKeyType="done"
          />
        </View>
        
        <Button
          onPress={handleApply}
          disabled={!code.trim() || isApplying}
          className="px-4 py-2 min-w-[80px] justify-center bg-primary"
        >
          {isApplying ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : (
            <Text className="text-sm font-medium text-foreground">
              Apply
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
} 