import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect, useCallback } from 'react';
import { Play, Clock, Book, Radio } from 'lucide-react-native';

import { TopBar } from '@/shared/components/TopBar';
import { Card, CardContent, Badge } from '@/shared/components/ui';
import { devotionals } from '@/data/mockData';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import {
  fetchSermons,
  fetchMoreSermons,
  fetchTags,
  resetPagination,
} from '@/features/sermons/redux/slices/sermons.slice';
import type { SermonItem } from '@/features/sermons/types/sermon.types';

const defaultTopics = ['All', 'Faith', 'Prayer', 'Community', 'Hope', 'Love', 'Justice'];

export function WorshipScreen() {
  const dispatch = useAppDispatch();
  const {
    items: sermons,
    tags: apiTags,
    selectedTag,
    status,
    hasMore,
    loadingMore,
  } = useAppSelector((state) => state.sermons);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchSermons());
    dispatch(fetchTags());
  }, [dispatch]);

  // Use API tags if available, otherwise use defaults
  const topics = [...defaultTopics];

  // Current selected topic (from state or 'All')
  const currentTopic = selectedTag || 'All';

  // Filter for live sermons (if any have isLive property - backend sermons don't have this)
  const liveSermons = sermons.filter((s: any) => s.isLive);

  // Non-live sermons for the library
  const librarySermons = sermons.filter((s: any) => !s.isLive);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetPagination());
    const tag = currentTopic === 'All' ? undefined : currentTopic;
    await dispatch(fetchSermons({ tag, refresh: true }));
    setRefreshing(false);
  }, [dispatch, currentTopic]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && status !== 'loading') {
      const tag = currentTopic === 'All' ? undefined : currentTopic;
      dispatch(fetchMoreSermons({ tag }));
    }
  }, [dispatch, hasMore, loadingMore, status, currentTopic]);

  const handleTopicChange = useCallback(
    (topic: string) => {
      dispatch(resetPagination());
      const tag = topic === 'All' ? undefined : topic;
      dispatch(fetchSermons({ tag, refresh: true }));
    },
    [dispatch],
  );

  // Format duration from seconds to "MM:SS" or "HH:MM:SS"
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const renderSermonCard = useCallback(
    ({ item: sermon }: { item: SermonItem }) => (
      <Card className="mx-4 mb-3">
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/sermons/[sermonId]',
              params: {
                sermonId: sermon._id,
                from: 'worship',
              },
            })
          }
        >
          <CardContent>
            <View className="flex-row gap-3">
              <View className="relative overflow-hidden rounded-lg">
                <Image
                  source={{ uri: sermon.thumbnailUrl }}
                  style={{ width: 96, height: 96 }}
                  contentFit="cover"
                />
                <View className="absolute inset-0 items-center justify-center bg-black/30">
                  <View className="w-10 h-10 bg-white/90 rounded-full items-center justify-center">
                    <Play size={18} color="#111827" fill="#111827" />
                  </View>
                </View>
              </View>
              <View className="flex-1">
                {sermon.tags && sermon.tags.length > 0 && (
                  <Badge variant="secondary" className="self-start mb-1">
                    <Text className="text-xs text-gray-700">{sermon.tags[0]}</Text>
                  </Badge>
                )}
                <Text className="font-semibold text-gray-900 mb-1" numberOfLines={2}>
                  {sermon.title}
                </Text>
                <Text className="text-sm text-gray-600">{sermon.speaker}</Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <Clock size={12} color="#9ca3af" />
                  <Text className="text-xs text-gray-400">{formatDuration(sermon.duration)}</Text>
                  <Text className="text-gray-300">•</Text>
                  <Text className="text-xs text-gray-400">{formatDate(sermon.date)}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Pressable>
      </Card>
    ),
    [],
  );

  const renderHeader = useCallback(
    () => (
      <>
        {/* Live Now Section */}
        {liveSermons.length > 0 && (
          <View className="px-4 pt-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Radio size={18} color="#dc2626" />
              <Text className="font-semibold text-lg text-gray-900">Live Now</Text>
            </View>
            {liveSermons.map((sermon: any) => (
              <Card key={sermon._id || sermon.id} className="mb-4">
                <View className="relative">
                  <Image
                    source={{ uri: sermon.thumbnailUrl || sermon.thumbnail }}
                    style={{ width: '100%', height: 192 }}
                    contentFit="cover"
                  />
                  <View className="absolute top-3 left-3">
                    <Badge className="bg-red-600">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-white rounded-full mr-1.5" />
                        <Text className="text-white text-xs font-medium">LIVE</Text>
                      </View>
                    </Badge>
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/media-player/[id]',
                        params: { id: sermon._id || sermon.id, from: 'worship' },
                      })
                    }
                    className="absolute inset-0 items-center justify-center bg-black/30"
                  >
                    <View className="w-16 h-16 bg-white/90 rounded-full items-center justify-center">
                      <Play size={32} color="#111827" fill="#111827" />
                    </View>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/media-player/[id]',
                      params: { id: sermon._id || sermon.id, from: 'worship' },
                    })
                  }
                >
                  <CardContent>
                    <Text className="font-semibold text-gray-900 mb-1">{sermon.title}</Text>
                    <Text className="text-sm text-gray-500">{sermon.speaker}</Text>
                  </CardContent>
                </Pressable>
              </Card>
            ))}
          </View>
        )}

        {/* Daily Devotional */}
        <View className="px-4 py-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Book size={18} color="#4f46e5" />
            <Text className="font-semibold text-lg text-gray-900">Daily Devotional</Text>
          </View>
          <Card className="bg-indigo-50 border-indigo-100">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/church/devotion/[devotionalId]',
                  params: { devotionalId: devotionals[0].id, from: 'worship' },
                })
              }
            >
              <CardContent>
                <Text className="text-xs text-indigo-600 font-medium mb-1">
                  {devotionals[0].verse}
                </Text>
                <Text className="text-base text-gray-900 italic mb-3">
                  "{devotionals[0].verseText}"
                </Text>
                <Text className="text-sm text-gray-600 mb-2">{devotionals[0].reflection}</Text>
                <Text className="text-xs text-gray-500">{devotionals[0].date}</Text>
              </CardContent>
            </Pressable>
          </Card>
        </View>

        {/* Topic Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={topics}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          className="border-t border-gray-100"
          renderItem={({ item: topic }) => (
            <Pressable
              onPress={() => handleTopicChange(topic)}
              className={`px-4 py-2 rounded-full mr-2 ${
                currentTopic === topic ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  currentTopic === topic ? 'text-white' : 'text-gray-700'
                }`}
              >
                {topic}
              </Text>
            </Pressable>
          )}
        />

        {/* Sermon Library Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="font-semibold text-lg text-gray-900">Sermon Library</Text>
          <Text className="text-sm text-gray-500 mt-1">
            {librarySermons.length} sermons{currentTopic !== 'All' ? ` in "${currentTopic}"` : ''}
          </Text>
        </View>
      </>
    ),
    [liveSermons, topics, currentTopic, librarySermons.length, handleTopicChange],
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#4f46e5" />
        </View>
      );
    }
    if (!hasMore && librarySermons.length > 0) {
      return (
        <View className="py-6 items-center">
          <Text className="text-gray-400 text-sm">No more sermons</Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, librarySermons.length]);

  const renderEmpty = useCallback(() => {
    if (status === 'loading') return null;
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-gray-500 text-center">
          No sermons found{currentTopic !== 'All' ? ` for "${currentTopic}"` : ''}.
        </Text>
      </View>
    );
  }, [status, currentTopic]);

  if (status === 'loading' && sermons.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <TopBar title="Worship" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-600 mt-4">Loading worship content...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Worship" />

      <FlatList
        data={librarySermons}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderSermonCard}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4f46e5']}
            tintColor="#4f46e5"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      />
    </View>
  );
}
