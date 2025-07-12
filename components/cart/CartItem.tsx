
import { useCart } from '@/components/cart/CartProvider';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { formatPrice, optimizeShopifyImage } from '@/lib/utils';
import { CartLine } from '@/types/cart';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

interface CartItemProps {
  item: CartLine;
  onQuantityChange?: (lineId: string, quantity: number) => void;
  onRemove?: (lineId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove 
}) => {
  const { updateCartLine, removeFromCart } = useCart();
  
  const iconColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'tabIconDefault');
  
  const translateX = useRef(new Animated.Value(0)).current;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartLine(item.id, newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    
    Animated.timing(translateX, {
      toValue: -400,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      try {
        await removeFromCart(item.id);
        onRemove?.(item.id);
      } catch (error) {
        console.error('Failed to remove cart item:', error);
        setIsRemoving(false);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === 5) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -100) {
        handleRemove();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const totalPrice = formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode);

  // Get the main variant option (usually size)
  const mainOption = item.merchandise.selectedOptions?.find(opt => 
    opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'variant'
  ) || item.merchandise.selectedOptions?.[0];

  return (
    <View className="relative overflow-hidden">
      <View className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 justify-center items-center">
        <Trash2 size={20} color="white" />
      </View>
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}
        enabled={!isRemoving}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
          }}
          className="bg-background px-4 py-4"
        >
          <View className="flex-row items-start">
            {/* Product Image */}
            {item.merchandise.image && (
              <View className="w-24 h-24 rounded-lg overflow-hidden mr-4">
                <Image 
                  source={{ uri: optimizeShopifyImage(item.merchandise.image.url, 100, 100) }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            )}
            
            {/* Product Info */}
            <View className="flex-1 mr-4">
              <Text className="font-medium text-card-foreground text-base leading-tight" numberOfLines={2}>
                {item.merchandise.product.title}
              </Text>
              
              {item.merchandise.title !== item.merchandise.product.title && (
                <Text className="text-muted-foreground text-sm mt-1" numberOfLines={1}>
                  {item.merchandise.title}
                </Text>
              )}
            </View>
            
            {/* Price */}
            <View className="items-end">
              <Text className="font-semibold text-card-foreground text-base">
                {totalPrice}
              </Text>
            </View>
          </View>
          
          {/* Controls Row */}
          <View className="flex-row items-center justify-between mt-4">
            {/* Quantity Selector */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded justify-center items-center"
                style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}
              >
                <Minus size={16} color={mutedColor} />
              </TouchableOpacity>
              
              <View className="mx-4 py-1 rounded-md min-w-[40px] items-center">
                <Text className="text-card-foreground font-medium text-sm">
                  {item.quantity}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.quantity + 1)}
                disabled={!item.merchandise.availableForSale}
                className="w-8 h-8 rounded justify-center items-center"
                style={{ opacity: !item.merchandise.availableForSale ? 0.3 : 1 }}
              >
                <Plus size={16} color={mutedColor} />
              </TouchableOpacity>
            </View>
            
            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleRemove}
              className="w-8 h-8 rounded justify-center items-center ml-4"
            >
              <Trash2 size={16} color={mutedColor} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default CartItem; 