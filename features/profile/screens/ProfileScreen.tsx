import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import {
  Heart,
  Calendar,
  DollarSign,
  MessageCircle,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

import { TopBar } from '@/shared/components/TopBar';
import { Card, Avatar, Badge } from '@/shared/components/ui';
import { useAuth } from '@/shared/context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

interface MenuItem {
  icon: typeof Heart;
  label: string;
  value?: string;
  action: string;
}

const activityItems: MenuItem[] = [
  {
    icon: Heart,
    label: 'My Churches',
    value: '3',
    action: '/profile/my-churches',
  },
  {
    icon: Calendar,
    label: 'My Events',
    value: '2',
    action: '/profile/my-events',
  },
  {
    icon: DollarSign,
    label: 'My Donations',
    value: '$120',
    action: '/profile/my-donations',
  },
  {
    icon: MessageCircle,
    label: 'Prayer Requests',
    value: '5',
    action: '/profile/my-prayer-list',
  },
];

const settingsItems: MenuItem[] = [
  { icon: Bell, label: 'Notifications', action: 'notifications' },
  { icon: Settings, label: 'Preferences', action: '/settings/preferences' },
  { icon: HelpCircle, label: 'Help & Support', action: '/settings/help' },
];

export function ProfileScreen() {
  const { from } = useLocalSearchParams<{
    from: string;
  }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleItemPress = (action: string) => {
    router.push({
      pathname: action as any,
      params: {
        from: '/profile/my-profile',
      },
    });
  };

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar show={true} title='Profile' navigateTo={from} />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className='bg-white px-4 py-6 items-center border-b border-gray-100'>
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            size='xl'
            className='mb-3'
          />
          <Text className='text-xl font-semibold text-gray-900 mb-1'>
            {user?.name || 'Guest'}
          </Text>
          <Text className='text-sm text-gray-500 mb-3'>
            {user?.email || 'Not signed in'}
          </Text>
          <Badge variant='secondary'>
            <Text className='text-xs text-gray-700'>Member since 2023</Text>
          </Badge>
        </View>

        {/* Stats */}
        <View className='bg-white px-4 py-4 flex-row justify-around border-b border-gray-100'>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-indigo-600'>3</Text>
            <Text className='text-xs text-gray-500'>Churches</Text>
          </View>
          <View className='w-px bg-gray-200' />
          <View className='items-center'>
            <Text className='text-2xl font-bold text-indigo-600'>12</Text>
            <Text className='text-xs text-gray-500'>Events</Text>
          </View>
          <View className='w-px bg-gray-200' />
          <View className='items-center'>
            <Text className='text-2xl font-bold text-indigo-600'>$450</Text>
            <Text className='text-xs text-gray-500'>Given</Text>
          </View>
        </View>

        {/* My Activity Section */}
        <View className='px-4 py-4'>
          <Text className='text-sm font-semibold text-gray-500 uppercase mb-3'>
            My Activity
          </Text>
          <Card>
            {activityItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.action}
                  onPress={() => handleItemPress(item.action)}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    index < activityItems.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <View className='flex-row items-center gap-3'>
                    <View className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'>
                      <Icon size={20} color='#6b7280' />
                    </View>
                    <Text className='text-gray-900 font-medium'>
                      {item.label}
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-2'>
                    {item.value && (
                      <Text className='text-sm text-gray-500'>
                        {item.value}
                      </Text>
                    )}
                    <ChevronRight size={18} color='#9ca3af' />
                  </View>
                </Pressable>
              );
            })}
          </Card>
        </View>

        {/* Settings Section */}
        <View className='px-4 py-4'>
          <Text className='text-sm font-semibold text-gray-500 uppercase mb-3'>
            Settings
          </Text>
          <Card>
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.action}
                  onPress={() => handleItemPress(item.action)}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    index < settingsItems.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <View className='flex-row items-center gap-3'>
                    <View className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'>
                      <Icon size={20} color='#6b7280' />
                    </View>
                    <Text className='text-gray-900 font-medium'>
                      {item.label}
                    </Text>
                  </View>
                  <ChevronRight size={18} color='#9ca3af' />
                </Pressable>
              );
            })}
          </Card>
        </View>

        {/* Sign Out */}
        <View className='px-4 pb-6'>
          <Card>
            <Pressable
              onPress={() => logout()}
              className='flex-row items-center gap-3 px-4 py-3'
            >
              <View className='w-10 h-10 bg-red-50 rounded-full items-center justify-center'>
                <LogOut size={20} color='#dc2626' />
              </View>
              <Text className='text-red-600 font-medium'>Sign Out</Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
