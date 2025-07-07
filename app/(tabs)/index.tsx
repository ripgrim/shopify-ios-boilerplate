import { SanityModuleRenderer } from '@/components/SanityModuleRenderer';
import { useSanityHome } from '@/hooks/useSanityData';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { data: homeData, isLoading, error } = useSanityHome();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4 bg-background">
        <Text className="text-destructive text-center text-base">
          Error loading home data: {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  if (!homeData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4 bg-background">
        <Text className="text-muted-foreground text-center text-base">No home data found</Text>
      </SafeAreaView>
    );
  }

  // console.log("homedata", JSON.stringify(homeData, null, 2));
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          {homeData.modules?.map((module) => (
            <SanityModuleRenderer key={module._key} module={module} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 