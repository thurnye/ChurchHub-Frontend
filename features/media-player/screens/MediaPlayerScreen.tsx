// MediaPlayerScreen.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { cn } from '@/shared/utils/cn';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MessageCircle,
  Users,
  Ellipsis,
  ChevronDown,
  List,
} from 'lucide-react-native';

import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpNextModal } from '../components/UpNextModal';
import { MediaOptionsModal } from '../components/MediaOptionsModal';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchMediaItems } from '../redux/slices/media-player.slice';

export function MediaPlayerScreen() {
  const dispatch = useAppDispatch();
  const { items: sermons, status } = useAppSelector((state) => state.mediaPlayer);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();

  useEffect(() => {
    dispatch(fetchMediaItems());
  }, [dispatch]);

  const sermon = useMemo(
    () => sermons.find((s) => s.id === id) || sermons[0],
    [sermons, id],
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(12);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  if (status === 'loading' || !sermon) {
    return (
      <View className='flex-1 bg-gray-900 items-center justify-center'>
        <ActivityIndicator size='large' color='#ffffff' />
      </View>
    );
  }

  const isLive = !!sermon.isLive;
  const viewerCount = isLive ? 342 : undefined;

  const closePlayer = () => {
    try {
      // @ts-ignore
      if (router.canDismiss?.()) {
        // @ts-ignore
        router.dismiss();
        return;
      }
    } catch {}
    router.replace(from as any);
  };

  // when user taps an Up Next item, replace the route param
  const handleSelectNext = (nextId: string) => {
    setQueueOpen(false);

    // optional: reset progress / autoplay
    setProgress(0);
    setIsPlaying(true);

    router.setParams({ id: nextId });
  };

  return (
    <View className='flex-1 bg-gray-900'>
      <View style={{ paddingTop: insets.top }} className={cn('bg-gray-900')}>
        <View className='flex-row items-center justify-between px-4 h-14'>
          <Pressable
            onPress={closePlayer}
            className='w-10 h-10 rounded-full items-center justify-center'
            accessibilityRole='button'
            accessibilityLabel='Close player'
          >
            <ChevronDown size={22} color='#d1d5db' />
          </Pressable>

          <View className='flex-row items-center gap-1'>
            <Pressable
              onPress={() => setActionsOpen(true)}
              className='w-10 h-10 items-center justify-center rounded-full'
              accessibilityRole='button'
              accessibilityLabel='More options'
            >
              <Ellipsis size={22} color='#d1d5db' />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <ScrollView contentContainerClassName='pb-10'>
          <View className='relative h-[60vh] bg-black items-center justify-center'>
            <Image
              source={{ uri: sermon.thumbnail }}
              className={`absolute inset-0 w-full h-full ${ !isPlaying && "opacity-40"}`}
              resizeMode='cover'
            />

            {isLive && (
              <View className='absolute top-2 left-2 flex-row gap-3'>
                <View className='px-3 py-1 rounded-full bg-red-600'>
                  <Text className='text-white font-semibold text-xs'>🔴 LIVE</Text>
                </View>

                {!!viewerCount && (
                  <View
                    className='px-3 py-1 rounded-full flex-row items-center'
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <Users size={14} color='#fff' />
                    <Text className='text-white text-xs ml-1'>
                      {viewerCount} watching
                    </Text>
                  </View>
                )}
              </View>
            )}

            {!isPlaying && (
              <Pressable
              onPress={() => setIsPlaying((p) => !p)}
              className='w-20 h-20 rounded-full items-center justify-center'
              style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
              accessibilityRole='button'
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
              <View className='ml-1'>
                <Play size={40} color='#4f46e5' />
              </View>
              </Pressable>
            )}
          </View>

          <View className='w-full  px-6 pt-6'>
            <View className='mb-6'>
              <View className='flex-row items-center justify-between'>
                <Text className='text-white text-xl font-bold mb-2 flex-1 pr-3'>
                  {sermon.title}
                </Text>

                <Pressable
                  onPress={() => setQueueOpen(true)}
                  className='w-10 h-10  rounded-full'
                  accessibilityRole='button'
                  accessibilityLabel='Open Up Next'
                >
                  <List size={22} color='#d1d5db' />
                </Pressable>
              </View>

              <View className='flex-row items-center gap-2'>
                <Text className='text-gray-300 text-sm'>{sermon.speaker}</Text>
                <Text className='text-gray-400 text-sm'>•</Text>
                <Text className='text-gray-300 text-sm'>{sermon.church}</Text>
              </View>
            </View>

            {!isLive && (
              <View className='mb-6'>
                <Slider
                  value={progress}
                  onValueChange={setProgress}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  minimumTrackTintColor='#4f46e5'
                  maximumTrackTintColor='#374151'
                  thumbTintColor='#ffffff'
                />
                <View className='flex-row justify-between mt-2'>
                  <Text className='text-gray-400 text-xs'>12:34</Text>
                  <Text className='text-gray-400 text-xs'>{sermon.duration}</Text>
                </View>
              </View>
            )}

            <View className='flex-row items-center justify-center gap-6 mb-6'>
              <Pressable
                disabled={isLive}
                onPress={() => {}}
                className='h-12 w-12 rounded-full items-center justify-center'
                style={{
                  backgroundColor: isLive
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.12)',
                  opacity: isLive ? 0.5 : 1,
                }}
              >
                <SkipBack size={24} color='#fff' />
              </Pressable>

              <Pressable
                onPress={() => setIsPlaying((p) => !p)}
                className='h-14 w-14 rounded-full items-center justify-center bg-indigo-600'
              >
                {isPlaying ? <Pause size={24} color='#fff' /> : <Play size={24} color='#fff' />}
              </Pressable>

              <Pressable
                disabled={isLive}
                onPress={() => {}}
                className='h-12 w-12 rounded-full items-center justify-center'
                style={{
                  backgroundColor: isLive
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.12)',
                  opacity: isLive ? 0.5 : 1,
                }}
              >
                <SkipForward size={24} color='#fff' />
              </Pressable>
            </View>

            {isLive && (
              <View className='mb-6'>
                <Pressable
                  onPress={() => {}}
                  className='w-full h-12 rounded-xl border border-gray-600 items-center justify-center flex-row'
                >
                  <MessageCircle size={18} color='#fff' />
                  <Text className='text-white font-semibold ml-2'>Open Live Chat</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>

      <MediaOptionsModal actionsOpen={actionsOpen} setActionsOpen={setActionsOpen} />

      <UpNextModal
        queueOpen={queueOpen}
        setQueueOpen={setQueueOpen}
        onSelect={handleSelectNext}
      />
    </View>
  );
}
