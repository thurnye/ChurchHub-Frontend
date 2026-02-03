// church-screens-details.tsx (React Native + NativeWind)

import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Users,
  Clock,
  Play,
} from 'lucide-react-native';

import { Badge, Card, CardContent } from '@/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchConferences } from '../redux/slices/conferences.slice';

/** Small reusable Pressable button */
function AppPressable({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}) {
  const pad =
    size === 'sm' ? 'px-3 py-2' : size === 'lg' ? 'px-4 py-4' : 'px-4 py-3';

  const base = 'rounded-xl flex-row items-center justify-center gap-2';
  const bg =
    variant === 'primary'
      ? 'bg-indigo-600'
      : variant === 'outline'
        ? 'bg-white border border-gray-300'
        : 'bg-transparent';
  const text = variant === 'primary' ? 'text-white' : 'text-gray-900';

  return (
    <Pressable onPress={onPress} className={`${base} ${pad} ${bg}`}>
      {leftIcon}
      <Text
        className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'} ${text}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

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

interface ConferenceDetailScreenProps {}

export function ConferenceDetailScreen({}: ConferenceDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: conferences, status } = useAppSelector((state) => state.conferences);
  const { conferenceId, from } = useLocalSearchParams<{
    conferenceId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchConferences());
  }, [dispatch]);

  const conference = useMemo(
    () => conferences.find((c) => c.id === conferenceId) || conferences[0],
    [conferenceId, conferences],
  );

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
        <Text className='text-gray-600 mt-4'>Loading conference...</Text>
      </View>
    );
  }

  if (!conference) {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <Text className='text-gray-600'>Conference not found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar
        show={true}
        title={conference.title}
        navigateTo={from}
      />
      <View className='relative'>
        <Image
          source={{ uri: conference.image }}
          className='w-full h-56'
          resizeMode='cover'
        />
      </View>

      <ScrollView contentContainerClassName='pb-28' className='-mt-6'>
        <View className='bg-white rounded-t-3xl px-4 pt-6 pb-6'>
          <Text className='text-2xl font-bold text-gray-900 mb-2'>
            {conference.title}
          </Text>
          <Text className='text-lg text-indigo-600 mb-4'>
            {conference.theme}
          </Text>

          <View className='gap-4 mb-6'>
            <View className='flex-row items-start gap-3'>
              <Calendar size={20} color='#4f46e5' />
              <View>
                <Text className='font-medium text-gray-900'>Dates</Text>
                <Text className='text-sm text-gray-600'>
                  {conference.dates}
                </Text>
              </View>
            </View>

            <View className='flex-row items-start gap-3'>
              <MapPin size={20} color='#4f46e5' />
              <View>
                <Text className='font-medium text-gray-900'>Location</Text>
                <Text className='text-sm text-gray-600'>
                  {conference.location}
                </Text>
              </View>
            </View>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>About</Text>
            <Text className='text-sm text-gray-600 leading-6'>
              {conference.description}
            </Text>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>Speakers</Text>
            <View className='flex-row flex-wrap gap-2'>
              {conference.speakers.map((speaker: string, index: number) => (
                <Badge key={index} variant='outline'>
                  <Text className='text-xs'>{speaker}</Text>
                </Badge>
              ))}
            </View>
          </View>

          <View className='mb-6 p-4 bg-gray-50 rounded-xl'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Registration
            </Text>
            <Text className='text-sm text-gray-600 mb-2'>
              {conference.registrationFee}
            </Text>
            <Text className='text-xs text-gray-500'>
              {conference.accommodation}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <AppPressable label='Register Now' size='lg' onPress={() => {}} />
      </View>
    </View>
  );
}
