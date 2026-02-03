import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import { useEffect } from 'react';

import { Button, Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchEvents } from '../../events/redux/slices/events.slice';

export function MyEventsScreen() {
  const dispatch = useAppDispatch();
  const { items: events, status } = useAppSelector((state) => state.events);
  const { from } = useLocalSearchParams<{
        from: string;
      }>();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='My Events' navigateTo={from}/>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='My Events' navigateTo={from}/>

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Upcoming RSVPs */}
        <View className='mb-6'>
          <Text className='font-semibold text-gray-900 mb-3'>
            Upcoming RSVPs
          </Text>
          <View className='gap-3'>
            {events.slice(0, 2).map((event) => (
              <Card key={event.id}>
                <CardContent>
                  <View className='flex-row gap-3'>
                    <Image
                      source={{ uri: event.image }}
                      style={{ width: 80, height: 80, borderRadius: 8 }}
                      contentFit='cover'
                    />
                    <View className='flex-1'>
                      <Text className='font-semibold text-gray-900 mb-1'>
                        {event.title}
                      </Text>
                      <Text className='text-sm text-gray-600 mb-2'>
                        {event.church}
                      </Text>
                      <View className='flex-row items-center gap-2'>
                        <Calendar size={12} color='#6b7280' />
                        <Text className='text-xs text-gray-500'>
                          {event.date} at {event.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        {/* Past Events */}
        <View>
          <Text className='font-semibold text-gray-900 mb-3'>Past Events</Text>
          <Button variant='outline' className='w-full'>
            <Text className='text-gray-900 font-medium'>
              View Event History
            </Text>
          </Button>
        </View>

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
