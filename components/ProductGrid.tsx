import { ShopifyProduct } from '@/types/shopify';
import React from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeletons/productCardSkeleton';

interface SkeletonItem {
  id: string;
  isSkeleton: true;
}

type DisplayItem = ShopifyProduct | SkeletonItem;

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
  // Initial loading state with no products
  if (loading && products.length === 0) {
    const skeletonData: SkeletonItem[] = Array.from({ length: 6 }, (_, index) => ({ 
      id: `skeleton-${index}`, 
      isSkeleton: true 
    }));
    
    return (
      <FlatList
        data={skeletonData}
        renderItem={() => <ProductCardSkeleton style={{ flex: 1, marginHorizontal: 4 }} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 16,
          paddingBottom: 120
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        scrollEnabled={false}
      />
    );
  }

  // Prepare data with skeleton items when loading more
  const displayData: DisplayItem[] = [...products];
  if (loading && products.length > 0) {
    const loadingSkeletons: SkeletonItem[] = Array.from({ length: 4 }, (_, index) => ({
      id: `loading-skeleton-${index}`,
      isSkeleton: true
    }));
    displayData.push(...loadingSkeletons);
  }

  return (
    <FlatList
      data={displayData}
      renderItem={({ item }) => {
        if ('isSkeleton' in item && item.isSkeleton) {
          return <ProductCardSkeleton style={{ flex: 1, marginHorizontal: 4 }} />;
        }
        return (
          <ProductCard
            product={item as ShopifyProduct}
            onPress={onProductPress}
            style={{ flex: 1, marginHorizontal: 4 }}
          />
        );
      }}
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