import { SanityProductCard } from '@/components/SanityProductCard';
import { ProductsModule, SanityProduct } from '@/types/sanity';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

interface ProductsModuleProps {
  module: ProductsModule;
}

export const ProductsModuleComponent: React.FC<ProductsModuleProps> = ({ module }) => {
  const router = useRouter();
  
  const validProducts = module.products?.filter(item => 
    item?.productWithVariant?.product !== null
  ).map(item => item.productWithVariant.product) || [];
  
  const handleProductPress = (product: SanityProduct) => {
    if (product.store.handle) {
      router.push(`/product/${product.store.handle}`);
    }
  };

  if (validProducts.length === 0) {
    return (
      <View className="px-4 py-6 bg-muted/10">
        <View className="bg-card rounded-xl p-4 items-center">
          <Text className="text-base text-muted-foreground text-center">
            No products available
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">
            Fix product references in Sanity Studio
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4 py-6 bg-muted/10">
      {module.title ? (
        <Text className="text-2xl font-bold text-foreground mb-4">
          {module.title}
        </Text>
      ) : null}
      
      <FlatList
        data={validProducts}
        renderItem={({ item }) => (
          <SanityProductCard
            product={item as SanityProduct}
            onPress={handleProductPress}
            style={{ flex: 1, marginHorizontal: 4 }}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 8,
        }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}; 