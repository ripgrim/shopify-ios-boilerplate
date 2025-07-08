import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

const MainImageSkeleton: React.FC = () => (
  <View className="mb-6">
    <View className="relative h-96 w-full">
      <Skeleton className="w-full h-full rounded-xl" />
    </View>
  </View>
);

export default MainImageSkeleton; 