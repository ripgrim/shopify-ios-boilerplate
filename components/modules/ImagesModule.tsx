import { ImagesModule } from '@/types/sanity';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

interface ImagesModuleProps {
  module: ImagesModule;
}

export const ImagesModuleComponent: React.FC<ImagesModuleProps> = ({ module }) => {
  // Get images from either images array or imageFeatures array
  const directImages = module.images || [];
  const featureImages = module.imageFeatures?.map(feature => feature.image).filter(Boolean) || [];
  const allImages = [...directImages, ...featureImages];

  if (allImages.length === 0) {
    return (
      <View className="p-6 bg-background">
        <View className="bg-muted rounded-lg p-8 items-center">
          <Text className="text-muted-foreground text-center">
            No images available
          </Text>
          {module.caption ? (
            <Text className="text-muted-foreground text-center text-sm mt-2">
              {module.caption}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="p-6 bg-background">
      {allImages.length === 1 ? (
        <Image
          source={{ uri: allImages[0].asset?.url }}
          style={{
            width: '100%',
            height: 256,
            borderRadius: 8,
            marginBottom: module.caption ? 16 : 0
          }}
          resizeMode="cover"
        />
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: module.caption ? 16 : 0 }}
        >
          {allImages.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.asset?.url }}
              style={{
                width: 288,
                height: 192,
                borderRadius: 8,
                marginRight: index < allImages.length - 1 ? 16 : 0
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
      
      {module.caption ? (
        <Text className="text-muted-foreground text-center text-base">
          {module.caption}
        </Text>
      ) : null}
    </View>
  );
}; 