import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Menu } from 'lucide-react-native';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';
import { ChurchMenu } from './ChurchMenu';
import { router } from 'expo-router';

interface ChurchTopBarProps {
  churchName: string;
  showLogo?: boolean;
  className?: string;
  onNavigate: (action: string) => void;
}

export function ChurchTopBar({
  churchName,
  showLogo = false,
  className,
  onNavigate,
}: ChurchTopBarProps) {
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={cn('bg-white border-b border-gray-100', className)}
    >
      <View className='flex-row items-center justify-between px-4 h-14'>
        {/* Center - Logo or Title */}
        <View className='flex-1 items-start'>
          {showLogo ? (
            <View className='flex-row items-center gap-2'>
              <View className='w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center'>
                <Text className='text-white font-bold text-sm'>CH</Text>
              </View>
              <Text className='font-semibold text-lg text-gray-900'>
                {churchName}
              </Text>
            </View>
          ) : churchName ? (
            <Text className='font-semibold text-lg text-gray-900'>
              {churchName}
            </Text>
          ) : null}
        </View>

        {/* Right side - Actions */}
        <View className='flex-row items-center gap-1'>
          <Pressable
            onPress={() =>router.push({ pathname: '/notifications/app-notification-list' })
            }
            className='w-10 h-10 items-center justify-center rounded-full'
          >
            <Bell size={18} color='#374151' />
          </Pressable>
          <Pressable
            onPress={() => setIsMenuOpen(true)}
            className='w-6 h-6 items-center justify-center rounded-full'
          >
            <Menu size={18} color='#374151' />
          </Pressable>
        </View>
      </View>
      <ChurchMenu
        churchName={churchName}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </View>
  );
}
