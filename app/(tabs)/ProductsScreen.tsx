import ProductGrid from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useShopifyData';
import { ShopifyProduct } from '@/types/shopify';
import { useRouter } from 'expo-router';
import React from 'react';

const ProductsScreen = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useProducts(20);
  const router = useRouter();
  
  const products = data?.pages.flatMap(page => page.edges.map(edge => edge.node)) || [];
  
  const handleProductPress = (product: ShopifyProduct) => {
    router.push(`/product/${product.handle}`);
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  console.log("products", JSON.stringify(products.slice(0, 2), null, 2));

  return (
      <ProductGrid
        products={products}
        loading={isLoading}
        onProductPress={handleProductPress}
        onEndReached={handleLoadMore}
      style={{ flex: 1, paddingHorizontal: 8 }}
    />
  );
};

export default ProductsScreen; 