import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { FlatList, View } from 'react-native';
import CollectionCard from './CollectionCard';
import CollectionCardSkeleton from './skeletons/collectionCardSkeleton';

interface CollectionGridProps {
  collections: ShopifyCollection[];
  onCollectionPress?: (collection: ShopifyCollection) => void;
  onEndReached?: () => void;
  loading?: boolean;
  style?: any;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
  onCollectionPress,
  onEndReached,
  loading,
  style,
}) => {
  // Show skeleton loading state
  if (loading && collections.length === 0) {
    const skeletonData = Array.from({ length: 6 }, (_, index) => ({ id: `skeleton-${index}` }));
    
    return (
      <FlatList
        data={skeletonData}
        renderItem={() => <CollectionCardSkeleton style={{ flex: 1, marginHorizontal: 4 }} />}
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

  return (
    <FlatList
      data={collections}
      renderItem={({ item }) => (
        <CollectionCard
          collection={item}
          onPress={onCollectionPress}
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

export default CollectionGrid; 