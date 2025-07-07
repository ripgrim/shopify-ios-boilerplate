import { Button } from '@/components/ui/button';
import { useCustomerOrders } from '@/hooks/useShopifyData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CustomerAccountOrder } from '@/types/customerAccount';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OrdersListProps {
  onOrderPress?: (order: CustomerAccountOrder) => void;
  onBack?: () => void;
}

export default function OrdersList({ onOrderPress, onBack }: OrdersListProps) {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCustomerOrders();

  const iconColor = useThemeColor({}, 'text');

  const allOrders = data?.pages.flatMap(page => page?.nodes || []) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: { amount: string; currencyCode: string }) => {
    return `${price.currencyCode} ${price.amount}`;
  };

  const renderOrder = ({ item: order }: { item: CustomerAccountOrder }) => (
    <Button
      onPress={() => onOrderPress?.(order)}
      variant="outline"
      className="bg-card border border-border rounded-2xl p-4 mb-3 flex-col items-start"
    >
      <View className="flex-row justify-between items-start mb-2 w-full">
        <Text className="text-card-foreground font-semibold text-base">
          {order.name}
        </Text>
        <Text className="text-muted-foreground text-sm">
          #{order.orderNumber}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center mb-2 w-full">
        <Text className="text-card-foreground">
          {formatPrice(order.totalPrice)}
        </Text>
        <Text className="text-muted-foreground text-sm">
          {formatDate(order.processedAt)}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center w-full">
        <Text className={`text-sm px-2 py-1 rounded ${
          order.fulfillmentStatus === 'FULFILLED' 
            ? 'bg-green-100 text-green-800' 
            : order.fulfillmentStatus === 'PARTIAL'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {order.fulfillmentStatus?.toLowerCase() || 'pending'}
        </Text>
        <Text className={`text-sm px-2 py-1 rounded ${
          order.financialStatus === 'PAID'
            ? 'bg-green-100 text-green-800'
            : order.financialStatus === 'PENDING'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {order.financialStatus?.toLowerCase() || 'pending'}
        </Text>
      </View>
    </Button>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="mt-4 text-muted-foreground">Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-destructive text-center mb-4">Failed to load orders</Text>
          <Text className="text-muted-foreground text-center">{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          {onBack && (
            <Button onPress={onBack} variant="ghost" size="icon" className="p-2">
              <ArrowLeft size={24} color={iconColor} />
            </Button>
          )}
          <Text className="text-2xl font-bold text-foreground">Order History</Text>
          <View className="w-10" />
        </View>
        
        <FlatList
          data={allOrders}
          renderItem={renderOrder}
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
              <Text className="text-muted-foreground text-center">
                No orders found
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
} 