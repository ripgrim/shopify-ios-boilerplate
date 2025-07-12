import { formatPrice } from '@/lib/utils';
import { CreditCard, ExternalLink, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Button } from '../ui/button';
import { Divider } from '../ui/divider';
import { Text } from '../ui/text';
import { useCart } from './CartProvider';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { cart, totalAmount, currencyCode, closeDrawer } = useCart();
  const iconColor = useThemeColor({}, 'text');

  const handleCheckout = async () => {
    try {
      if (cart?.checkoutUrl) {
        // Close the drawer first
        closeDrawer();
        
        // Open Shopify checkout URL
        const supported = await Linking.canOpenURL(cart.checkoutUrl);
        if (supported) {
          await Linking.openURL(cart.checkoutUrl);
        } else {
          Alert.alert('Error', 'Unable to open checkout page');
        }
      } else {
        Alert.alert('Error', 'Checkout URL not available');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to open checkout page');
    }
    
    onCheckout?.();
  };

  const handleContinueShopping = () => {
    closeDrawer();
  };

  if (!cart || !cart.cost) {
    return null;
  }

    const subtotal = formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode);
  const total = formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode);
  const tax = cart.cost.totalTaxAmount ? formatPrice(cart.cost.totalTaxAmount.amount, cart.cost.totalTaxAmount.currencyCode) : null;
  const duty = cart.cost.totalDutyAmount ? formatPrice(cart.cost.totalDutyAmount.amount, cart.cost.totalDutyAmount.currencyCode) : null;
  const checkoutCharge = cart.cost.checkoutChargeAmount ? formatPrice(cart.cost.checkoutChargeAmount.amount, cart.cost.checkoutChargeAmount.currencyCode) : null;

  return (
    <View className="bg-card rounded-lg p-4 border border-border">
      {/* Summary Header */}
      <View className="flex-row items-center mb-4">
        <ShoppingCart size={20} color={iconColor} />
        <Text className="text-lg font-semibold text-card-foreground ml-2">
          Order Summary
        </Text>
      </View>

      {/* Price Breakdown */}
      <View className="space-y-2">
        {/* Subtotal */}
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground">Subtotal</Text>
          <Text className="text-card-foreground font-medium">{subtotal}</Text>
        </View>

        {/* Tax */}
        {tax && (
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Tax</Text>
            <Text className="text-card-foreground font-medium">{tax}</Text>
          </View>
        )}

        {/* Duty */}
        {duty && (
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Duty</Text>
            <Text className="text-card-foreground font-medium">{duty}</Text>
          </View>
        )}

        {/* Checkout Charge */}
        {checkoutCharge && (
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Processing Fee</Text>
            <Text className="text-card-foreground font-medium">{checkoutCharge}</Text>
          </View>
        )}
      </View>

      {/* Discount Codes */}
      {cart.discountCodes && cart.discountCodes.length > 0 && (
        <View className="mt-4">
          <Text className="text-sm font-medium text-card-foreground mb-2">
            Applied Discounts
          </Text>
          {cart.discountCodes.map((discount, index) => (
            <View key={index} className="flex-row items-center justify-between py-1">
              <Text className="text-muted-foreground text-sm">
                {discount.code}
              </Text>
              <Text className="text-green-600 text-sm font-medium">
                {discount.applicable ? 'Applied' : 'Not applicable'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Discount Allocations */}
      {cart.discountAllocations && cart.discountAllocations.length > 0 && (
        <View className="mt-2">
          {cart.discountAllocations.map((allocation, index) => (
            <View key={index} className="flex-row items-center justify-between py-1">
              <Text className="text-green-600 text-sm">
                {allocation.targetType === 'LINE_ITEM' ? 'Item Discount' : 'Shipping Discount'}
              </Text>
              <Text className="text-green-600 text-sm font-medium">
                -{formatPrice(allocation.discountedAmount.amount, allocation.discountedAmount.currencyCode)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Divider className="my-4" />

      {/* Total */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-card-foreground">Total</Text>
        <Text className="text-xl font-bold text-card-foreground">{total}</Text>
      </View>

      {/* Checkout Button */}
      <Button
        onPress={handleCheckout}
        className="w-full py-4 rounded-xl mb-3"
        disabled={!cart.checkoutUrl}
      >
        <View className="flex-row items-center justify-center">
          <CreditCard size={20} color="white" className="mr-2" />
          <Text className="text-primary-foreground font-bold text-lg ml-2">
            Secure Checkout
          </Text>
        </View>
      </Button>

      {/* Continue Shopping Button */}
      <Button
        onPress={handleContinueShopping}
        variant="outline"
        className="w-full py-3 rounded-xl"
      >
        <Text className="text-foreground font-medium">
          Continue Shopping
        </Text>
      </Button>

      {/* Powered by Shopify */}
      <View className="flex-row items-center justify-center mt-4 opacity-70">
        <Text className="text-muted-foreground text-xs">
          Powered by Shopify
        </Text>
        <ExternalLink size={12} color={iconColor} className="ml-1" />
      </View>

      {/* Security Info */}
      <View className="mt-3 p-3 bg-muted/20 rounded-lg">
        <Text className="text-muted-foreground text-xs text-center">
          Your payment information is processed securely. We do not store credit card details.
        </Text>
      </View>
    </View>
  );
};

export default CartSummary; 