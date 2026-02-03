// church-screens-details.tsx (React Native + NativeWind)

import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, Clock } from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchVolunteerPrograms } from '../redux/slices/volunteer-programs.slice';

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

// -------------------------
// Volunteer Program Detail Screen
// -------------------------
interface VolunteerProgramDetailScreenProps {
  
}

export function VolunteerProgramDetailScreen({}: VolunteerProgramDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: volunteerPrograms, status } = useAppSelector((state) => state.volunteerPrograms);
  const { volunteerId, from } = useLocalSearchParams<{
    volunteerId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchVolunteerPrograms());
  }, [dispatch]);

  const program = useMemo(
    () =>
      volunteerPrograms.find((p) => p.id === volunteerId) ||
      volunteerPrograms[0],
    [volunteerId, volunteerPrograms],
  );

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <ActivityIndicator size='large' color='#4f46e5' />
        <Text className='text-gray-600 mt-4'>Loading program...</Text>
      </View>
    );
  }

  if (!program) {
    return (
      <View className='flex-1 bg-gray-50 items-center justify-center'>
        <Text className='text-gray-600'>Program not found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar
        show={true}
        title={program.title}
        navigateTo={'community'}
      />
      <View className='relative'>
        <Image
          source={{ uri: program.image }}
          className='w-full h-56'
          resizeMode='cover'
        />
        {/* <View className='absolute top-4 left-4'>
          <IconBtn onPress={onBack} className='bg-white/90'>
            <ArrowLeft size={20} color='#111827' />
          </IconBtn>
        </View> */}
      </View>

      <ScrollView contentContainerClassName='pb-28' className='-mt-6'>
        <View className='bg-white rounded-t-3xl px-4 pt-6 pb-6'>
          <View className='mb-3 self-start'>
            <Badge variant='secondary'>
              <Text className='text-xs'>{program.category}</Text>
            </Badge>
          </View>

          <Text className='text-2xl font-bold text-gray-900 mb-2'>
            {program.title}
          </Text>
          <Text className='text-gray-600 mb-4'>{program.church}</Text>

          <View className='gap-4 mb-6'>
            <View className='flex-row items-start gap-3'>
              <Clock size={20} color='#4f46e5' />
              <View>
                <Text className='font-medium text-gray-900'>
                  Time Commitment
                </Text>
                <Text className='text-sm text-gray-600'>
                  {program.timeCommitment}
                </Text>
              </View>
            </View>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Description
            </Text>
            <Text className='text-sm text-gray-600 leading-6'>
              {program.description}
            </Text>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Skills Needed
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              {program.skillsNeeded.map((skill: string, index: number) => (
                <Badge key={index} variant='outline'>
                  <Text className='text-xs'>{skill}</Text>
                </Badge>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <AppPressable label='Apply to Volunteer' size='lg' onPress={() => {}} />
      </View>
    </View>
  );
}
