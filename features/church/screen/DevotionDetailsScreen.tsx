import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import {
  Share2,
  Bookmark,
  Play,
} from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { AppPressable } from '../components/AppPressable';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchDevotionals } from '../redux/slices/devotionals.slice';

function IconBtn({
  onPress,
  children,
  className = '',
}: {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-10 h-10 rounded-full items-center justify-center ${className}`}
      hitSlop={10}
    >
      {children}
    </Pressable>
  );
}

interface DevotionalDetailScreenProps {}

export function DevotionalDetailScreen({}: DevotionalDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: devotionals, status } = useAppSelector((state) => state.devotionals);
  const { devotionalId, from, tab } = useLocalSearchParams<{
    devotionalId: string;
    tab: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchDevotionals());
  }, [dispatch]);

  const devotional = useMemo(
    () => devotionals.find((d) => d.id === devotionalId) || devotionals[0],
    [devotionalId, devotionals],
  );

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
        <Text className='text-gray-600 mt-4'>Loading devotional...</Text>
      </View>
    );
  }

  if (!devotional) {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <Text className='text-gray-600'>Devotional not found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar
        show={true}
        title={'Daily Devotional'}
        navigateTo={from}
      />

      <ScrollView contentContainerClassName='p-4 pb-24'>
        <View className='bg-white rounded-xl p-6 border border-gray-100'>
          <View className='mb-3 flex-row gap-2 justify-between'>
            <Badge variant='secondary'>
              <Text className='text-xs'>{devotional.category}</Text>
            </Badge>
            <View className='flex-row gap-2'>
              <IconBtn onPress={() => {}}>
                <Bookmark size={20} color='#111827' />
              </IconBtn>
              <IconBtn onPress={() => {}}>
                <Share2 size={20} color='#111827' />
              </IconBtn>
            </View>
          </View>

          <Text className='text-2xl font-bold text-gray-900'>
            {devotional.title}
          </Text>
          <Text className='text-xs text-gray-500 mb-4'>{devotional.date}</Text>

          <View className='mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100'>
            <Text className='text-sm font-semibold text-indigo-900 mb-2'>
              {devotional.verse}
            </Text>
            <Text className='text-sm text-indigo-800 italic leading-6'>
              “{devotional.verseText}”
            </Text>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>Reflection</Text>
            <Text className='text-gray-700 leading-6'>
              {devotional.reflection}
            </Text>
          </View>

          <View className='pt-4 border-t border-gray-100 flex-row items-center justify-between'>
            <View>
              <Text className='text-xs text-gray-500'>Written by</Text>
              <Text className='text-sm font-medium text-gray-900'>
                {devotional.author}
              </Text>
            </View>

            {!!devotional.audioUrl && (
              <AppPressable
                variant='outline'
                size='sm'
                label='Listen'
                onPress={() => {}}
                leftIcon={<Play size={16} color='#111827' />}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
