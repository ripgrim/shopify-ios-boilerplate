import { Button } from '@/components/ui/button';
import { useCustomerOrders } from '@/hooks/useShopifyData';
import { Calendar, DollarSign, Package, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

interface CustomerOrdersProps {
  onOrderPress?: (orderId: string) => void;
}

export default function CustomerOrders({ onOrderPress }: CustomerOrdersProps) {
  const { data, isLoading, error } = useCustomerOrders();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground">Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Package size={48} className="text-muted-foreground mb-4" />
        <Text className="text-destructive text-center mb-2">Failed to load orders</Text>
        <Text className="text-muted-foreground text-center">{error.message}</Text>
      </View>
    );
  }

  const orders = data?.pages?.flatMap(page => page?.nodes || []) || [];

  const renderOrder = ({ item: order }: { item: any }) => {
    const orderDate = new Date(order.processedAt).toLocaleDateString();
    
    return (
      <Button
        onPress={() => onOrderPress?.(order.id)}
        variant="outline"
        className="bg-card border border-border rounded-2xl p-4 mb-4 flex-col items-start w-full"
      >
        <View className="flex-row items-center justify-between w-full mb-3">
          <View className="flex-row items-center">
            <ShoppingBag size={20} className="text-primary mr-3" />
            <Text className="text-card-foreground font-semibold text-lg">
              Order #{order.orderNumber}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={16} className="text-muted-foreground mr-2" />
            <Text className="text-muted-foreground text-sm">{orderDate}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between w-full mb-3">
          <View className="flex-row items-center">
            <DollarSign size={16} className="text-primary mr-2" />
            <Text className="text-card-foreground font-bold">
              {order.totalPrice.currencyCode} {order.totalPrice.amount}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Package size={16} className="text-muted-foreground mr-2" />
            <Text className="text-muted-foreground text-sm">
              {order.lineItems?.nodes?.length || 0} items
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between w-full">
          <Text className={`text-sm px-3 py-1 rounded-full ${
            order.fulfillmentStatus === 'FULFILLED' 
              ? 'bg-green-100 text-green-800' 
              : order.fulfillmentStatus === 'PARTIAL'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {order.fulfillmentStatus?.toLowerCase() || 'pending'}
          </Text>
          <Text className={`text-sm px-3 py-1 rounded-full ${
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
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-6">
        <View className="flex-row items-center mb-6">
          <ShoppingBag size={24} className="text-primary mr-3" />
          <Text className="text-2xl font-bold text-foreground">Your Orders</Text>
        </View>
        
        {orders.length > 0 ? (
                     <FlatList
             data={orders}
             renderItem={renderOrder}
             keyExtractor={(item) => item.id}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{ paddingBottom: 20 }}
           />
        ) : (
          <View className="flex-1 justify-center items-center py-12">
            <Package size={64} className="text-muted-foreground mb-4" />
            <Text className="text-foreground text-lg font-semibold mb-2">No orders yet</Text>
            <Text className="text-muted-foreground text-center">
              Your order history will appear here once you make your first purchase.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 