import { AppliedDiscountsList } from '@/components/cart/AppliedDiscountsList';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/components/cart/CartProvider';
import { DiscountCodeInput } from '@/components/cart/DiscountCodeInput';
import { DiscountSavings } from '@/components/cart/DiscountSavings';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getDrawerWidth } from '@/lib/dimensions';
import { useShopifyCheckoutSheet } from '@shopify/checkout-sheet-kit';
import { ShoppingCart, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    isLoading,
    clearCart,
    discountSavings,
    appliedDiscountCodes,
    checkoutUrl
  } = useCart();

  const iconColor = useThemeColor({}, 'text');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const drawerWidth = getDrawerWidth();

  const shopifyCheckout = useShopifyCheckoutSheet();

  // Preload checkout when checkoutUrl is available
  useEffect(() => {
    if (checkoutUrl && lines.length > 0) {
      console.log('Preloading checkout for faster experience...');
      shopifyCheckout.preload(checkoutUrl);
    }
  }, [checkoutUrl, lines.length, shopifyCheckout]);

  // Handle checkout lifecycle events
  useEffect(() => {
    const completedListener = shopifyCheckout.addEventListener('completed', (event) => {
      console.log('Checkout completed:', event);
      Alert.alert('Success', 'Order placed successfully!');
      clearCart(); // Clear the cart after successful checkout
    });

    const errorListener = shopifyCheckout.addEventListener('error', (error) => {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Error', error.message || 'Something went wrong during checkout');
    });

    const closeListener = shopifyCheckout.addEventListener('close', () => {
      console.log('Checkout closed');
      // Optional: refresh cart in case of any updates
    });

    return () => {
      completedListener?.remove();
      errorListener?.remove();
      closeListener?.remove();
    };
  }, [shopifyCheckout, clearCart]);

  const handleCheckout = async () => {
    if (!checkoutUrl) {
      Alert.alert('Error', 'Checkout URL not available');
      return;
    }

    try {
      console.log('Presenting checkout:', checkoutUrl);
      shopifyCheckout.present(checkoutUrl);
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to open checkout. Please try again.');
    }
  };

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 50 || event.velocityX > 500) {
        runOnJS(closeDrawer)();
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
        animate={{ opacity: 0.4 }}
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
          transition={{ type: 'timing', duration: 300 }}
          className="bg-background"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: drawerWidth,
            zIndex: 1001,
          }}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/* Clean Header */}
            <View className="px-6 py-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-foreground">
                    Cart
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={closeDrawer} 
                  className="w-10 h-10 rounded-full bg-muted/50 justify-center items-center"
                >
                  <X size={20} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cart Content */}
            {isLoading ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-muted-foreground">Loading...</Text>
              </View>
            ) : lines.length === 0 ? (
              <EmptyCart onClose={closeDrawer} />
            ) : (
              <>
                {/* Items */}
                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 24, paddingTop: 0 }}
                >
                  <View className="space-y-4">
                    {lines.map((line) => (
                      <CartItem key={line.id} item={line} />
                    ))}
                  </View>

                  {/* Discount Code Input - Always Visible */}
                  <View className="mt-6 space-y-4">
                    <DiscountCodeInput />
                    
                    {/* Applied Discount Codes */}
                    {appliedDiscountCodes.length > 0 && (
                      <AppliedDiscountsList />
                    )}
                  </View>
                </ScrollView>

                {/* Clean Footer */}
                <View className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
                  <View className="px-6 py-6">
                    <View className="space-y-2 mb-6">
                      {/* Discount Savings */}
                      <DiscountSavings />
                      
                      {/* Total */}
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg text-muted-foreground">
                          Total
                        </Text>
                        <Text className="text-2xl font-bold text-foreground">
                          {currencyCode} {totalAmount}
                        </Text>
                      </View>
                    </View>
                    
                    <Button
                      onPress={handleCheckout}
                      className="w-full h-14 rounded-2xl bg-primary mb-3"
                      disabled={isLoading || !checkoutUrl}
                    >
                      <Text className="text-primary-foreground font-semibold text-lg">
                        Checkout
                      </Text>
                    </Button>
                    
                    <Button
                      onPress={async () => {
                        try {
                          await clearCart();
                        } catch (error) {
                          // TODO: Show user-friendly error toast/alert
                          Alert.alert('Error', 'Failed to clear cart. Please try again.');
                        }
                      }}
                      className="w-full h-12 rounded-2xl bg-muted/50"
                      disabled={isLoading}
                    >
                      <Text className="text-muted-foreground font-medium">
                        Clear Cart
                      </Text>
                    </Button>
                  </View>
                </View>
              </>
            )}
          </SafeAreaView>
        </MotiView>
      </GestureDetector>
    </View>
  );
};

const EmptyCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const iconColor = useThemeColor({}, 'text');
  
  return (
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-24 h-24 rounded-full bg-muted/30 justify-center items-center mb-6">
        <ShoppingCart size={32} color={iconColor} style={{ opacity: 0.5 }} />
      </View>
      
      <Text className="text-xl font-semibold text-foreground mb-2 text-center">
        Your cart is empty
      </Text>
      
      <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
        Looks like you haven&apos;t added anything to your cart yet
      </Text>
      
      <Button
        onPress={onClose}
        className="px-8 py-3 rounded-xl bg-primary"
      >
        <Text className="text-primary-foreground font-medium">
          Continue Shopping
        </Text>
      </Button>
    </View>
  );
};

export default CartDrawer; 