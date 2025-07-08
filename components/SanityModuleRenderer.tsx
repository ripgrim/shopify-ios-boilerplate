import { Text } from '@/components/ui/text';
import { AccordionModule, CalloutModule, GridModule, ImagesModule, ImageWithProductHotspotsModule, InstagramModule, ProductsModule, SanityModule } from '@/types/sanity';
import React from 'react';
import { View } from 'react-native';
import { AccordionModuleComponent } from './modules/AccordionModule';
import { CalloutModuleComponent } from './modules/CalloutModule';
import { GridModuleComponent } from './modules/GridModule';
import { ImagesModuleComponent } from './modules/ImagesModule';
import { ImageWithProductHotspotsModuleComponent } from './modules/ImageWithProductHotspotsModule';
import { InstagramModuleComponent } from './modules/InstagramModule';
import { ProductsModuleComponent } from './modules/ProductsModule';

interface SanityModuleRendererProps {
  module: SanityModule;
}

export const SanityModuleRenderer: React.FC<SanityModuleRendererProps> = ({ module }) => {
  switch (module._type) {
    case 'accordion':
      return <AccordionModuleComponent module={module as AccordionModule} />;
    case 'callout':
      return <CalloutModuleComponent module={module as CalloutModule} />;
    case 'grid':
      return <GridModuleComponent module={module as GridModule} />;
    case 'images':
      return <ImagesModuleComponent module={module as ImagesModule} />;
    case 'imageWithProductHotspots':
      return <ImageWithProductHotspotsModuleComponent module={module as ImageWithProductHotspotsModule} />;
    case 'instagram':
      return <InstagramModuleComponent module={module as InstagramModule} />;
    case 'products':
      return <ProductsModuleComponent module={module as ProductsModule} />;
    default:
      return (
        <View className="p-4 bg-gray-100 m-4 rounded-lg">
          <Text className="text-gray-600 text-center">
            Unknown module type: {module._type}
          </Text>
        </View>
      );
  }
}; 