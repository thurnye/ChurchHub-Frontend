// ChurchGroupDetailScreen.tsx (React Native + NativeWind)

import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import {
  Calendar,
  Users,
  MapPin,
  Share2,
  UserPlus,
} from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import { churchGroups } from '@/data/mockData';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

interface ChurchGroupDetailScreenProps {}

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
  leftIcon,
}: {
  label: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='w-full h-12 rounded-xl bg-indigo-600 flex-row items-center justify-center gap-2'
    >
      {leftIcon}
      <Text className='text-white font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

export function ChurchGroupDetailScreen({}: ChurchGroupDetailScreenProps) {
  const { groupId, from } = useLocalSearchParams<{
    groupId: string;
    from: string;
  }>();

  const group = useMemo(
    () => churchGroups.find((g) => g.id === groupId) || churchGroups[0],
    [groupId],
  );

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header with image */}
      <HiddenScreensTopBar
        show={true}
        title={group.name}
        navigateTo={from}
      />
      <View className='relative'>
        <Image
          source={{ uri: group.image }}
          className='w-full h-56'
          resizeMode='cover'
        />

        <View className='absolute top-4 right-4'>
          <IconBtn onPress={() => {}} className='bg-white/90'>
            <Share2 size={20} color='#111827' />
          </IconBtn>
        </View>
      </View>

      <ScrollView contentContainerClassName='pb-28' className='-mt-6'>
        {/* Content */}
        <View className='bg-white rounded-t-3xl relative px-4 pt-6 pb-6'>
          <View className='mb-3 self-start'>
            <Badge variant='secondary'>
              <Text className='text-xs'>{group.category}</Text>
            </Badge>
          </View>

          <Text className='text-2xl font-bold text-gray-900 mb-2'>
            {group.name}
          </Text>

          <View className='flex-row items-center gap-2 mb-6'>
            <MapPin size={16} color='#6b7280' />
            <Text className='text-sm text-gray-600'>{group.church}</Text>
          </View>

          {/* Group Stats */}
          <View className='flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl'>
            <View className='flex-row items-center gap-2'>
              <Users size={20} color='#4f46e5' />
              <View>
                <Text className='text-sm font-medium text-gray-900'>
                  {group.memberCount}
                </Text>
                <Text className='text-xs text-gray-500'>Members</Text>
              </View>
            </View>

            <View className='flex-row items-center gap-2 ml-4'>
              <Calendar size={20} color='#4f46e5' />
              <View>
                <Text className='text-sm font-medium text-gray-900'>
                  Weekly
                </Text>
                <Text className='text-xs text-gray-500'>Meetings</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>
              About This Group
            </Text>
            <Text className='text-sm text-gray-600 leading-6'>
              {group.description}
            </Text>
          </View>

          {/* Meeting Schedule */}
          <View className='mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100'>
            <View className='flex-row items-center gap-2 mb-2'>
              <Calendar size={16} color='#4f46e5' />
              <Text className='font-semibold text-gray-900'>
                Meeting Schedule
              </Text>
            </View>
            <Text className='text-sm text-gray-700'>
              {group.meetingSchedule}
            </Text>
            <Text className='text-xs text-gray-500 mt-1'>
              Community Hall, Main Building
            </Text>
          </View>

          {/* Leaders */}
          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-3'>
              Group Leaders
            </Text>

            <View className='gap-3'>
              {group.leaders.map((leader: any, index: number) => (
                <View
                  key={index}
                  className='flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl'
                >
                  <View className='w-12 h-12 rounded-full bg-indigo-100 items-center justify-center'>
                    <Users size={24} color='#4f46e5' />
                  </View>

                  <View className='flex-1'>
                    <Text className='font-medium text-gray-900'>
                      {leader.name}
                    </Text>
                    <Text className='text-sm text-gray-500'>{leader.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Upcoming Events */}
          <View className='mb-2'>
            <Text className='font-semibold text-gray-900 mb-3'>
              Upcoming Group Events
            </Text>

            <View className='gap-2'>
              <View className='p-3 bg-gray-50 rounded-xl'>
                <Text className='font-medium text-sm text-gray-900'>
                  Fellowship Night
                </Text>
                <Text className='text-xs text-gray-500'>
                  Friday, Jan 30 at 7:00 PM
                </Text>
              </View>

              <View className='p-3 bg-gray-50 rounded-xl'>
                <Text className='font-medium text-sm text-gray-900'>
                  Community Service Day
                </Text>
                <Text className='text-xs text-gray-500'>
                  Saturday, Feb 6 at 9:00 AM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom actions */}
      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <PrimaryCta
          label='Request to Join'
          onPress={() => {}}
          leftIcon={<UserPlus size={20} color='#ffffff' />}
        />
      </View>
    </View>
  );
}
