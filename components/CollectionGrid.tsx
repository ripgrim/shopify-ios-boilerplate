import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { FlatList } from 'react-native';
import CollectionCard from './CollectionCard';

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
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 100 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CollectionGrid; 