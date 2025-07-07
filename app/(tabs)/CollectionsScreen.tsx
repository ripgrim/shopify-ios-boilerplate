import CollectionGrid from '@/components/CollectionGrid';
import { useCollections } from '@/hooks/useShopifyData';
import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
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

  console.log("collections", JSON.stringify(collections.slice(0, 2), null, 2));

  return (
    <SafeAreaView className="flex-1 bg-background">
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