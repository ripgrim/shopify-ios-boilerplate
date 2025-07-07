import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwipeBackHandlerProps {
  children: React.ReactNode;
  enabled?: boolean;
  threshold?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SwipeBackHandler({ 
  children, 
  enabled = true, 
  threshold = SCREEN_WIDTH * 0.3 
}: SwipeBackHandlerProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([10, 999999]) // Only activate when swiping right
    .onStart(() => {
      // Slight scale effect for visual feedback
      scale.value = withSpring(0.98);
    })
    .onUpdate((event) => {
      // Only allow positive translation (right swipe)
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, SCREEN_WIDTH * 0.5);
      }
    })
    .onEnd((event) => {
      const shouldGoBack = 
        event.translationX > threshold && 
        event.velocityX > 100; // Minimum velocity

      if (shouldGoBack) {
        // Animate out and then navigate
        translateX.value = withSpring(SCREEN_WIDTH, {
          damping: 20,
          stiffness: 200,
        }, () => {
          runOnJS(goBack)();
        });
      } else {
        // Animate back to original position
        translateX.value = withSpring(0);
      }
      
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
} 