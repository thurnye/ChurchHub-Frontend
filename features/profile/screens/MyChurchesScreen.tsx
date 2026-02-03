import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Navigation, Clock } from 'lucide-react-native';
import { useEffect } from 'react';

import { Button, Card, CardContent, Badge } from '@/shared/components/ui';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchChurches } from '../../church/redux/slices/church.slice';

export function MyChurchesScreen() {
  const dispatch = useAppDispatch();
  const { items: churches, status } = useAppSelector((state) => state.church);
  const { from } = useLocalSearchParams<{
    from: string;
  }>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchChurches());
  }, [dispatch]);

  // Mock: User follows first 3 churches
  const followedChurches = churches.slice(0, 3);

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='My Churches' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  const handleNavigateToChurch = (churchId: string) => {
    router.push(`/(tabs)/church/${churchId}`);
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='My Churches' navigateTo={from} />

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        <View className='gap-3'>
          {followedChurches.map((church) => (
            <Card key={church.id}>
              <CardContent>
                <View className='flex-row items-start gap-3 mb-3'>
                  <Image
                    source={{ uri: church.image }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                    contentFit='cover'
                  />
                  <View className='flex-1'>
                    <Text className='font-semibold text-gray-900 mb-1'>
                      {church.name}
                    </Text>
                    <Badge variant='secondary' className='self-start mb-2'>
                      <Text className='text-xs text-gray-700'>
                        {church.denomination}
                      </Text>
                    </Badge>
                    <View className='flex-row items-center gap-1'>
                      <Clock size={14} color='#6b7280' />
                      <Text className='text-sm text-gray-600'>
                        {church.nextService}
                      </Text>
                    </View>
                  </View>
                  <Pressable className='w-10 h-10 items-center justify-center'>
                    <Heart size={20} color='#dc2626' fill='#dc2626' />
                  </Pressable>
                </View>
                <View className='flex-row gap-2'>
                  <Button
                    size='sm'
                    onPress={() => handleNavigateToChurch(church.id)}
                    className='flex-1'
                  >
                    <Text className='text-white text-sm font-medium'>
                      View Church
                    </Text>
                  </Button>
                  <Button size='sm' variant='outline'>
                    <View className='flex-row items-center gap-1'>
                      <Navigation size={14} color='#111827' />
                      <Text className='text-gray-900 text-sm font-medium'>
                        Directions
                      </Text>
                    </View>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {followedChurches.length === 0 && (
          <View className='items-center py-12'>
            <Heart size={48} color='#9ca3af' />
            <Text className='text-gray-500 mt-4 text-center'>
              You haven't followed any churches yet.{'\n'}
              Tap the heart icon on a church to follow it.
            </Text>
          </View>
        )}

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
