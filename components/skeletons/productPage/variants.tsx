import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

const VariantsSkeleton: React.FC = () => (
  <View className="mb-4">
    <Skeleton className="h-6 w-1/4 mb-2" />
    <View className="flex-row flex-wrap gap-2">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton 
          key={index}
          className="h-12 w-20 rounded-lg" 
        />
      ))}
    </View>
  </View>
);

export default VariantsSkeleton; 