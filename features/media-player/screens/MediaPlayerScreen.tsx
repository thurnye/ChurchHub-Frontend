// MediaPlayerScreen.tsx

import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
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
  Volume2,
  VolumeX,
} from 'lucide-react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpNextModal } from '../components/UpNextModal';
import { MediaOptionsModal } from '../components/MediaOptionsModal';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchSermonById } from '@/features/sermons/redux/slices/sermons.slice';

export function MediaPlayerScreen() {
  const dispatch = useAppDispatch();
  const { selected: sermon, selectedStatus } = useAppSelector((state) => state.sermons);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSermonById(id));
    }
    // Don't clear selected on unmount - SermonDetailScreen manages this
  }, [dispatch, id]);

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  // Toggle mute
  const toggleMute = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  // Seek to position
  const seekTo = async (value: number) => {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(value);
  };

  // Skip forward/backward
  const skip = async (seconds: number) => {
    if (!videoRef.current) return;
    const newPosition = Math.max(0, Math.min(position + seconds * 1000, duration));
    await videoRef.current.setPositionAsync(newPosition);
  };

  // Format time (milliseconds to MM:SS)
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedStatus === 'loading' || !sermon) {
    return (
      <View className='flex-1 bg-gray-900 items-center justify-center'>
        <ActivityIndicator size='large' color='#ffffff' />
        <Text className='text-gray-400 mt-4'>Loading sermon...</Text>
      </View>
    );
  }

  if (selectedStatus === 'failed') {
    return (
      <View className='flex-1 bg-gray-900 items-center justify-center px-4'>
        <Text className='text-white text-lg mb-2'>Failed to load sermon</Text>
        <Text className='text-gray-400 text-center'>Please try again later.</Text>
        <Pressable
          onPress={() => router.back()}
          className='mt-6 px-6 py-3 bg-indigo-600 rounded-xl'
        >
          <Text className='text-white font-semibold'>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isLive = !!sermon.isLive;
  const viewerCount = isLive ? 342 : undefined;
  const hasVideo = !!sermon.mediaUrl;

  const closePlayer = () => {
    try {
      // @ts-ignore
      if (router.canDismiss?.()) {
        // @ts-ignore
        router.dismiss();
        return;
      }
    } catch {}
    router.back();
  };

  // when user taps an Up Next item, replace the route param
  const handleSelectNext = (nextId: string) => {
    setQueueOpen(false);
    setPosition(0);
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
          {/* Video Player */}
          <View className='relative bg-black' style={{ aspectRatio: 16 / 9 }}>
            {hasVideo ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: sermon.mediaUrl }}
                  posterSource={{ uri: sermon.thumbnailUrl }}
                  usePoster
                  posterStyle={{ resizeMode: 'cover' }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={isPlaying}
                  isLooping={false}
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                />

                {/* Buffering indicator */}
                {isBuffering && (
                  <View className='absolute inset-0 items-center justify-center bg-black/50'>
                    <ActivityIndicator size='large' color='#ffffff' />
                  </View>
                )}

                {/* Play overlay when paused */}
                {!isPlaying && !isBuffering && (
                  <Pressable
                    onPress={togglePlayPause}
                    className='absolute inset-0 items-center justify-center'
                  >
                    <View
                      className='w-20 h-20 rounded-full items-center justify-center'
                      style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
                    >
                      <View className='ml-1'>
                        <Play size={40} color='#4f46e5' />
                      </View>
                    </View>
                  </Pressable>
                )}
              </>
            ) : (
              <View className='flex-1 items-center justify-center bg-gray-800'>
                <Text className='text-gray-400'>No video available</Text>
              </View>
            )}

            {/* LIVE badge */}
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
          </View>

          <View className='w-full px-6 pt-6'>
            <View className='mb-6'>
              <View className='flex-row items-center justify-between'>
                <Text className='text-white text-xl font-bold mb-2 flex-1 pr-3'>
                  {sermon.title}
                </Text>

                <Pressable
                  onPress={() => setQueueOpen(true)}
                  className='w-10 h-10 rounded-full'
                  accessibilityRole='button'
                  accessibilityLabel='Open Up Next'
                >
                  <List size={22} color='#d1d5db' />
                </Pressable>
              </View>

              <View className='flex-row items-center gap-2'>
                <Text className='text-gray-300 text-sm'>{sermon.speaker}</Text>
                {sermon.tags && sermon.tags.length > 0 && (
                  <>
                    <Text className='text-gray-400 text-sm'>•</Text>
                    <Text className='text-gray-300 text-sm'>{sermon.tags[0]}</Text>
                  </>
                )}
              </View>
            </View>

            {/* Progress bar */}
            {!isLive && hasVideo && (
              <View className='mb-6'>
                <Slider
                  value={position}
                  onSlidingComplete={seekTo}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  step={1000}
                  minimumTrackTintColor='#4f46e5'
                  maximumTrackTintColor='#374151'
                  thumbTintColor='#ffffff'
                />
                <View className='flex-row justify-between mt-2'>
                  <Text className='text-gray-400 text-xs'>{formatTime(position)}</Text>
                  <Text className='text-gray-400 text-xs'>{formatTime(duration)}</Text>
                </View>
              </View>
            )}

            {/* Playback controls */}
            <View className='flex-row items-center justify-center gap-6 mb-6'>
              {/* Mute button */}
              <Pressable
                onPress={toggleMute}
                className='h-12 w-12 rounded-full items-center justify-center'
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                {isMuted ? (
                  <VolumeX size={24} color='#fff' />
                ) : (
                  <Volume2 size={24} color='#fff' />
                )}
              </Pressable>

              {/* Skip back */}
              <Pressable
                disabled={isLive}
                onPress={() => skip(-10)}
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

              {/* Play/Pause */}
              <Pressable
                onPress={togglePlayPause}
                disabled={!hasVideo}
                className='h-14 w-14 rounded-full items-center justify-center bg-indigo-600'
                style={{ opacity: hasVideo ? 1 : 0.5 }}
              >
                {isPlaying ? <Pause size={24} color='#fff' /> : <Play size={24} color='#fff' />}
              </Pressable>

              {/* Skip forward */}
              <Pressable
                disabled={isLive}
                onPress={() => skip(10)}
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

              {/* Placeholder for symmetry */}
              <View className='h-12 w-12' />
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
