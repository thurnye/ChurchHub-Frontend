import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Heart, Check, Plus } from 'lucide-react-native';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchPrayerItems } from '../redux/slices/prayer.slice';

interface PrayerRequestListScreenProps {}

type Filter = 'all' | 'praying' | 'answered';
type VisibilityKey =
  | 'everyone'
  | 'pastor_only'
  | 'clergy'
  | 'groups'
  | 'church_units';

const visibilityShortLabels: Record<VisibilityKey, string> = {
  everyone: 'Everyone',
  pastor_only: 'Pastor Only',
  clergy: 'Clergy',
  groups: 'Groups',
  church_units: 'Church Units',
};

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${
        active ? 'bg-indigo-600' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OutlineBadge({ text }: { text: string }) {
  return (
    <View className='px-3 py-1.5 rounded-full border border-gray-200 bg-white'>
      <Text className='text-xs text-gray-700'>{text}</Text>
    </View>
  );
}

function SuccessBadge() {
  return (
    <View className='flex-row items-center px-3 py-1.5 rounded-full bg-green-100'>
      <Check size={14} color='#15803d' />
      <Text className='ml-2 text-xs font-medium text-green-700'>Answered</Text>
    </View>
  );
}

export function PrayerRequestListScreen({}: PrayerRequestListScreenProps) {
  const dispatch = useAppDispatch();
  const { items: prayerRequests, status } = useAppSelector((state) => state.prayer);
  const { from } = useLocalSearchParams<{
    from: string;
  }>();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    dispatch(fetchPrayerItems());
  }, [dispatch]);

  const filteredPrayers = useMemo(() => {
    return prayerRequests.filter((prayer) => {
      if (filter === 'all') return true;
      return prayer.status === filter;
    });
  }, [prayerRequests, filter]);

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Prayer Requests' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading prayers...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar
        show={true}
        title={`My Prayer Requests`}
        navigateTo={from}
      />
      <View className='bg-white border-b border-gray-200 px-4 py-3'>
        {/* <View className='flex-row items-center justify-between mb-3'>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/prayer/request-prayer',
                params: {
                  from: '/prayer/prayer-list',
                },
              })
            }
            className='px-4 py-2 rounded-xl bg-indigo-600 flex-row items-center'
          >
            <Plus size={16} color='#ffffff' />
            <Text className='text-white font-semibold ml-2'>New</Text>
          </Pressable>
        </View> */}

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName='gap-2'
        >
          <Chip
            label='All Requests'
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <Chip
            label='Praying'
            active={filter === 'praying'}
            onPress={() => setFilter('praying')}
          />
          <Chip
            label='Answered'
            active={filter === 'answered'}
            onPress={() => setFilter('answered')}
          />
        </ScrollView>
      </View>

      {/* List */}
      {filteredPrayers.length > 0 ? (
        <ScrollView contentContainerClassName='p-4 pb-28'>
          <View className='gap-3'>
            {filteredPrayers.map((prayer) => {
              const answered = prayer.status === 'answered';

              return (
                <Pressable
                  key={prayer.id}
                  onPress={() =>
                    router.push({
                      pathname: '/prayer/prayer-details',
                      params: {
                        prayerId: prayer.id,
                        from: '/prayer/prayer-list',
                      },
                    })
                  }
                  className='bg-white rounded-2xl p-4 shadow-sm'
                >
                  <View className='flex-row items-start justify-between mb-2'>
                    <View className='flex-1 pr-3'>
                      <Text className='font-semibold text-gray-900 mb-1'>
                        {prayer.title}
                      </Text>

                      <Text
                        className='text-sm text-gray-600 mb-2'
                        numberOfLines={2}
                      >
                        {prayer.message}
                      </Text>
                    </View>

                    {answered && <SuccessBadge />}
                  </View>

                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center flex-wrap'>
                      <Text className='text-xs text-gray-500'>
                        {prayer.submittedBy}
                      </Text>
                      <Text className='text-xs text-gray-500'> • </Text>
                      <Text className='text-xs text-gray-500'>
                        {prayer.timestamp}
                      </Text>
                    </View>

                    <View className='flex-row items-center gap-1'>
                      <Heart size={14} color='#4f46e5' fill='#4f46e5' />
                      <Text className='text-xs text-gray-500'>
                        {prayer.responseCount} praying
                      </Text>
                    </View>
                  </View>

                  {/* Visibility indicators */}
                  <View className='mt-3 flex-row flex-wrap gap-2'>
                    {(prayer.visibility as VisibilityKey[]).map((v, index) => (
                      <OutlineBadge
                        key={`${v}-${index}`}
                        text={visibilityShortLabels[v] ?? v}
                      />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerClassName='flex-1 items-center justify-center py-12 px-4 pb-28'>
          <View className='w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4'>
            <Heart size={32} color='#9ca3af' />
          </View>
          <Text className='text-gray-500 text-center mb-2'>
            No prayer requests
          </Text>
          <Text className='text-sm text-gray-400 text-center mb-4'>
            Be the first to share a prayer request
          </Text>

          <Pressable
            onPress={() => console.log('prayer sent')}
            className='px-5 py-3 rounded-2xl bg-indigo-600 flex-row items-center'
          >
            <Plus size={18} color='#ffffff' />
            <Text className='text-white font-semibold ml-2'>
              Submit Prayer Request
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* FAB */}
      <View className='absolute bottom-6 right-4'>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/prayer/request-prayer',
              params: {
                from: '/prayer/prayer-list',
              },
            })
          }
          className='w-14 h-14 rounded-full bg-indigo-600 items-center justify-center'
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <Plus size={24} color='#ffffff' />
        </Pressable>
      </View>
    </View>
  );
}
