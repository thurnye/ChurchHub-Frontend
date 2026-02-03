import React, { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchChurchNews } from '../../redux/slices/church-news.slice';

interface ChurchGlobalChurchNewsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchGlobalChurchNewsScreen({
  church,
}: ChurchGlobalChurchNewsScreenProps) {
  const dispatch = useAppDispatch();
  const { items: churchNews, status, error } = useAppSelector((state) => state.churchNews);

  useEffect(() => {
    dispatch(fetchChurchNews());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate church={church} title='News' icon={FileText}>
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading news...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate church={church} title='News' icon={FileText}>
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchChurchNews())}
            className='bg-indigo-600 px-4 py-2 rounded-lg'
          >
            <Text className='text-white font-semibold'>Retry</Text>
          </Pressable>
        </View>
      </ChurchScreenTemplate>
    );
  }

  return (
    <ChurchScreenTemplate church={church} title='News' icon={FileText}>
      <View className='gap-3'>
        {churchNews.map((news) => (
          <Card key={news.id}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(modals)/church/church-news-detail',
                  params: { newsId: news.id },
                })
              }
            >
              <CardContent className='p-4'>
                <Text className='font-semibold text-gray-900 mb-2'>
                  {news.title}
                </Text>
                <Text className='text-sm text-gray-600 mb-2 leading-5'>
                  Important update for our congregation. Stay tuned for more
                  details.
                </Text>
                <Text className='text-xs text-gray-500'>{news.date}</Text>
              </CardContent>
            </Pressable>
          </Card>
        ))}
        <Card className='mb-4'>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Subscribe to Our Newsletter
            </Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Stay updated with church news and events.
            </Text>

            <AppPressable label='Subscribe' onPress={() => {}} />
          </CardContent>
        </Card>
      </View>
    </ChurchScreenTemplate>
  );
}
