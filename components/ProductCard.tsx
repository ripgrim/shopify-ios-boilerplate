import { ShopifyProduct } from '@/types/shopify';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  product: ShopifyProduct;
  onPress?: (product: ShopifyProduct) => void;
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const firstImage = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  
  const priceText = minPrice.amount === maxPrice.amount 
    ? `${minPrice.currencyCode} ${minPrice.amount}`
    : `${minPrice.currencyCode} ${minPrice.amount} - ${maxPrice.amount}`;

  return (
    <TouchableOpacity 
      className="bg-card rounded-xl mx-2 my-1.5 border border-border"
      style={style}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View className="rounded-xl overflow-hidden">
        {firstImage ? (
          <Image
            source={{ uri: firstImage.url }}
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
          />
        ) : (
          <View style={{ width: '100%', height: 200 }} className="bg-muted/30 justify-center items-center">
            <Text className="text-muted-foreground text-sm">No Image</Text>
          </View>
        )}
      </View>
      
      <View className="p-3">
        <Text className="text-base font-semibold text-card-foreground mb-1" numberOfLines={2}>
          {product.title}
        </Text>
        
        <Text className="text-sm text-muted-foreground mb-2" numberOfLines={1}>
          {product.vendor}
        </Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-primary">{priceText}</Text>
          {!product.availableForSale && (
            <Text className="text-xs text-destructive font-semibold">Sold Out</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard; 