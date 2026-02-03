import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

interface LoadingSkeletonProps {
  lines?: number;
}

export function LoadingSkeleton({ lines = 8 }: LoadingSkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className='px-4 pt-4 gap-3'>
      {Array.from({ length: lines }, (_, i) => (
        <Animated.View key={i} style={animatedStyle}>
          <View className='flex-row gap-3 items-start'>
            {/* Verse number placeholder */}
            <View className='w-5 h-3.5 bg-gray-200 rounded mt-1' />
            {/* Text line placeholder */}
            <View className='flex-1'>
              <View className={`h-3.5 bg-gray-200 rounded ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}
