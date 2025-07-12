import { getDrawerWidth } from '@/lib/dimensions';
import { ShoppingCart, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { useCart } from './CartProvider';

interface CartDrawerProps {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { 
    isDrawerOpen, 
    closeDrawer, 
    lines, 
    totalQuantity, 
    totalAmount, 
    currencyCode,
    isLoading 
  } = useCart();

  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const drawerWidth = getDrawerWidth();

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 50) {
        closeDrawer();
      }
    });

  if (!isDrawerOpen) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {/* Overlay */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'timing', duration: 200 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={closeDrawer}
          activeOpacity={1}
        />
      </MotiView>

      {/* Drawer */}
      <GestureDetector gesture={panGesture}>
        <MotiView
          from={{ translateX: drawerWidth }}
          animate={{ translateX: 0 }}
          exit={{ translateX: drawerWidth }}
          transition={{ type: 'timing', duration: 250 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: drawerWidth,
            backgroundColor: backgroundColor,
            zIndex: 1001,
            elevation: 16,
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
              <View className="flex-row items-center">
                <ShoppingCart size={24} color={iconColor} />
                <Text className="text-xl font-bold text-foreground ml-3">
                  Cart ({totalQuantity})
                </Text>
              </View>
              <TouchableOpacity onPress={closeDrawer} className="p-2">
                <X size={24} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Cart Content */}
            <ScrollView 
              className="flex-1 px-4" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {isLoading ? (
                <View className="flex-1 justify-center items-center py-8">
                  <Text className="text-muted-foreground">Loading cart...</Text>
                </View>
              ) : lines.length === 0 ? (
                <EmptyCartView iconColor={iconColor} />
              ) : (
                <CartItemsList lines={lines} />
              )}
            </ScrollView>

            {/* Footer */}
            {lines.length > 0 && (
              <CartFooter 
                totalAmount={totalAmount} 
                currencyCode={currencyCode}
                isLoading={isLoading}
              />
            )}
          </SafeAreaView>
        </MotiView>
      </GestureDetector>
    </View>
  );
};

const EmptyCartView: React.FC<{ iconColor: string }> = ({ iconColor }) => (
  <View className="flex-1 justify-center items-center py-8">
    <ShoppingCart size={48} color={iconColor} style={{ opacity: 0.3 }} />
    <Text className="text-muted-foreground text-center mt-4">
      Your cart is empty
    </Text>
    <Text className="text-muted-foreground text-center text-sm mt-2">
      Add some items to get started
    </Text>
  </View>
);

const CartItemsList: React.FC<{ lines: any[] }> = ({ lines }) => (
  <View className="space-y-4">
    {lines.map((line) => (
      <View key={line.id} className="bg-card rounded-lg p-4 border border-border">
        <View className="flex-row">
          {line.merchandise.image && (
            <View className="w-16 h-16 rounded-lg overflow-hidden mr-3">
              <Image
                source={{ uri: line.merchandise.image.url }}
                style={{ width: 64, height: 64 }}
                resizeMode="cover"
              />
            </View>
          )}
          <View className="flex-1">
            <Text className="font-semibold text-card-foreground" numberOfLines={2}>
              {line.merchandise.product.title}
            </Text>
            <Text className="text-muted-foreground text-sm" numberOfLines={1}>
              {line.merchandise.title}
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-card-foreground">
                Qty: {line.quantity}
              </Text>
              <Text className="font-semibold text-card-foreground">
                {line.cost.totalAmount.currencyCode} {line.cost.totalAmount.amount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    ))}
  </View>
);

const CartFooter: React.FC<{ 
  totalAmount: string; 
  currencyCode: string; 
  isLoading: boolean;
}> = ({ totalAmount, currencyCode, isLoading }) => (
  <View className="border-t border-border px-4 py-4">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-semibold text-foreground">
        Total
      </Text>
      <Text className="text-xl font-bold text-foreground">
        {currencyCode} {totalAmount}
      </Text>
    </View>
    <Button
      onPress={() => console.log('Navigate to checkout')}
      className="w-full py-4 rounded-xl"
      disabled={isLoading}
    >
      <Text className="text-primary-foreground font-bold text-lg">
        Checkout
      </Text>
    </Button>
  </View>
);

export default CartDrawer; 