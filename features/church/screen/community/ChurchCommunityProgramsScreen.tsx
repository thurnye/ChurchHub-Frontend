import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { HeartHandshake, Mail, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchCommunityItems } from '@/features/community/redux/slices/community.slice';

interface ChurchCommunityProgramsScreenProps {
  church: IChurch;
}

export function ChurchCommunityProgramsScreen({
  church,
}: ChurchCommunityProgramsScreenProps) {
  const dispatch = useAppDispatch();
  const { items: churchCommunityPrograms, status, error } = useAppSelector((state) => state.community);

  useEffect(() => {
    dispatch(fetchCommunityItems());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Church Programs'
        icon={HeartHandshake}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading programs...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Church Programs'
        icon={HeartHandshake}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchCommunityItems())}
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
      title='Church Programs'
      icon={HeartHandshake}
    >
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='gap-3'>
          {churchCommunityPrograms.map((program) => (
            <View className='gap-4' key={program.id}>
              <Card>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: '/community/[id]',
                      params: {
                        from: `/church/${church.id}`,
                        id: church.id,
                        tab: 'community-programs',
                      },
                    });
                  }}
                >
                  <View className='relative'>
                    <Image
                      source={{ uri: program.image }}
                      style={{ width: '100%', height: 160 }}
                      contentFit='cover'
                    />
                  </View>
                </Pressable>
                <CardContent>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/community/[id]',
                        params: {
                          from: `/church/${church.id}`,
                          id: church.id,
                          tab: 'community-programs',
                        },
                      })
                    }
                  >
                    <Text className='font-semibold text-gray-900 text-base mb-2'>
                      {program.title}
                    </Text>
                    <Text className='text-sm text-gray-600 mb-4'>
                      {program.description}
                    </Text>
                  </Pressable>
                  <View className='flex-row gap-2'>
                    <Button variant='outline' size='sm' className='flex-1'>
                      <View className='flex-row items-center gap-1'>
                        <Mail size={14} color='#111827' />
                        <Text className='text-gray-900 text-sm font-medium'>
                          Contact
                        </Text>
                      </View>
                    </Button>
                    <Button size='sm' className='flex-1'>
                      <View className='flex-row items-center gap-1'>
                        <Heart size={14} color='#ffffff' />
                        <Text className='text-white text-sm font-medium'>
                          Get Involved
                        </Text>
                      </View>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </ChurchScreenTemplate>
  );
}
