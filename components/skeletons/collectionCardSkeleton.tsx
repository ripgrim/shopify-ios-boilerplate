import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

interface CollectionCardSkeletonProps {
  style?: any;
}

const CollectionCardSkeleton: React.FC<CollectionCardSkeletonProps> = ({ style }) => (
  <View className="bg-card rounded-xl mx-2 my-1.5" style={style}>
    <View className="rounded-xl overflow-hidden border border-border aspect-square">
      <Skeleton className="w-full h-[200px] rounded-xl" />
    </View>
    <View className="p-3">
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-full" />
    </View>
  </View>
);

export default CollectionCardSkeleton; 