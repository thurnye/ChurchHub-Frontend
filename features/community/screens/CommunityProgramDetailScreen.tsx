// CommunityProgramDetailScreen.tsx (React Native + NativeWind)
// No Button component used — only Pressable

import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Share2,
  Mail,
  Clock,
  Users,
} from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchCommunityItems } from '../redux/slices/community.slice';

interface CommunityProgramDetailScreenProps {
  // id: string;
  // onBack: () => void;
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

function PrimaryCta({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-1 h-12 rounded-xl bg-indigo-600 items-center justify-center'
    >
      <Text className='text-white font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

function OutlineCta({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-1 h-12 rounded-xl border border-gray-300 bg-white items-center justify-center'
    >
      <Text className='text-gray-900 font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

export function CommunityProgramDetailScreen({}: CommunityProgramDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: communityPrograms, status } = useAppSelector((state) => state.community);
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();

  useEffect(() => {
    dispatch(fetchCommunityItems());
  }, [dispatch]);

  const program = useMemo(
    () => communityPrograms.find((p) => p.id === id) || communityPrograms[0],
    [communityPrograms, id],
  );
  console.log('from:::', from)

  if (status === 'loading' || !program) {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Loading...' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header with image */}
      <HiddenScreensTopBar
        show={true}
        title={program.title}
        navigateTo={from}
      />
      <View className='relative'>
        <Image
          source={{ uri: program.image }}
          className='w-full h-56'
          resizeMode='cover'
        />

        {/* <View className="absolute top-4 left-4">
          <IconBtn onPress={onBack} className="bg-white/90">
            <ArrowLeft size={20} color="#111827" />
          </IconBtn>
        </View> */}

        <View className='absolute top-4 right-4'>
          <IconBtn onPress={() => {}} className='bg-white/90'>
            <Share2 size={20} color='#111827' />
          </IconBtn>
        </View>
      </View>

      <ScrollView contentContainerClassName='pb-28' className='-mt-6'>
        {/* Content */}
        <View className='bg-white rounded-t-3xl px-4 pt-6 pb-6'>
          <View className='mb-3 self-start'>
            <Badge variant='secondary'>
              <Text className='text-xs'>{program.category}</Text>
            </Badge>
          </View>

          <Text className='text-2xl font-bold text-gray-900 mb-2'>
            {program.title}
          </Text>

          <View className='flex-row items-center gap-2 mb-6'>
            <View className='px-3 py-1 rounded-full bg-green-100'>
              <Text className='text-xs font-semibold text-green-700'>
                Active Program
              </Text>
            </View>
          </View>

          {/* Program Details */}
          <View className='gap-4 mb-6'>
            <View className='flex-row items-start gap-3'>
              <Clock size={20} color='#4f46e5' />
              <View className='flex-1'>
                <Text className='font-medium text-gray-900'>Schedule</Text>
                <Text className='text-sm text-gray-600'>
                  Wednesdays & Saturdays, 9:00 AM - 1:00 PM
                </Text>
              </View>
            </View>

            <View className='flex-row items-start gap-3'>
              <MapPin size={20} color='#4f46e5' />
              <View className='flex-1'>
                <Text className='font-medium text-gray-900'>Location</Text>
                <Text className='text-sm text-gray-600'>
                  Community Center, Building A
                </Text>

                <Pressable onPress={() => {}} className='mt-2 self-start'>
                  <Text className='text-sm font-medium text-indigo-600'>
                    Get Directions
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className='flex-row items-start gap-3'>
              <Users size={20} color='#4f46e5' />
              <View className='flex-1'>
                <Text className='font-medium text-gray-900'>Hosted By</Text>
                <Text className='text-sm text-gray-600'>
                  Grace Community Church
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>
              About This Program
            </Text>
            <Text className='text-sm text-gray-600 leading-6'>
              {program.description}
            </Text>

            <Text className='text-sm text-gray-600 leading-6 mt-3'>
              This program serves over 200 families each month, providing
              essential food items and groceries. We welcome volunteers and
              donations to continue this vital ministry.
            </Text>
          </View>

          {/* Coordinator Contact */}
          <View className='mb-6 p-4 bg-gray-50 rounded-xl'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Program Coordinator
            </Text>

            <Pressable
              onPress={() => {}}
              className='flex-row items-center gap-2'
            >
              <Mail size={16} color='#9ca3af' />
              <Text className='text-sm text-indigo-600'>{program.contact}</Text>
            </Pressable>

            {/* If you want real email open, use Linking:
                Linking.openURL(`mailto:${program.contact}`)
            */}
          </View>

          {/* How to Help */}
          <View className='mb-2'>
            <Text className='font-semibold text-gray-900 mb-3'>
              How You Can Help
            </Text>

            <View className='gap-2'>
              {[
                'Volunteer on distribution days',
                'Donate non-perishable food items',
                'Contribute financially to the program',
              ].map((item, idx) => (
                <View key={idx} className='flex-row items-center gap-2'>
                  <View className='w-1.5 h-1.5 rounded-full bg-indigo-600' />
                  <Text className='text-sm text-gray-600'>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom actions */}
      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <View className='flex-row gap-3'>
          <OutlineCta label='Volunteer' onPress={() => {}} />
          <PrimaryCta label='Donate' onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}
