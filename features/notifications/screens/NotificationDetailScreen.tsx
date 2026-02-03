// NotificationDetailScreen.tsx (React Native + NativeWind)
// ✅ No Button component (uses Pressable)
// ✅ Keeps your shadcn-like look (Badge-like pill styles)
// ✅ lucide-react-native icons

import React, { useMemo, useEffect } from 'react';
import {  View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import {  Bell } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchNotifications } from '../redux/slices/notifications.slice';

interface NotificationDetailScreenProps {}

export function NotificationDetailScreen({}: NotificationDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: notifications, status } = useAppSelector((state) => state.notifications);
  const { notificationId, from } = useLocalSearchParams<{
    notificationId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const notification = useMemo(
    () =>
      notifications.find((n) => n.id === notificationId) || notifications[0],
    [notifications, notificationId],
  );

  if (status === 'loading' || !notification) {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Loading...' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  const getSourceTypeTheme = (type: string) => {
    switch (type) {
      case 'church':
        return {
          pillBg: 'bg-indigo-100',
          pillText: 'text-indigo-700',
          iconBg: 'bg-indigo-100',
          icon: '#4f46e5',
        };
      case 'pastor':
        return {
          pillBg: 'bg-purple-100',
          pillText: 'text-purple-700',
          iconBg: 'bg-purple-100',
          icon: '#7c3aed',
        };
      case 'event':
        return {
          pillBg: 'bg-green-100',
          pillText: 'text-green-700',
          iconBg: 'bg-green-100',
          icon: '#16a34a',
        };
      case 'group':
        return {
          pillBg: 'bg-amber-100',
          pillText: 'text-amber-700',
          iconBg: 'bg-amber-100',
          icon: '#d97706',
        };
      default:
        return {
          pillBg: 'bg-gray-100',
          pillText: 'text-gray-700',
          iconBg: 'bg-gray-100',
          icon: '#6b7280',
        };
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'church':
        return 'Church Update';
      case 'pastor':
        return 'Pastor Message';
      case 'event':
        return 'Event Notification';
      case 'group':
        return 'Group Update';
      default:
        return 'Notification';
    }
  };

  const theme = getSourceTypeTheme(notification.sourceType);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar
        show={false}
        showNotification={false}
        title={'Notification'}
      />

      <ScrollView contentContainerClassName='p-4 pb-10'>
        {/* Main card */}
        <View className='bg-white rounded-2xl p-6 shadow-sm'>
          {/* Icon + Type badge */}
          <View className='flex-row items-center gap-3 mb-4'>
            <View className={`p-3 rounded-full ${theme.iconBg}`}>
              <Bell size={24} color={theme.icon} />
            </View>

            <View className='flex-1'>
              <View
                className={`self-start px-3 py-1 rounded-full ${theme.pillBg}`}
              >
                <Text className={`text-xs font-semibold ${theme.pillText}`}>
                  {getSourceTypeLabel(notification.sourceType)}
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className='text-xl font-bold text-gray-900 mb-2'>
            {notification.title}
          </Text>

          {/* Meta */}
          <View className='flex-row items-center flex-wrap gap-2 mb-4'>
            <Text className='text-sm text-gray-500'>{notification.source}</Text>
            <Text className='text-sm text-gray-400'>•</Text>
            <Text className='text-sm text-gray-500'>
              {notification.timestamp}
            </Text>
          </View>

          {/* Message */}
          <View className='mb-6'>
            <Text className='text-gray-700 leading-relaxed'>
              {notification.message}
            </Text>
          </View>

          {/* Action */}
          {!!notification.actionType && !!notification.actionLabel && (
            <View className='pt-4 border-t border-gray-100'>
              <Pressable
                // onPress={() => onActionPress?.(notification.id)}
                className='w-full h-12 rounded-xl bg-indigo-600 items-center justify-center'
              >
                <Text className='text-white font-semibold'>
                  {notification.actionLabel}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Related info */}
        <View className='mt-4 bg-white rounded-2xl p-4 shadow-sm'>
          <Text className='font-semibold text-gray-900 mb-2'>
            About {notification.source}
          </Text>
          <Text className='text-sm text-gray-600 leading-relaxed'>
            Stay connected with {notification.source} by enabling notifications
            for important updates, events, and announcements.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
