import { Button } from '@/components/ui/button';
import { useCustomerAddresses } from '@/hooks/useShopifyData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CustomerAccountAddress } from '@/types/customerAccount';
import { ArrowLeft, MapPin, Plus } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddressListProps {
  onAddressPress?: (address: CustomerAccountAddress) => void;
  onAddNew?: () => void;
  onBack?: () => void;
}

export default function AddressList({ onAddressPress, onAddNew, onBack }: AddressListProps) {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCustomerAddresses();

  const iconColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const mutedColor = useThemeColor({}, 'icon');

  const allAddresses = data?.pages.flatMap(page => page?.nodes || []) || [];

  const renderAddress = ({ item: address }: { item: CustomerAccountAddress }) => (
    <Button
      onPress={() => onAddressPress?.(address)}
      variant="outline"
      className="bg-card border border-border rounded-2xl p-4 mb-3 flex-col items-start"
    >
      <Text className="text-card-foreground font-semibold text-base mb-2">
        {address.firstName} {address.lastName}
      </Text>
      <Text className="text-muted-foreground text-sm">
        {address.address1}
        {address.address2 && `, ${address.address2}`}
      </Text>
      <Text className="text-muted-foreground text-sm">
        {address.city}, {address.province} {address.zip}
      </Text>
      <Text className="text-muted-foreground text-sm">
        {address.country}
      </Text>
      {address.phone && (
        <Text className="text-muted-foreground text-sm mt-1">
          {address.phone}
        </Text>
      )}
    </Button>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="mt-4 text-muted-foreground">Loading addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-destructive text-center mb-4">Failed to load addresses</Text>
          <Text className="text-muted-foreground text-center">{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          <Button onPress={onBack} variant="ghost" size="icon" className="p-2">
            <ArrowLeft size={24} color={iconColor} />
          </Button>
          <Text className="text-xl font-bold text-foreground">Addresses</Text>
          <Button onPress={onAddNew} variant="ghost" size="icon" className="p-2">
            <Plus size={24} color={primaryColor} />
          </Button>
        </View>
        
        <FlatList
          data={allAddresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="small" className="text-primary" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <MapPin size={48} color={mutedColor} className="mb-4" />
              <Text className="text-muted-foreground text-center mb-4">
                No addresses found
              </Text>
              <Button
                onPress={onAddNew}
                variant="default"
                className="px-6 py-3 rounded-xl"
              >
                <Text className="text-primary-foreground font-semibold">
                  Add Your First Address
                </Text>
              </Button>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
} 