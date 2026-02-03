import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Play, Clock, Book, Radio } from 'lucide-react-native';

import { TopBar } from '@/shared/components/TopBar';
import { Card, CardContent, Badge } from '@/shared/components/ui';
import { devotionals } from '@/data/mockData';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchWorshipItems } from '../redux/slices/worship.slice';

const topics = [
  'All',
  'Faith',
  'Prayer',
  'Community',
  'Hope',
  'Love',
  'Justice',
];

export function WorshipScreen() {
  const dispatch = useAppDispatch();
  const { items: sermons, status } = useAppSelector((state) => state.worship);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchWorshipItems());
  }, [dispatch]);

  const filteredSermons =
    selectedTopic === 'All'
      ? sermons
      : sermons.filter((s) => s.topic === selectedTopic);

  const liveSermons = sermons.filter((s) => s.isLive);

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <TopBar title='Worship' />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading worship content...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <TopBar title='Worship' />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Live Now Section */}
        {liveSermons.length > 0 && (
          <View className='px-4 pt-4'>
            <View className='flex-row items-center gap-2 mb-3'>
              <Radio size={18} color='#dc2626' />
              <Text className='font-semibold text-lg text-gray-900'>
                Live Now
              </Text>
            </View>
            {liveSermons.map((sermon) => (
              <Card key={sermon.id} className='mb-4'>
                <View className='relative'>
                  <Image
                    source={{ uri: sermon.thumbnail }}
                    style={{ width: '100%', height: 192 }}
                    contentFit='cover'
                  />
                  <View className='absolute top-3 left-3'>
                    <Badge className='bg-red-600'>
                      <View className='flex-row items-center'>
                        <View className='w-2 h-2 bg-white rounded-full mr-1.5' />
                        <Text className='text-white text-xs font-medium'>
                          LIVE
                        </Text>
                      </View>
                    </Badge>
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/media-player/[id]',
                        params: {
                          id: sermon.id,
                          from: `worship`,
                        },
                      })
                    }
                    className='absolute inset-0 items-center justify-center bg-black/30'
                  >
                    <View className='w-16 h-16 bg-white/90 rounded-full items-center justify-center'>
                      <Play size={32} color='#111827' fill='#111827' />
                    </View>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/media-player/[id]',
                      params: {
                        id: sermon.id,
                        from: `worship`,
                      },
                    })
                  }
                >
                  <CardContent>
                    <Text className='font-semibold text-gray-900 mb-1'>
                      {sermon.title}
                    </Text>
                    <Text className='text-sm text-gray-600'>
                      {sermon.church}
                    </Text>
                    <Text className='text-sm text-gray-500'>
                      {sermon.speaker}
                    </Text>
                  </CardContent>
                </Pressable>
              </Card>
            ))}
          </View>
        )}

        {/* Daily Devotional */}
        <View className='px-4 py-4'>
          <View className='flex-row items-center gap-2 mb-3'>
            <Book size={18} color='#4f46e5' />
            <Text className='font-semibold text-lg text-gray-900'>
              Daily Devotional
            </Text>
          </View>
          <Card className='bg-indigo-50 border-indigo-100'>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/church/devotion/[devotionalId]',
                  params: {
                    devotionalId: devotionals[0].id,
                    from: 'worship',
                  },
                })
              }
            >
              <CardContent>
                <Text className='text-xs text-indigo-600 font-medium mb-1'>
                  {devotionals[0].verse}
                </Text>
                <Text className='text-base text-gray-900 italic mb-3'>
                  "{devotionals[0].verseText}"
                </Text>
                <Text className='text-sm text-gray-600 mb-2'>
                  {devotionals[0].reflection}
                </Text>
                <Text className='text-xs text-gray-500'>
                  {devotionals[0].date}
                </Text>
              </CardContent>
            </Pressable>
          </Card>
        </View>

        {/* Topic Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='py-3 border-t border-gray-100'
        >
          <View className='flex-row gap-2 px-4'>
            {topics.map((topic) => (
              <Pressable
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-full ${
                  selectedTopic === topic ? 'bg-indigo-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedTopic === topic ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {topic}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Sermon Library */}
        <View className='px-4 py-4'>
          <Text className='font-semibold text-lg text-gray-900 mb-3'>
            Sermon Library
          </Text>
          <View className='gap-3 pb-6'>
            {filteredSermons
              .filter((s) => !s.isLive)
              .map((sermon) => (
                <Card key={sermon.id}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/sermons/[sermonId]',
                        params: {
                          sermonId: sermon.id,
                          from: 'worship',
                        },
                      })
                    }
                  >
                    <CardContent>
                      <View className='flex-row gap-3'>
                        <View className='relative overflow-hidden rounded-lg'>
                          <Image
                            source={{ uri: sermon.thumbnail }}
                            style={{ width: 96, height: 96 }}
                            contentFit='cover'
                          />
                          <View className='absolute inset-0 items-center justify-center bg-black/30'>
                            <View className='w-10 h-10 bg-white/90 rounded-full items-center justify-center'>
                              <Play size={18} color='#111827' fill='#111827' />
                            </View>
                          </View>
                        </View>
                        <View className='flex-1'>
                          <Badge
                            variant='secondary'
                            className='self-start mb-1'
                          >
                            <Text className='text-xs text-gray-700'>
                              {sermon.topic}
                            </Text>
                          </Badge>
                          <Text className='font-semibold text-gray-900 mb-1'>
                            {sermon.title}
                          </Text>
                          <Text className='text-sm text-gray-600'>
                            {sermon.speaker}
                          </Text>
                          <Text className='text-sm text-gray-500'>
                            {sermon.church}
                          </Text>
                          <View className='flex-row items-center gap-2 mt-2'>
                            <Clock size={12} color='#9ca3af' />
                            <Text className='text-xs text-gray-400'>
                              {sermon.duration}
                            </Text>
                            <Text className='text-gray-300'>•</Text>
                            <Text className='text-xs text-gray-400'>
                              {sermon.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Pressable>
                </Card>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
