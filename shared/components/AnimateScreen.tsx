import React from 'react';
import Animated, {
  SlideInRight,
  SlideInLeft,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  direction?: 'right' | 'left';
};

export function AnimatedScreen({ children, direction = 'right' }: Props) {
  const entering = direction === 'right' ? SlideInRight : SlideInLeft;
  const exiting = direction === 'right' ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={entering.duration(500)}
      exiting={exiting.duration(500)}
    >
      {children}
    </Animated.View>
  );
}
