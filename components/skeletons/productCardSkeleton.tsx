import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { View } from 'react-native';

interface ProductCardSkeletonProps {
    style?: any;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ style }) => (
    <View className="bg-card rounded-xl mx-2 my-1.5" style={{ flex: 1, marginHorizontal: 4 }}>
        <View className="rounded-xl overflow-hidden aspect-square">
            <Skeleton className="w-full h-[200px] rounded-xl" />
        </View>
        <View className="p-3">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <View className="flex-row justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
            </View>
        </View>
    </View>
);

export default ProductCardSkeleton; 