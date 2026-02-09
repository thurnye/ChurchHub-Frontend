import { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Play,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  User,
  Tag,
} from 'lucide-react-native';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/app.hooks';
import { fetchSermonById, clearSelected } from '../redux/slices/sermons.slice';

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
  const { selected: sermon, selectedStatus, items: sermons } = useAppSelector(
    (state) => state.sermons,
  );
  const { sermonId, from } = useLocalSearchParams<{
    sermonId: string;
    from: string;
  }>();

  // Fetch sermon when screen gains focus (including when returning from media player)
  useFocusEffect(
    useCallback(() => {
      if (sermonId) {
        dispatch(fetchSermonById(sermonId));
      }

      // Only clear when navigating away from this screen entirely
      return () => {
        // Don't clear here - let the data persist for media player
      };
    }, [dispatch, sermonId]),
  );

  // Get related sermons from the same speaker
  const related = sermons
    .filter((s) => s._id !== sermon?._id && s.speaker === sermon?.speaker)
    .slice(0, 2);

  // Format duration from seconds to readable format
  const formatDuration = useCallback((seconds?: number) => {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Format date
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }, []);

  if (selectedStatus === 'loading' || !sermon) {
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

  if (selectedStatus === 'failed') {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Error' navigateTo={from} />
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-gray-600 text-center'>
            Failed to load sermon. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  const primaryTag = sermon.tags?.[0] || 'General';

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar show={true} title={sermon.title} navigateTo={from} />
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='flex-1'>
          <ScrollView contentContainerClassName='pb-28'>
            {/* Header with thumbnail */}
            <View className='relative'>
              <Image
                source={{ uri: sermon.thumbnailUrl }}
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
                        id: sermon._id,
                        from: `sermons/${sermon._id}`,
                      },
                    })
                  }
                  className='h-16 w-16 rounded-full bg-white/90 items-center justify-center'
                >
                  <Play size={32} color='#4f46e5' />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <View className='bg-white -mt-6 rounded-t-3xl px-4 pt-6 pb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-4'>
                {sermon.title}
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
                    <Text className='text-sm text-gray-700'>
                      {formatDate(sermon.date)}
                    </Text>
                  </View>

                  {sermon.duration && (
                    <>
                      <Text className='text-sm text-gray-400 mx-2'>•</Text>
                      <View className='flex-row items-center gap-2'>
                        <Clock size={16} color='#6b7280' />
                        <Text className='text-sm text-gray-700'>
                          {formatDuration(sermon.duration)}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {sermon.tags && sermon.tags.length > 0 && (
                  <View className='flex-row items-center gap-2 flex-wrap'>
                    <Tag size={16} color='#6b7280' />
                    {sermon.tags.map((tag) => (
                      <BadgePill key={tag} text={tag} />
                    ))}
                  </View>
                )}
              </View>

              {/* View Count */}
              {sermon.viewCount > 0 && (
                <View className='mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                  <Text className='text-sm text-gray-500 mb-1'>Views</Text>
                  <Text className='font-medium text-gray-900'>
                    {sermon.viewCount.toLocaleString()}
                  </Text>
                </View>
              )}

              {/* Scripture References */}
              {sermon.scriptureReferences && sermon.scriptureReferences.length > 0 && (
                <View className='mb-6'>
                  <Text className='font-semibold text-gray-900 mb-3'>
                    Scripture References
                  </Text>
                  <View className='gap-2'>
                    {sermon.scriptureReferences.map((ref) => (
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
              )}

              {/* Sermon Notes / Description */}
              <View className='mb-6'>
                <Text className='font-semibold text-gray-900 mb-3'>
                  {sermon.notes ? 'Sermon Notes' : 'About This Sermon'}
                </Text>
                <View className='p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                  {sermon.notes || sermon.description ? (
                    <Text className='text-sm text-gray-700 leading-relaxed'>
                      {sermon.notes || sermon.description}
                    </Text>
                  ) : (
                    <>
                      <Text className='text-sm text-gray-700 leading-relaxed mb-3'>
                        In this message, {sermon.speaker} explores the theme of{' '}
                        {primaryTag.toLowerCase()} and how it applies to our
                        daily walk with God.
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
                    </>
                  )}
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
                        key={rs._id}
                        onPress={() =>
                          router.push({
                            pathname: '/sermons/[sermonId]',
                            params: {
                              sermonId: rs._id,
                              from: from || 'worship',
                            },
                          })
                        }
                        className='flex-row gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200'
                      >
                        <Image
                          source={{ uri: rs.thumbnailUrl }}
                          resizeMode='cover'
                          className='w-20 h-20 rounded-2xl'
                        />
                        <View className='flex-1'>
                          <Text className='font-medium text-sm text-gray-900 mb-1'>
                            {rs.title}
                          </Text>
                          <Text className='text-xs text-gray-500'>
                            {formatDate(rs.date)} • {formatDuration(rs.duration)}
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
                      id: sermon._id,
                      from: `sermons/${sermon._id}`,
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
