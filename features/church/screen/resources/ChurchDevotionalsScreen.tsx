import React, { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { BookOpen } from 'lucide-react-native';

import { IChurch, IDevotional } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchDevotionals } from '../../redux/slices/devotionals.slice';

interface ChurchDevotionalsScreenProps {
  church: IChurch;
}

export function ChurchDevotionalsScreen({
  church,
}: ChurchDevotionalsScreenProps) {
  const dispatch = useAppDispatch();
  const { items: devotionals, status, error } = useAppSelector((state) => state.devotionals);

  useEffect(() => {
    dispatch(fetchDevotionals());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate church={church} title='Devotionals' icon={BookOpen}>
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading devotionals...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate church={church} title='Devotionals' icon={BookOpen}>
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchDevotionals())}
            className='bg-indigo-600 px-4 py-2 rounded-lg'
          >
            <Text className='text-white font-semibold'>Retry</Text>
          </Pressable>
        </View>
      </ChurchScreenTemplate>
    );
  }

  return (
    <ChurchScreenTemplate church={church} title='Devotionals' icon={BookOpen}>
      <View className='gap-3'>
        {devotionals.map((devotion: IDevotional) => (
          <Card key={devotion.id}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/church/devotion/[devotionalId]',
                  params: {
                    devotionalId: devotion.id,
                    from: `/church/${church.id}`,
                    id: church.id,
                    tab: 'devotionals',
                  },
                })
              }
            >
              <CardContent className='p-4'>
                <Text className='font-semibold text-gray-900 mb-2'>
                  {devotion.title}
                </Text>
                <Text className='text-sm text-gray-600 mb-2'>
                  {devotion.reflection}
                </Text>
                <Text className='text-xs text-gray-500'>{devotion.date}</Text>
              </CardContent>
            </Pressable>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
