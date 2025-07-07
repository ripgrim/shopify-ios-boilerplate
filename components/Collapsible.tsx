import { Button } from '@/components/ui/button';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';


interface Props {
  children: React.ReactNode;
  title: string;
}

export function Collapsible({ children, title }: Props) {
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const open = useSharedValue(false);
  const progress = useDerivedValue(() =>
    open.value ? withSpring(1) : withSpring(0)
  );

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  return (
    <View>
      <Button
        onPress={() => {
          if (heightValue.value === 0) {
            runOnUI(() => {
              'worklet';
              heightValue.value = withSpring(measure(listRef)!.height);
            })();
          } else {
            heightValue.value = withSpring(0);
          }
          open.value = !open.value;
        }}
        variant="ghost"
        className="p-4 bg-background border-b border-border"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground font-semibold">{title}</Text>
          <Animated.View
            style={[
              { transform: [{ rotate: `${progress.value * 90}deg` }] },
            ]}
          >
            <Text className="text-foreground">→</Text>
          </Animated.View>
        </View>
      </Button>
      <Animated.View style={heightAnimationStyle}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { top: 0 }]}
          ref={listRef}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
}


