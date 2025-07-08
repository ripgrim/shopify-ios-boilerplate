import { ShopifyProduct } from '@/types/shopify';
import React from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ShopifyProduct[];
  onProductPress?: (product: ShopifyProduct) => void;
  onEndReached?: () => void;
  loading?: boolean;
  style?: any;
  }

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onEndReached,
  loading,
  style,
}) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={onProductPress}
          style={{ flex: 1, marginHorizontal: 4 }}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 120
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
};

export default ProductGrid; 