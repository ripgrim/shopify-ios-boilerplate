import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CollectionCardProps {
  collection: ShopifyCollection;
  onPress?: (collection: ShopifyCollection) => void;
  style?: any;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress, style }) => {
  const image = collection.image;

  return (
    <TouchableOpacity
      className="rounded-xl my-2 shadow-sm"
      style={style}
      onPress={() => onPress?.(collection)}
      activeOpacity={0.8}
    >
      <View style={{ height: 200 }} className="rounded-xl overflow-hidden relative">
        {image ? (
          <Image
            source={{ uri: image.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: '100%', height: '100%' }} className="bg-muted/30 justify-center items-center">
            <Text className="text-muted-foreground text-sm">No Image</Text>
          </View>
        )}
        <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
          <Text className="text-lg font-bold text-white mb-1" numberOfLines={2}>
            {collection.title}
          </Text>
          {collection.description ? (
            <Text className="text-sm text-gray-200 leading-5" numberOfLines={3}>
              {collection.description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard; 