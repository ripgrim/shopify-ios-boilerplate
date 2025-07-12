
import { OptimizedImage } from '@/components/helpers/OptimizedImage';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { CartLine } from '../../types/cart';
import { Text } from '../ui/text';
import { useCart } from './CartProvider';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      await updateCartLine(item.id, newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item.id);
      onRemove?.(item.id);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
  };

  const unitPrice = formatPrice(item.cost.amountPerQuantity.amount, item.cost.amountPerQuantity.currencyCode);
  const totalPrice = formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode);

  return (
    <View className="bg-card rounded-lg p-4 border border-border">
      <View className="flex-row">
        {/* Product Image */}
        {item.merchandise.image && (
          <View className="w-20 h-20 rounded-lg overflow-hidden mr-4">
            <OptimizedImage url={item.merchandise.image.url} width={100} height={100} />
          </View>
        )}
        
        {/* Product Info */}
        <View className="flex-1">
          <Text className="font-semibold text-card-foreground text-base" numberOfLines={2}>
            {item.merchandise.product.title}
          </Text>
          
          {item.merchandise.title !== item.merchandise.product.title && (
            <Text className="text-muted-foreground text-sm mt-1" numberOfLines={1}>
              {item.merchandise.title}
            </Text>
          )}
          
          {/* Selected Options */}
          {item.merchandise.selectedOptions && item.merchandise.selectedOptions.length > 0 && (
            <View className="mt-2">
              {item.merchandise.selectedOptions.map((option, index) => (
                <Text key={index} className="text-muted-foreground text-xs">
                  {option.name}: {option.value}
                </Text>
              ))}
            </View>
          )}
          
          {/* Pricing */}
          <View className="mt-2">
            <Text className="text-muted-foreground text-sm">
              {unitPrice} each
            </Text>
            <Text className="font-bold text-card-foreground text-lg">
              {totalPrice}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Quantity Controls & Remove Button */}
      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="w-10 h-10 rounded-full border border-border justify-center items-center"
            style={{ opacity: isUpdating || item.quantity <= 1 ? 0.5 : 1 }}
          >
            <Minus size={16} color={iconColor} />
          </TouchableOpacity>
          
          <View className="mx-4 min-w-[50px] items-center">
            {isUpdating ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              <Text className="text-card-foreground font-semibold text-lg">
                {item.quantity}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating || !item.merchandise.availableForSale}
            className="w-10 h-10 rounded-full border border-border justify-center items-center"
            style={{ opacity: isUpdating || !item.merchandise.availableForSale ? 0.5 : 1 }}
          >
            <Plus size={16} color={iconColor} />
          </TouchableOpacity>
        </View>
        
        {/* Remove Button */}
        <TouchableOpacity
          onPress={handleRemove}
          disabled={isRemoving}
          className="w-10 h-10 rounded-full justify-center items-center"
          style={{ opacity: isRemoving ? 0.5 : 1 }}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : (
            <Trash2 size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
      
      {/* Stock Status */}
      {!item.merchandise.availableForSale && (
        <View className="mt-2 p-2 bg-red-50 rounded-md">
          <Text className="text-red-600 text-sm text-center">
            Out of Stock
          </Text>
        </View>
      )}
      
      {/* Low Stock Warning */}
      {item.merchandise.availableForSale && 
       item.merchandise.quantityAvailable && 
       item.merchandise.quantityAvailable < 5 && 
       item.merchandise.quantityAvailable > 0 && (
        <View className="mt-2 p-2 bg-yellow-50 rounded-md">
          <Text className="text-yellow-600 text-sm text-center">
            Only {item.merchandise.quantityAvailable} left in stock
          </Text>
        </View>
      )}
    </View>
  );
};

export default CartItem; 