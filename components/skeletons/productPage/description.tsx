import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

const DescriptionSkeleton: React.FC = () => (
  <View className="mb-6">
    <Skeleton className="h-6 w-1/3 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-4/5" />
  </View>
);

export default DescriptionSkeleton; 