import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/shared/utils/cn';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchNotifications } from '../redux/slices/notifications.slice';
interface NotificationsListScreenProps {}

type Filter = 'all' | 'church' | 'event' | 'community';

export function NotificationsListScreen({}: NotificationsListScreenProps) {
  const dispatch = useAppDispatch();
  const { items: notificationItems, status } = useAppSelector((state) => state.notifications);
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState(notificationItems);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    setItems(notificationItems);
  }, [notificationItems]);
  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const filteredNotifications = useMemo(() => {
    return items.filter((notification) => {
      if (filter === 'all') return true;
      if (filter === 'church')
        return (
          notification.sourceType === 'church' ||
          notification.sourceType === 'pastor'
        );
      if (filter === 'event') return notification.sourceType === 'event';
      if (filter === 'community') return notification.sourceType === 'group';
      return true;
    });
  }, [items, filter]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIconTheme = (sourceType: string) => {
    switch (sourceType) {
      case 'church':
        return { bg: 'bg-indigo-100', color: '#4f46e5' };
      case 'pastor':
        return { bg: 'bg-purple-100', color: '#7c3aed' };
      case 'event':
        return { bg: 'bg-green-100', color: '#16a34a' };
      case 'group':
        return { bg: 'bg-amber-100', color: '#d97706' };
      default:
        return { bg: 'bg-gray-100', color: '#6b7280' };
    }
  };

  const Chip = ({ label, value }: { label: string; value: Filter }) => {
    const active = filter === value;
    return (
      <Pressable
        onPress={() => setFilter(value)}
        className={`px-4 py-2 rounded-full mr-2 ${
          active ? 'bg-indigo-600' : 'bg-gray-100'
        }`}
      >
        <Text
          className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={cn('bg-white border-b border-gray-100')}
      >
        {/* TOP ROW */}
        <View className='flex-row items-center justify-between px-4 '>
          {/* Left */}
          <Pressable
            onPress={() => router.back()}
            className='w-10 h-10 rounded-full items-center justify-center active:bg-gray-100'
          >
            <ArrowLeft size={20} color='#111827' />
          </Pressable>

          {/* Center */}
          <View className='flex-1 items-center'>
            <Text className='font-semibold text-lg text-gray-900'>
              {'Notification'}
            </Text>
          </View>

          {/* Right */}
          <View className='flex-row items-center gap-1'>
            <Pressable
              onPress={markAllRead}
              className='flex-row items-center px-3 py-2 rounded-xl'
              style={{ backgroundColor: 'rgba(79,70,229,0.08)' }}
              disabled={items.length === 0 || unreadCount === 0}
            >
              <CheckCheck size={16} color='#4f46e5' />
              <Text className='ml-2 text-sm font-medium text-indigo-600'>
                Mark all read
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className='bg-white border-b border-gray-200 px-4 py-3'>
        <View className='flex-row items-center justify-between mb-3'>
          <View className='flex-row items-center gap-3'>
            <View>
              {unreadCount > 0 && (
                <Text className='text-xs text-gray-500'>
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName='pr-4'
        >
          <Chip label='All' value='all' />
          <Chip label='Church' value='church' />
          <Chip label='Event' value='event' />
          <Chip label='Community' value='community' />
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView contentContainerClassName='p-4 pb-10'>
        {filteredNotifications.length > 0 ? (
          <View className='gap-2'>
            {filteredNotifications.map((notification) => {
              const isUnread = !notification.read;
              const theme = getIconTheme(notification.sourceType);

              return (
                <Pressable
                  key={notification.id}
                  onPress={() =>
                    router.push({
                      pathname:
                        '/(modals)/notifications/app-notification-detail',
                      params: { notificationId: notification.id },
                    })
                  }
                  className={`bg-white rounded-2xl p-4 ${
                    isUnread ? 'shadow-sm' : ''
                  }`}
                  style={
                    isUnread
                      ? { borderLeftWidth: 4, borderLeftColor: '#4f46e5' }
                      : { borderLeftWidth: 4, borderLeftColor: 'transparent' }
                  }
                >
                  <View className='flex-row items-start gap-3'>
                    <View className={`p-2 rounded-full ${theme.bg}`}>
                      <Bell size={16} color={theme.color} />
                    </View>

                    <View className='flex-1'>
                      <View className='flex-row items-start justify-between gap-2 mb-1'>
                        <Text className='font-semibold text-sm text-gray-900 flex-1'>
                          {notification.title}
                        </Text>
                        {isUnread && (
                          <View className='w-2 h-2 rounded-full bg-indigo-600 mt-1' />
                        )}
                      </View>

                      <Text className='text-sm text-gray-600 mb-2'>
                        {notification.message}
                      </Text>

                      <View className='flex-row items-center justify-between'>
                        <Text className='text-xs text-gray-500'>
                          {notification.timestamp}
                        </Text>

                        {!!notification.actionLabel && (
                          <Text className='text-xs text-indigo-600 font-medium'>
                            {notification.actionLabel} →
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View className='items-center justify-center py-12 px-4'>
            <View className='w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4'>
              <Bell size={32} color='#9ca3af' />
            </View>
            <Text className='text-gray-500 text-center'>
              No notifications in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
