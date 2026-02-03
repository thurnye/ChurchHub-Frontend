// PrayerDetailScreen.tsx (React Native + NativeWind)
// ✅ No Button/Badge components — uses Pressable + Text
// ✅ lucide-react-native icons
// ✅ Same layout + praying toggle

import React, { useMemo, useState, useEffect } from 'react';
import {  View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Heart, Check, Share2 } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchPrayerItems } from '../redux/slices/prayer.slice';

interface PrayerDetailScreenProps {}

type VisibilityKey =
  | 'everyone'
  | 'pastor_only'
  | 'clergy'
  | 'groups'
  | 'church_units';

const visibilityLabels: Record<VisibilityKey, string> = {
  everyone: 'Everyone in Church',
  pastor_only: 'Pastor Only',
  clergy: 'Clergy',
  groups: 'Selected Groups',
  church_units: 'Selected Churches',
};

export function PrayerDetailScreen({}: PrayerDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: prayerRequests, status } = useAppSelector((state) => state.prayer);
  const { prayerId, from } = useLocalSearchParams<{
    prayerId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchPrayerItems());
  }, [dispatch]);

  const prayer = useMemo(
    () => prayerRequests.find((p) => p.id === prayerId) || prayerRequests[0],
    [prayerRequests, prayerId],
  );

  const [isPraying, setIsPraying] = useState(false);

  if (status === 'loading' || !prayer) {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Loading...' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  const isOwner = false; // TODO: replace with real ownership check

  const answered = prayer.status === 'answered';

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title={prayer.title} navigateTo={from} />
      <View className='bg-white border-b border-gray-200 px-4 py-3'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-3'>
            <Text className='font-semibold text-lg text-gray-900'>
              Prayer Request
            </Text>
          </View>

          <Pressable
            onPress={() => {}}
            className='h-10 w-10 rounded-xl items-center justify-center'
            style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          >
            <Share2 size={20} color='#111827' />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerClassName='p-4 pb-28'>
        {/* Main Card */}
        <View className='bg-white rounded-2xl p-6 shadow-sm mb-4'>
          {/* Status */}
          {answered && (
            <View className='self-start mb-4 flex-row items-center px-3 py-1.5 rounded-full bg-green-100'>
              <Check size={14} color='#15803d' />
              <Text className='ml-2 text-sm font-medium text-green-700'>
                Answered Prayer
              </Text>
            </View>
          )}

          {/* Title */}
          <Text className='text-xl font-bold text-gray-900 mb-3'>
            {prayer.title}
          </Text>

          {/* Submitted by */}
          <View className='flex-row flex-wrap items-center mb-4'>
            <Text className='text-sm text-gray-500'>
              Submitted by {prayer.submittedBy}
            </Text>
            <Text className='text-sm text-gray-500'> • </Text>
            <Text className='text-sm text-gray-500'>{prayer.timestamp}</Text>
          </View>

          {/* Message */}
          <View className='mb-6'>
            <Text className='text-gray-700 leading-6'>{prayer.message}</Text>
          </View>

          {/* Visibility */}
          <View className='mb-4'>
            <Text className='text-sm text-gray-500 mb-2'>Shared with:</Text>
            <View className='flex-row flex-wrap gap-2'>
              {(prayer.visibility as VisibilityKey[]).map((v, index) => (
                <View
                  key={`${v}-${index}`}
                  className='px-3 py-1.5 rounded-full border border-gray-200 bg-white'
                >
                  <Text className='text-xs text-gray-700'>
                    {visibilityLabels[v] ?? v}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Target Clergy */}
          {!!prayer.targetClergy?.length && (
            <View className='mb-4'>
              <Text className='text-sm text-gray-500 mb-2'>
                Clergy members:
              </Text>
              <View className='gap-1'>
                {prayer.targetClergy.map((clergy: string, index: number) => (
                  <Text
                    key={`${clergy}-${index}`}
                    className='text-sm text-gray-700'
                  >
                    • {clergy}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Prayer Stats */}
          <View className='pt-4 border-t border-gray-100'>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-2'>
                <Heart
                  size={20}
                  color={isPraying ? '#4f46e5' : '#9ca3af'}
                  fill={isPraying ? '#4f46e5' : 'transparent'}
                />
                <Text className='text-sm text-gray-600'>
                  {prayer.responseCount}{' '}
                  {prayer.responseCount === 1 ? 'person is' : 'people are'}{' '}
                  praying
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Responses */}
        <View className='bg-white rounded-2xl p-4 shadow-sm mb-4'>
          <Text className='font-semibold text-gray-900 mb-3'>
            Prayer Responses
          </Text>

          <View className='gap-3'>
            <View className='p-3 bg-gray-50 rounded-2xl'>
              <Text className='text-sm font-medium text-gray-900 mb-1'>
                Sister Mary Johnson
              </Text>
              <Text className='text-sm text-gray-600'>
                Praying for complete healing and God's peace over your family.
                🙏
              </Text>
              <Text className='text-xs text-gray-400 mt-2'>1 hour ago</Text>
            </View>

            <View className='p-3 bg-gray-50 rounded-2xl'>
              <Text className='text-sm font-medium text-gray-900 mb-1'>
                Brother David Lee
              </Text>
              <Text className='text-sm text-gray-600'>
                Standing in faith with you. God is faithful!
              </Text>
              <Text className='text-xs text-gray-400 mt-2'>3 hours ago</Text>
            </View>
          </View>
        </View>

        {/* Owner Actions */}
        {isOwner && prayer.status === 'praying' && (
          <Pressable
            onPress={() => {}}
            className='w-full rounded-2xl border border-gray-200 bg-white py-3 flex-row items-center justify-center mb-4'
          >
            <Check size={18} color='#111827' />
            <Text className='ml-2 text-sm font-semibold text-gray-900'>
              Mark as Answered
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      {!isOwner && (
        <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
          <Pressable
            onPress={() => setIsPraying((p) => !p)}
            className={`w-full h-12 rounded-2xl flex-row items-center justify-center ${
              isPraying ? 'bg-white border border-gray-200' : 'bg-indigo-600'
            }`}
          >
            <Heart
              size={20}
              color={isPraying ? '#4f46e5' : '#ffffff'}
              fill={isPraying ? '#4f46e5' : 'transparent'}
            />
            <Text
              className={`ml-2 text-sm font-semibold ${
                isPraying ? 'text-indigo-600' : 'text-white'
              }`}
            >
              {isPraying ? 'Praying' : "I'm Praying"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
