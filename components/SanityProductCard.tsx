import { Text } from '@/components/ui/text';
import { formatPrice } from '@/lib/utils';
import { SanityProduct } from '@/types/sanity';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

interface SanityProductCardProps {
  product: SanityProduct;
  onPress?: (product: SanityProduct) => void;
  style?: any;
}

export const SanityProductCard: React.FC<SanityProductCardProps> = ({ product, onPress, style }) => {


  return (
    <TouchableOpacity 
      className="bg-card rounded-xl mx-2 my-1.5 shadow-sm border border-border"
      style={style}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View className="rounded-xl overflow-hidden">
        {product.store.previewImageUrl ? (
          <Image
            source={{ uri: product.store.previewImageUrl }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: '100%', height: 200 }} className="bg-muted/30 justify-center items-center">
            <Text className="text-muted-foreground text-sm">No Image</Text>
          </View>
        )}
      </View>
      
      <View className="p-3">
        <Text className="text-base font-semibold text-card-foreground mb-1" numberOfLines={2}>
          {product.store.title}
        </Text>
        
        <Text className="text-sm text-muted-foreground mb-2" numberOfLines={1}>
          {product.store.vendor || 'Unknown'}
        </Text>
        
        <View className="flex-row justify-between items-center">
          {product.store.price && (
            <Text className="text-base font-bold text-primary">{formatPrice(product.store.price.toString(), 'USD')}</Text>
          )}
          {product.store.availableForSale === false && (
            <Text className="text-xs text-destructive font-semibold">Sold Out</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}; 