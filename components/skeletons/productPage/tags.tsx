import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

const TagsSkeleton: React.FC = () => (
  <View className="mb-6">
    <Skeleton className="h-6 w-1/6 mb-3" />
    <View className="flex-row flex-wrap">
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} className="mr-2 mb-2">
          <Skeleton className="h-8 w-16 rounded-full" />
        </View>
      ))}
    </View>
  </View>
);

export default TagsSkeleton; 