import { Text } from '@/components/ui/text';
import { ShopifyCollection } from '@/types/shopify';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

interface CollectionCardProps {
  collection: ShopifyCollection;
  onPress?: (collection: ShopifyCollection) => void;
  style?: any;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress, style }) => {
  const image = collection.image;

  return (
    <TouchableOpacity 
      className="bg-card rounded-xl mx-2 my-1.5"
      style={style}
      onPress={() => onPress?.(collection)}
      activeOpacity={0.8}
    >
      <View className="rounded-xl overflow-hidden border border-border aspect-square">
        {image ? (
          <Image
            source={{ uri: image.url }}
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
          />
        ) : (
          <View style={{ width: '100%', height: 200 }} className="bg-muted/30 justify-center items-center">
            <Text className="text-muted-foreground text-sm">No Image</Text>
          </View>
        )}
      </View>
      
      <View className="p-3">
        <Text className="text-base font-semibold text-card-foreground mb-1" numberOfLines={2}>
          {collection.title}
        </Text>
        {collection.description && (
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {collection.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard; 