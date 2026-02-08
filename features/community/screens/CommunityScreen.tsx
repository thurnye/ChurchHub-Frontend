import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect, useCallback } from 'react';
import { Heart, Users, Mail, ChevronRight } from 'lucide-react-native';

import { TopBar } from '@/shared/components/TopBar';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import {
  fetchCommunityItems,
  fetchMoreCommunityItems,
  fetchCategories,
  resetPagination,
} from '../redux/slices/community.slice';
import type { CommunityProgram } from '../types/community.types';

const defaultCategories = [
  'All',
  'Outreach & Charity',
  'Health & Counseling',
  'Community Programs',
  'Volunteer Opportunities',
];

export function CommunityScreen() {
  const dispatch = useAppDispatch();
  const {
    items: programs,
    categories: apiCategories,
    status,
    hasMore,
    loadingMore,
  } = useAppSelector((state) => state.community);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCommunityItems());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Use API categories if available, otherwise use defaults
  const categories = apiCategories.length > 0 ? ['All', ...apiCategories] : defaultCategories;

  // Ensure programs is always an array
  const safePrograms = programs ?? [];

  const filteredPrograms =
    selectedCategory === 'All'
      ? safePrograms
      : safePrograms.filter((p) => p.category === selectedCategory);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(resetPagination());
    await dispatch(fetchCommunityItems({ refresh: true }));
    setRefreshing(false);
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && status !== 'loading') {
      dispatch(fetchMoreCommunityItems());
    }
  }, [dispatch, hasMore, loadingMore, status]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    // Note: For server-side filtering, you'd dispatch with category param here
    // dispatch(resetPagination());
    // dispatch(fetchCommunityItems({ category: category === 'All' ? undefined : category, refresh: true }));
  }, []);

  const renderProgramCard = useCallback(({ item: program }: { item: CommunityProgram }) => (
    <Card className="mx-4 mb-4">
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/community/[id]',
            params: {
              id: program._id,
              from: 'community',
            },
          })
        }
      >
        {program.image && (
          <View className="relative">
            <Image
              source={{ uri: program.image }}
              style={{ width: '100%', height: 160 }}
              contentFit="cover"
            />
            <View className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90">
                <Text className="text-xs text-gray-700">{program.category}</Text>
              </Badge>
            </View>
          </View>
        )}
      </Pressable>
      <CardContent>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/community/[id]',
              params: {
                id: program._id,
                from: 'community',
              },
            })
          }
        >
          <Text className="font-semibold text-gray-900 text-base mb-2">
            {program.title}
          </Text>
          <Text className="text-sm text-gray-600 mb-4" numberOfLines={3}>
            {program.description}
          </Text>
        </Pressable>

        {/* Show time commitment for volunteer programs */}
        {program.timeCommitment && (
          <Text className="text-xs text-indigo-600 mb-3">
            {program.timeCommitment}
          </Text>
        )}

        <View className="flex-row gap-2">
          {program.contact && (
            <Button variant="outline" size="sm" className="flex-1">
              <View className="flex-row items-center gap-1">
                <Mail size={14} color="#111827" />
                <Text className="text-gray-900 text-sm font-medium">Contact</Text>
              </View>
            </Button>
          )}
          <Button size="sm" className="flex-1">
            <View className="flex-row items-center gap-1">
              <Heart size={14} color="#ffffff" />
              <Text className="text-white text-sm font-medium">Get Involved</Text>
            </View>
          </Button>
        </View>
      </CardContent>
    </Card>
  ), []);

  const renderHeader = useCallback(() => (
    <>
      {/* Header Section */}
      <View className="bg-white px-4 py-6 border-b border-gray-100">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Get Involved
        </Text>
        <Text className="text-sm text-gray-600">
          Discover programs and volunteer opportunities in your community.
        </Text>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        className="bg-white"
        renderItem={({ item: category }) => (
          <Pressable
            onPress={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === category ? 'bg-indigo-600' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}
            >
              {category}
            </Text>
          </Pressable>
        )}
      />

      {/* Results count */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-sm text-gray-500">
          {filteredPrograms.length} programs found
        </Text>
      </View>
    </>
  ), [categories, selectedCategory, filteredPrograms.length, handleCategoryChange]);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#4f46e5" />
        </View>
      );
    }

    if (!hasMore && filteredPrograms.length > 0) {
      return (
        <>
          {/* Volunteer CTA */}
          <View className="px-4 py-6">
            <Card className="bg-indigo-50 border-indigo-100">
              <CardContent>
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
                    <Users size={24} color="#4f46e5" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      Become a Volunteer
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Join our network of volunteers making a difference.
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>
              </CardContent>
            </Card>
          </View>
        </>
      );
    }

    return null;
  }, [loadingMore, hasMore, filteredPrograms.length]);

  const renderEmpty = useCallback(() => {
    if (status === 'loading') return null;

    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-gray-500 text-center">
          No programs found in this category.
        </Text>
      </View>
    );
  }, [status]);

  if (status === 'loading' && programs.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <TopBar title="Community" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-600 mt-4">Loading programs...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Community" />

      <FlatList
        data={filteredPrograms}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={renderProgramCard}
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
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}
