// ChurchNewsDetailScreen.tsx (React Native + NativeWind)
// ✅ No Button component (uses Pressable)
// ✅ Same shadcn-like look (pill badge + soft card)
// ✅ lucide-react-native icons
// ✅ Works with ChurchNewsItem dataset

import React, { useMemo, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import {
  Megaphone,
  Mail,
  CalendarDays,
  Users,
  AlertTriangle,
  MessageSquareText,
  ArrowLeft,
} from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { ChurchNewsType, IChurchNews } from '@/data/mockData';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchChurchNews } from '../redux/slices/church-news.slice';

interface ChurchNewsDetailScreenProps {}

export function ChurchNewsDetailScreen({}: ChurchNewsDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: churchNews, status } = useAppSelector((state) => state.churchNews);
  const { newsId } = useLocalSearchParams<{ newsId: string; from?: string }>();

  useEffect(() => {
    dispatch(fetchChurchNews());
  }, [dispatch]);

  const item = useMemo(
    () => churchNews.find((n) => n.id === newsId) || churchNews[0],
    [newsId, churchNews],
  );

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
        <Text className='text-gray-600 mt-4'>Loading news...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <Text className='text-gray-600'>News not found</Text>
      </View>
    );
  }

  const getTypeTheme = (type: ChurchNewsType) => {
    switch (type) {
      case 'announcement':
        return {
          pillBg: 'bg-indigo-100',
          pillText: 'text-indigo-700',
          iconBg: 'bg-indigo-100',
          icon: '#4f46e5',
          Icon: Megaphone,
          label: 'Announcement',
        };
      case 'newsletter':
        return {
          pillBg: 'bg-sky-100',
          pillText: 'text-sky-700',
          iconBg: 'bg-sky-100',
          icon: '#0284c7',
          Icon: Mail,
          label: 'Newsletter',
        };
      case 'event':
        return {
          pillBg: 'bg-green-100',
          pillText: 'text-green-700',
          iconBg: 'bg-green-100',
          icon: '#16a34a',
          Icon: CalendarDays,
          label: 'Event',
        };
      case 'ministry':
        return {
          pillBg: 'bg-amber-100',
          pillText: 'text-amber-700',
          iconBg: 'bg-amber-100',
          icon: '#d97706',
          Icon: Users,
          label: 'Ministry Update',
        };
      case 'alert':
        return {
          pillBg: 'bg-red-100',
          pillText: 'text-red-700',
          iconBg: 'bg-red-100',
          icon: '#dc2626',
          Icon: AlertTriangle,
          label: 'Urgent Alert',
        };
      case 'pastor-message':
        return {
          pillBg: 'bg-purple-100',
          pillText: 'text-purple-700',
          iconBg: 'bg-purple-100',
          icon: '#7c3aed',
          Icon: MessageSquareText,
          label: 'Pastor Message',
        };
      default:
        return {
          pillBg: 'bg-gray-100',
          pillText: 'text-gray-700',
          iconBg: 'bg-gray-100',
          icon: '#6b7280',
          Icon: Megaphone,
          label: 'Update',
        };
    }
  };

  const theme = getTypeTheme(item.type);
  const TypeIcon = theme.Icon;

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar  title={theme.label} showNotification={false} show={false} />

      <ScrollView contentContainerClassName='p-4 pb-12'>
        {/* Optional hero image */}
        {!!item.image && (
          <View className='mb-4 overflow-hidden rounded-2xl bg-white border border-gray-100'>
            <Image
              source={{ uri: item.image }}
              className='w-full h-48'
              resizeMode='cover'
            />
          </View>
        )}

        {/* Main card */}
        <View className='bg-white rounded-2xl p-6 shadow-sm'>
          {/* Icon + Type badge */}
          <View className='flex-row items-center gap-3 mb-4'>
            <View className={`p-3 rounded-full ${theme.iconBg}`}>
              <TypeIcon size={24} color={theme.icon} />
            </View>

            <View className='flex-1'>
              <View
                className={`self-start px-3 py-1 rounded-full ${theme.pillBg}`}
              >
                <Text className={`text-xs font-semibold ${theme.pillText}`}>
                  {theme.label}
                </Text>
              </View>

              {!!item.isPinned && (
                <Text className='text-xs text-gray-500 mt-1'>
                  Pinned update
                </Text>
              )}
            </View>
          </View>

          {/* Title */}
          <Text className='text-xl font-bold text-gray-900 mb-2'>
            {item.title}
          </Text>

          {/* Summary */}
          {!!item.summary && (
            <Text className='text-gray-700 leading-relaxed mb-4'>
              {item.summary}
            </Text>
          )}

          {/* Meta */}
          <View className='flex-row items-center flex-wrap gap-2 mb-5'>
            <Text className='text-sm text-gray-500'>{item.date}</Text>
            <Text className='text-sm text-gray-400'>•</Text>
            <Text className='text-sm text-gray-500'>
              {item.author || 'Church Office'}
            </Text>

            {!!item.isUrgent && (
              <>
                <Text className='text-sm text-gray-400'>•</Text>
                <View className='px-2 py-1 rounded-full bg-red-100'>
                  <Text className='text-xs font-semibold text-red-700'>
                    Urgent
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Content */}
          <View className='mb-6'>
            <Text className='text-gray-700 leading-relaxed'>
              {item.content}
            </Text>
          </View>

          {/* Tags */}
          {!!item.tags?.length && (
            <View className='flex-row flex-wrap gap-2 mb-6'>
              {item.tags.map((t) => (
                <View key={t} className='px-3 py-1 rounded-full bg-gray-100'>
                  <Text className='text-xs font-medium text-gray-700'>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* CTA */}
          {!!item.cta?.label && !!item.cta?.route && (
            <View className='pt-4 border-t border-gray-100'>
              <Pressable
                // onPress={() => router.push(item.cta!.route) as any}
                className='w-full h-12 rounded-xl bg-indigo-600 items-center justify-center'
              >
                <Text className='text-white font-semibold'>
                  {item.cta.label}
                </Text>
              </Pressable>

              <Text className='text-xs text-gray-500 mt-2 text-center'>
                You’ll be taken to the next step.
              </Text>
            </View>
          )}
        </View>

        {/* Related info / About church */}
        <View className='mt-4 bg-white rounded-2xl p-4 shadow-sm'>
          <Text className='font-semibold text-gray-900 mb-2'>About this</Text>
          <Text className='text-sm text-gray-600 leading-relaxed'>
            You’re seeing official updates from this church. You can manage
            which churches you follow and what updates you receive in settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
