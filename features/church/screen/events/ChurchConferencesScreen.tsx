import React, { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchConferences } from '../../redux/slices/conferences.slice';

interface ChurchConferencesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchConferencesScreen({
  church,
}: ChurchConferencesScreenProps) {
  const dispatch = useAppDispatch();
  const { items: conferences, status, error } = useAppSelector((state) => state.conferences);

  useEffect(() => {
    dispatch(fetchConferences());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Conferences / Retreats'
        icon={Calendar}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading conferences...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Conferences / Retreats'
        icon={Calendar}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchConferences())}
            className='bg-indigo-600 px-4 py-2 rounded-lg'
          >
            <Text className='text-white font-semibold'>Retry</Text>
          </Pressable>
        </View>
      </ChurchScreenTemplate>
    );
  }

  return (
    <ChurchScreenTemplate
      church={church}
      title='Conferences / Retreats'
      icon={Calendar}
    >
      <View className='gap-3'>
        {conferences.map((c, idx) => (
          <Card key={idx}>
            <CardContent className='p-4'>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/church/conference/[conferenceId]',
                    params: {
                      conferenceId: c.id,
                      from: `/church/${church.id}`,
                      tab: 'group',
                    },
                  })
                }
              >
                <Text className='font-semibold text-gray-900 mb-2'>
                  {c.title}
                </Text>
                <Text className='text-sm text-gray-600 mb-2'>{c.dates}</Text>
                <Text className='text-sm text-gray-600 mb-3'>{c.location}</Text>
              </Pressable>

              <Pressable
                onPress={() => {}}
                className='w-full h-12 bg-black rounded-xl items-center justify-center active:opacity-80'
              >
                <View className='flex-row items-center justify-center gap-2'>
                  <Text className='text-white font-semibold'>Register</Text>
                </View>
              </Pressable>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
