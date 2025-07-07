import { sanityImageUrl } from '@/lib/sanityImage';
import { ImageWithProductHotspotsModule } from '@/types/sanity';
import React from 'react';
import { Image, View } from 'react-native';

interface ImageWithProductHotspotsModuleProps {
  module: ImageWithProductHotspotsModule;
}

export const ImageWithProductHotspotsModuleComponent: React.FC<ImageWithProductHotspotsModuleProps> = ({ module }) => {
  if (!module.image) {
    return null;
  }

  return (
    <View className="p-6 bg-background">
      <View className="relative">
        <Image
          source={{ uri: sanityImageUrl(module.image).width(400).height(300).url() }}
          className="w-full h-64 rounded-lg"
          resizeMode="cover"
        />
        
        {module.hotspots && module.hotspots.length > 0 && (
          <View className="absolute inset-0">
            {module.hotspots.map((hotspot, index) => (
              <View
                key={index}
                className="absolute w-6 h-6 bg-blue-600 rounded-full border-2 border-white"
                style={{
                  left: `${(hotspot.x || 0) * 100}%`,
                  top: `${(hotspot.y || 0) * 100}%`,
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}; 