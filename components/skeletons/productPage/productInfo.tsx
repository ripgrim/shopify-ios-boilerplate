import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

const ProductInfoSkeleton: React.FC = () => (
  <View className="mb-6">
    <Skeleton className="h-8 w-4/5 mb-2" />
    <Skeleton className="h-6 w-1/2 mb-4" />
    <Skeleton className="h-8 w-1/3 mb-4" />
    <View className="flex-row items-center mb-4">
      <Skeleton className="h-4 w-4 rounded mr-2" />
      <Skeleton className="h-4 w-1/2" />
    </View>
  </View>
);

export default ProductInfoSkeleton; 