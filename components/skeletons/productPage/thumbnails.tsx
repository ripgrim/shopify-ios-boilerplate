import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { ScrollView, View } from 'react-native';

const ThumbnailsSkeleton: React.FC = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="mt-4 w-full"
    scrollEnabled={false}
  >
    {Array.from({ length: 4 }, (_, index) => (
      <View 
        key={index}
        className="mr-2 w-24 h-24 aspect-square rounded-lg border-2 border-border"
      >
        <Skeleton className="w-full h-full rounded-lg" />
      </View>
    ))}
  </ScrollView>
);

export default ThumbnailsSkeleton; 