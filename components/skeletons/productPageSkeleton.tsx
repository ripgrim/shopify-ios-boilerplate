import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DescriptionSkeleton from './productPage/description';
import MainImageSkeleton from './productPage/mainImage';
import ProductInfoSkeleton from './productPage/productInfo';
import TagsSkeleton from './productPage/tags';
import ThumbnailsSkeleton from './productPage/thumbnails';
import VariantsSkeleton from './productPage/variants';

interface ProductPageSkeletonProps {
  onBack?: () => void;
}

const ProductPageSkeleton: React.FC<ProductPageSkeletonProps> = ({ onBack }) => {
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="px-6 py-4 bg-background">
        <View className="flex-row items-center justify-between">
          <Button onPress={onBack} variant="ghost" size="icon">
            <ArrowLeft size={18} color={iconColor} />
          </Button>
          <View className="w-10" />
        </View>
      </View>
      <ScrollView className="flex-1" scrollEnabled={false}>
        <View className="px-6 py-4">
          <MainImageSkeleton />
          <ThumbnailsSkeleton />
          <ProductInfoSkeleton />
          <VariantsSkeleton />
          <DescriptionSkeleton />
          <TagsSkeleton />
        </View>
      </ScrollView>
      <View className="px-6 py-4 bg-background border-t border-border">
        <Skeleton className="h-14 w-full rounded-xl" />
      </View>
    </SafeAreaView>
  );
};

export default ProductPageSkeleton; 