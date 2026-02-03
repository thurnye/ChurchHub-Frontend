import React from 'react';
import { Text, Pressable } from 'react-native';

interface AppPressableProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export function AppPressable({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
  disabled,
}: AppPressableProps) {
  const pad =
    size === 'sm' ? 'px-3 py-2' : size === 'lg' ? 'px-4 py-4' : 'px-4 py-3';
  const base = 'rounded-xl items-center justify-center flex-row gap-2';
  const bg =
    variant === 'primary'
      ? 'bg-indigo-600'
      : variant === 'outline'
        ? 'bg-white border border-gray-300'
        : 'bg-transparent';
  const text = variant === 'primary' ? 'text-white' : 'text-gray-900';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${base} ${pad} ${bg} ${disabled ? 'opacity-50' : ''}`}
    >
      {leftIcon}
      <Text
        className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'} ${text}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
