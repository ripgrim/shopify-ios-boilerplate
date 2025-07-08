import CollectionGrid from '@/components/CollectionGrid';
import { Text } from '@/components/ui/text';
import { useCollections } from '@/hooks/useShopifyData';
import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CollectionsScreen = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useCollections(20);
  
  const collections = data?.pages.flatMap(page => page.edges.map(edge => edge.node)) || [];
  
  const handleCollectionPress = (collection: ShopifyCollection) => {
    console.log('Collection pressed:', collection.handle);
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading && collections.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Collections</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-muted-foreground font-medium">Loading collections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Collections</Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-destructive text-center font-medium mb-4">
            Error loading collections: {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="px-6 py-6 pb-2">
        <Text className="text-2xl font-bold text-foreground mb-6">
          Collections
        </Text>
      </View>
      
      <CollectionGrid
        collections={collections}
        onCollectionPress={handleCollectionPress}
        onEndReached={handleLoadMore}
        loading={isLoading}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

export default CollectionsScreen; 