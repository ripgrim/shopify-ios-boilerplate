import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const StoreStatusDebug: React.FC = () => {
  const {
    isAccessible,
    isLoading,
    error,
    hasPasswordProtection,
    canAccessProducts,
    storeInfo,
    retestStore,
  } = useStoreStatus();

  const errorColor = useThemeColor({}, 'destructive');
  const successColor = useThemeColor({}, 'primary');

  return (
    <View className="p-4 border border-border rounded-lg bg-card">
      <Text className="text-lg font-semibold mb-3">Store Status</Text>
      
      {isLoading && (
        <View className="flex-row items-center mb-3">
          <ActivityIndicator size="small" className="mr-2" />
          <Text className="text-muted-foreground">Testing store access...</Text>
        </View>
      )}

      <View className="space-y-2 mb-4">
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground">Accessible:</Text>
          <Text style={{ color: isAccessible ? successColor : errorColor }}>
            {isAccessible ? '✓ Yes' : '✗ No'}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-muted-foreground">Can Access Products:</Text>
          <Text style={{ color: canAccessProducts ? successColor : errorColor }}>
            {canAccessProducts ? '✓ Yes' : '✗ No'}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-muted-foreground">Password Protected:</Text>
          <Text style={{ color: hasPasswordProtection ? errorColor : successColor }}>
            {hasPasswordProtection ? '✗ Yes' : '✓ No'}
          </Text>
        </View>
      </View>

      {storeInfo && (
        <View className="mb-4">
          <Text className="font-medium mb-2">Store Info:</Text>
          <View className="space-y-1">
            {storeInfo.name && (
              <Text className="text-sm text-muted-foreground">
                Name: {storeInfo.name}
              </Text>
            )}
            {storeInfo.url && (
              <Text className="text-sm text-muted-foreground">
                URL: {storeInfo.url}
              </Text>
            )}
          </View>
        </View>
      )}

      {error && (
        <View className="mb-4 p-3 bg-destructive/10 rounded border border-destructive/20">
          <Text className="text-sm" style={{ color: errorColor }}>
            Error: {error}
          </Text>
        </View>
      )}

      <Button
        onPress={retestStore}
        disabled={isLoading}
        className="bg-primary"
      >
        <Text className="text-primary-foreground">
          {isLoading ? 'Testing...' : 'Retest Store'}
        </Text>
      </Button>
    </View>
  );
}; 