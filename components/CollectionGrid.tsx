import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { FlatList, View } from 'react-native';
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