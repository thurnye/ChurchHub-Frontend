// SermonDetailScreen.tsx (React Native + NativeWind)
// ✅ No Button/Badge components — uses Pressable + simple badge
// ✅ lucide-react-native icons
// ✅ Same layout: header image + LIVE badge + overlay play, info blocks, notes, related, fixed bottom actions

import React, { useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Play,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  User,
  Tag,
} from 'lucide-react-native';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/app.hooks';
import { fetchSermons } from '../redux/slices/sermons.slice';

interface SermonDetailScreenProps {
  onPlayMedia?: (sermonId: string) => void;
}

function BadgePill({
  text,
  variant = 'secondary',
}: {
  text: string;
  variant?: 'secondary' | 'live';
}) {
  const base = 'px-3 py-1 rounded-full';
  const styles =
    variant === 'live' ? 'bg-red-600' : 'bg-gray-100 border border-gray-200';

  const textColor = variant === 'live' ? 'text-white' : 'text-gray-700';
  return (
    <View className={`${base} ${styles}`}>
      <Text className={`text-xs font-semibold ${textColor}`}>{text}</Text>
    </View>
  );
}

function IconButton({
  onPress,
  children,
  white = false,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  white?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-12 w-12 rounded-2xl items-center justify-center ${
        white ? 'bg-white/90' : 'bg-white border border-gray-200'
      }`}
      style={white ? { backdropFilter: 'blur(8px)' as any } : undefined}
    >
      {children}
    </Pressable>
  );
}

export function SermonDetailScreen({ onPlayMedia }: SermonDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: sermons, status } = useAppSelector((state) => state.sermons);
  const { sermonId, from } = useLocalSearchParams<{
    sermonId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const sermon = useMemo(
    () => sermons.find((s) => s.id === sermonId) || sermons[0],
    [sermons, sermonId],
  );

  const related = useMemo(
    () =>
      sermons
        .filter((s) => s.id !== sermon?.id && s.speaker === sermon?.speaker)
        .slice(0, 2),
    [sermons, sermon?.id, sermon?.speaker],
  );

  if (status === 'loading' || !sermon) {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Loading...' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading sermon...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar show={true} title={sermon.title} navigateTo={from} />
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='flex-1'>
          <ScrollView contentContainerClassName='pb-28'>
            {/* Header with thumbnail */}
            <View className='relative'>
              <Image
                source={{ uri: sermon.thumbnail }}
                resizeMode='cover'
                className='w-full h-56'
              />

              {/* LIVE badge */}
              {sermon.isLive && (
                <View className='absolute top-4 left-4'>
                  <BadgePill text='🔴 LIVE' variant='live' />
                </View>
              )}

              {/* Play overlay */}
              <View className='absolute inset-0 items-center justify-center'>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/media-player/[id]',
                      params: {
                        id: sermon.id,
                        from: `sermons/sermon.id`,
                      },
                    })
                  }
                  // onPress={() => onPlayMedia?.(sermon.id)}
                  className='h-16 w-16 rounded-full bg-white/90 items-center justify-center'
                >
                  <Play size={32} color='#4f46e5' />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <View className='bg-white -mt-6 rounded-t-3xl px-4 pt-6 pb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-4'>
                {sermon.title}123
              </Text>

              {/* Sermon Info */}
              <View className='gap-3 mb-6'>
                <View className='flex-row items-center gap-2'>
                  <User size={16} color='#6b7280' />
                  <Text className='text-sm font-medium text-gray-700'>
                    {sermon.speaker}
                  </Text>
                </View>

                <View className='flex-row items-center flex-wrap'>
                  <View className='flex-row items-center gap-2'>
                    <Calendar size={16} color='#6b7280' />
                    <Text className='text-sm text-gray-700'>{sermon.date}</Text>
                  </View>

                  <Text className='text-sm text-gray-400 mx-2'>•</Text>

                  <View className='flex-row items-center gap-2'>
                    <Clock size={16} color='#6b7280' />
                    <Text className='text-sm text-gray-700'>
                      {sermon.duration}
                    </Text>
                  </View>
                </View>

                <View className='flex-row items-center gap-2'>
                  <Tag size={16} color='#6b7280' />
                  <BadgePill text={sermon.topic} />
                </View>
              </View>

              {/* Church */}
              <View className='mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                <Text className='text-sm text-gray-500 mb-1'>Church</Text>
                <Text className='font-medium text-gray-900'>
                  {sermon.church}
                </Text>
              </View>

              {/* Scripture References */}
              <View className='mb-6'>
                <Text className='font-semibold text-gray-900 mb-3'>
                  Scripture References
                </Text>
                <View className='gap-2'>
                  {['Romans 12:1-2', 'Matthew 6:33'].map((ref) => (
                    <View
                      key={ref}
                      className='p-3 bg-indigo-50 rounded-2xl border border-indigo-100'
                    >
                      <Text className='text-sm font-medium text-indigo-900'>
                        {ref}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Sermon Notes */}
              <View className='mb-6'>
                <Text className='font-semibold text-gray-900 mb-3'>
                  Sermon Notes
                </Text>
                <View className='p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                  <Text className='text-sm text-gray-700 leading-relaxed mb-3'>
                    In this powerful message, {sermon.speaker} explores the
                    theme of {String(sermon.topic).toLowerCase()} and how it
                    applies to our daily walk with God.
                  </Text>

                  <Text className='text-sm text-gray-700 leading-relaxed'>
                    Key takeaways:
                  </Text>

                  <View className='mt-2 gap-2'>
                    {[
                      "Trust in God's timing and provision",
                      'Walking by faith, not by sight',
                      'Building our foundation on Christ',
                    ].map((t) => (
                      <View key={t} className='flex-row items-start gap-2'>
                        <Text className='text-indigo-600 mt-0.5'>•</Text>
                        <Text className='text-sm text-gray-700 flex-1'>
                          {t}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Related Sermons */}
              <View>
                <Text className='font-semibold text-gray-900 mb-3'>
                  More from {sermon.speaker}
                </Text>

                <View className='gap-3'>
                  {related.length === 0 ? (
                    <View className='p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                      <Text className='text-sm text-gray-600'>
                        No related sermons found.
                      </Text>
                    </View>
                  ) : (
                    related.map((rs) => (
                      <Pressable
                        key={rs.id}
                        onPress={() =>
                          router.push({
                            pathname: '/media-player/[id]',
                            params: {
                              id: rs.id,
                              from: 'sermons/global-sermons',
                            },
                          })
                        }
                        className='flex-row gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200'
                      >
                        <Image
                          source={{ uri: rs.thumbnail }}
                          resizeMode='cover'
                          className='w-20 h-20 rounded-2xl'
                        />
                        <View className='flex-1'>
                          <Text className='font-medium text-sm text-gray-900 mb-1'>
                            {rs.title}
                          </Text>
                          <Text className='text-xs text-gray-500'>
                            {rs.date} • {rs.duration}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed bottom actions */}
          <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4'>
            <View className='flex-row gap-3'>
              <IconButton onPress={() => {}}>
                <Bookmark size={20} color='#111827' />
              </IconButton>

              <IconButton onPress={() => {}}>
                <Share2 size={20} color='#111827' />
              </IconButton>

              <Pressable
                 onPress={() =>
                          router.push({
                            pathname: '/media-player/[id]',
                            params: {
                              id: sermon.id,
                              from: 'sermons/global-sermons',
                            },
                          })
                        }
                className='flex-1 h-12 rounded-2xl bg-indigo-600 items-center justify-center flex-row'
              >
                <Play size={18} color='#ffffff' />
                <Text className='text-white font-semibold ml-2'>
                  Play Sermon
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
