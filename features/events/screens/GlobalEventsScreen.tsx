import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react-native';
import { Button, Card, CardContent, Badge } from '@/shared/components/ui';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchEvents } from '../redux/slices/events.slice';

interface GlobalEventsScreenProps {}

type FilterKey =
  | 'All'
  | 'This Week'
  | 'This Month'
  | 'Pentecostal'
  | 'Anglican';

const filters: FilterKey[] = [
  'All',
  'This Week',
  'This Month',
  'Pentecostal',
  'Anglican',
];

export function GlobalEventsScreen({}: GlobalEventsScreenProps) {
  const dispatch = useAppDispatch();
  const { items: events, status, error } = useAppSelector((state) => state.events);
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'All') return events;

    if (activeFilter === 'Pentecostal' || activeFilter === 'Anglican') {
      return events.filter((e) => e.denomination === activeFilter);
    }

    return events;
  }, [events, activeFilter]);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Events' />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Loading State */}
        {status === 'loading' && (
          <View className='flex-1 items-center justify-center py-20'>
            <ActivityIndicator size='large' color='#4f46e5' />
            <Text className='text-gray-600 mt-4'>Loading events...</Text>
          </View>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <View className='flex-1 items-center justify-center py-20 px-4'>
            <Text className='text-red-600 text-center mb-4'>{error}</Text>
            <Pressable
              onPress={() => dispatch(fetchEvents())}
              className='px-6 py-3 bg-indigo-600 rounded-full'
            >
              <Text className='text-white font-semibold'>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        {status === 'succeeded' && (
          <>
            {/* Filters */}
            <View className='bg-white px-4 py-3 border-b border-gray-200'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='-mx-4 px-4'
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            {filters.map((f) => {
              const active = activeFilter === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  className={[
                    'px-4 py-1.5 rounded-full',
                    active ? 'bg-indigo-600' : 'bg-gray-100',
                  ].join(' ')}
                >
                  <Text
                    className={[
                      'text-sm font-medium whitespace-nowrap',
                      active ? 'text-white' : 'text-gray-700',
                    ].join(' ')}
                  >
                    {f}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Events List */}
        <View className='p-4 gap-3'>
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className='p-0'>
                {/* Main row */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/events/[eventId]',
                      params: {
                        eventId: event.id,
                        from: 'events/global-events',
                      },
                    })
                  }
                >
                  <View className='flex-row gap-3 p-4'>
                    <Image
                      source={{ uri: event.image }}
                      className='w-20 h-20 rounded-lg'
                      resizeMode='cover'
                    />

                    <View className='flex-1'>
                      <Text
                        className='font-semibold text-gray-900 mb-1'
                        numberOfLines={1}
                      >
                        {event.title}
                      </Text>

                      <Text
                        className='text-sm text-gray-600 mb-2'
                        numberOfLines={1}
                      >
                        {event.church}
                      </Text>

                      <View className='flex-row items-center gap-2 mb-2'>
                        <View className='flex-row items-center gap-1'>
                          <Calendar size={12} color='#6b7280' />
                          <Text className='text-xs text-gray-500'>
                            {event.date}
                          </Text>
                        </View>

                        <View className='flex-row items-center gap-1'>
                          <Clock size={12} color='#6b7280' />
                          <Text className='text-xs text-gray-500'>
                            {event.time}
                          </Text>
                        </View>
                      </View>

                      <Badge variant='secondary'>
                        <Text className='text-xs text-gray-700'>
                          {event.denomination}
                        </Text>
                      </Badge>
                    </View>
                  </View>
                </Pressable>

                {/* Actions */}
                <View className='border-t border-gray-100 p-3 flex-row gap-2'>
                  <View className='flex-1'>
                    <Button size='sm' className='w-full'>
                      <Text className='text-white font-medium'>RSVP</Text>
                    </Button>
                  </View>

                  <View className='flex-1'>
                    <Button size='sm' variant='outline' className='w-full'>
                      <View className='flex-row items-center justify-center gap-1'>
                        <MapPin size={14} color='#111827' />
                        <Text className='text-sm text-gray-900 font-medium'>
                          Directions
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

            {/* Bottom padding */}
            <View className='h-20' />
          </>
        )}
      </ScrollView>
    </View>
  );
}
