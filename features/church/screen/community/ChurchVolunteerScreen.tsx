import React, { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Users } from 'lucide-react-native';
import { router } from 'expo-router';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchVolunteerPrograms } from '../../redux/slices/volunteer-programs.slice';

interface ChurchVolunteerScreenProps {
  church: IChurch;
}

export function ChurchVolunteerScreen({
  church,
}: ChurchVolunteerScreenProps) {
  const dispatch = useAppDispatch();
  const { items: volunteerPrograms, status, error } = useAppSelector((state) => state.volunteerPrograms);

  useEffect(() => {
    dispatch(fetchVolunteerPrograms());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Volunteer Opportunities'
        icon={Users}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading volunteer programs...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Volunteer Opportunities'
        icon={Users}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchVolunteerPrograms())}
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
      title='Volunteer Opportunities'
      icon={Users}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='mb-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Serve With Us
            </Text>
            <Text className='text-sm text-gray-600'>
              Use your gifts to serve God and our community.
            </Text>
          </View>

          <View className='gap-2'>
            {volunteerPrograms.map((volunteer, idx) => (
              <Card key={idx} className='bg-gray-50'>
                <CardContent className='p-3'>
                  <View className='flex-row items-center justify-between'>
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: '/community/volunteer/[volunteerId]',
                          params: {
                            volunteerId: volunteer.id,
                            from: `/church/${church.id}`,
                            tab: 'volunteer',
                          },
                        });
                      }}
                    >
                      <Text className='text-sm font-medium text-gray-900'>
                        {volunteer.title}
                      </Text>
                    </Pressable>
                    <Pressable>
                      <Text className='text-indigo-600 font-medium'>Join</Text>
                    </Pressable>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
