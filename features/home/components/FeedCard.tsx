import {
  View,
  Text,
  Pressable,
  PanResponderInstance,
  GestureResponderEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  VolumeX,
  Volume2,
  Play,
  Pause,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IFeedItem } from '../types/home.types';

interface FeedCardProps {
  item: IFeedItem;
  height: number;
  isLiked: boolean;
  isSaved: boolean;
  isMuted: boolean;
  isExpanded: boolean;
  isVisible: boolean;
  panResponder: PanResponderInstance;
  onTap: () => void;
  onLongPress: () => void;
  onPressIn: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleMute: () => void;
  onToggleExpand: () => void;
}

export function FeedCard({
  item,
  height,
  isLiked,
  isSaved,
  isMuted,
  isExpanded,
  isVisible,
  panResponder,
  onTap,
  onLongPress,
  onPressIn,
  onToggleLike,
  onToggleSave,
  onToggleMute,
  onToggleExpand,
}: FeedCardProps) {
  const insets = useSafeAreaInsets();
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressBarRef = useRef<View>(null);
  const progressBarWidth = useRef(0);

  // Initialize video player for video/live items
  const videoSource =
    (item.kind === 'video' || item.kind === 'live') && item.videoUrl
      ? item.videoUrl
      : null;
  const player = useVideoPlayer(videoSource, (player) => {
    if (videoSource) {
      player.loop = true;
      player.muted = isMuted;
    }
  });

  // Update video playback based on visibility
  useEffect(() => {
    if (player && videoSource) {
      if (isVisible) {
        player.replay(); // Reset to beginning and play
        setIsPaused(false); // Reset pause state when becoming visible
      } else {
        player.pause();
      }
    }
  }, [isVisible, player, videoSource]);

  // Update video mute state when global mute changes
  useEffect(() => {
    if (player && videoSource) {
      player.muted = isMuted;
    }
  }, [isMuted, player, videoSource]);

  // Track video progress
  useEffect(() => {
    if (!player || !videoSource || isSeeking) return; // Don't update during seeking

    const interval = setInterval(() => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration);
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [player, videoSource, isSeeking]);

  const togglePlayPause = (e: any) => {
    e.stopPropagation();
    if (player && videoSource) {
      if (isPaused) {
        player.play();
        setIsPaused(false);
      } else {
        player.pause();
        setIsPaused(true);
      }
    }
  };

  const handleSeekStart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setIsSeeking(true);
  };

  const handleSeekMove = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (!isSeeking || !player || !videoSource || !progressBarWidth.current)
      return;

    const touchX = e.nativeEvent.locationX;
    const percentage = Math.max(
      0,
      Math.min(1, touchX / progressBarWidth.current),
    );
    const newTime = percentage * duration;

    setCurrentTime(newTime);
  };

  const handleSeekEnd = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (!player || !videoSource || !progressBarWidth.current) return;

    const touchX = e.nativeEvent.locationX;
    const percentage = Math.max(
      0,
      Math.min(1, touchX / progressBarWidth.current),
    );
    const newTime = percentage * duration;

    player.currentTime = newTime;
    setCurrentTime(newTime);
    setIsSeeking(false);
  };

  const handleProgressBarLayout = (event: any) => {
    progressBarWidth.current = event.nativeEvent.layout.width;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View {...panResponder.panHandlers} style={{ height }} onTouchStart={onPressIn}>
      <View style={{ height }}>
        <View className='flex-1 bg-black'>
          {/* Background Image/Video */}
          {(item.kind === 'video' || item.kind === 'live') && item.videoUrl ? (
            <>
              <VideoView
                player={player}
                style={{ width: '100%', height: '100%' }}
                contentFit='contain'
                nativeControls={false}
              />
              {/* Tap area for pause/play */}
              <Pressable
                onPress={togglePlayPause}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </>
          ) : (
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: '100%', height: '100%' }}
              contentFit='contain'
            />
          )}

          {/* Pause Overlay Icon */}
          {isPaused &&
            (item.kind === 'video' || item.kind === 'live') &&
            item.videoUrl && (
              <View
                className='absolute inset-0 items-center justify-center'
                pointerEvents='none'
              >
                <View className='w-20 h-20 bg-black/60 rounded-full items-center justify-center'>
                  <Pause size={40} color='#fff' fill='#fff' />
                </View>
              </View>
            )}

          {/* Right Action Bar */}
          <View
            className='absolute right-4 items-center gap-6 mb-24'
            style={{ bottom: Math.max(insets.bottom + 120, 140) }}
          >
            <Pressable className='items-center' onPress={onToggleLike}>
              <View className='w-12 h-12 items-center justify-center'>
                <Heart
                  size={28}
                  color='#fff'
                  fill={isLiked ? '#fff' : 'transparent'}
                  strokeWidth={2}
                />
              </View>
              <Text className='text-white text-xs mt-1'>100</Text>
            </Pressable>

            <Pressable className='items-center'>
              <View className='w-12 h-12 items-center justify-center'>
                <MessageCircle size={28} color='#fff' strokeWidth={2} />
              </View>
              <Text className='text-white text-xs mt-1'>34</Text>
            </Pressable>

            <Pressable className='items-center' onPress={onToggleSave}>
              <View className='w-12 h-12 items-center justify-center'>
                <Bookmark
                  size={28}
                  color='#fff'
                  fill={isSaved ? '#fff' : 'transparent'}
                  strokeWidth={2}
                />
              </View>
              <Text className='text-white text-xs mt-1'>23</Text>
            </Pressable>

            <Pressable className='items-center'>
              <View className='w-12 h-12 items-center justify-center'>
                <Share2 size={28} color='#fff' strokeWidth={2} />
              </View>
              <Text className='text-white text-xs mt-1'>Share</Text>
            </Pressable>
          </View>

          {/* Bottom Overlay - Info with Semi-transparent Background */}
          <View
            className='absolute bottom-0 left-0 right-0'
            style={{ paddingBottom: Math.max(insets.bottom, 56) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
              locations={[0, 0.3, 1]}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
            <View className='px-4 pt-8' style={{ paddingRight: 80 }}>
              <View className='flex-row items-center flex-1'>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/profile/[id]`,
                      params: {
                        id: item.sourceId,
                        from: '/',
                        sourceType: item.sourceType,
                      },
                    })
                  }
                >
                  <Text
                    className='text-white font-semibold text-base mr-2'
                    numberOfLines={1}
                  >
                    {item.postOwner}
                  </Text>
                </Pressable>
                {item.denomination && (
                  <View className='bg-white/20 px-2 py-0.5 rounded-full'>
                    <Text className='text-white text-xs'>
                      {item.denomination}
                    </Text>
                  </View>
                )}
                {item.isLive && (
                  <View className='bg-red-600 px-2 py-1 rounded ml-2 flex-row items-center'>
                    <View className='w-1.5 h-1.5 bg-white rounded-full mr-1.5' />
                    <Text className='text-white text-xs font-bold'>LIVE</Text>
                  </View>
                )}
              </View>

              {item.speaker && (
                <Text className='text-white font-semibold text-sm mb-1'>
                  {item.speaker}
                </Text>
              )}
              {item.description && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                >
                  <Text
                    className='text-white/90 text-sm leading-5'
                    numberOfLines={isExpanded ? undefined : 2}
                  >
                    {item.description}
                  </Text>
                  {item.description.length > 60 && (
                    <Text className='text-white/70 text-xs mt-1'>
                      {isExpanded ? 'View less' : 'View more'}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
            <View className='flex-row items-center flex-1 justify-between w-full px-4 pb-1'>
              {item.isLive && item.viewerCount ? (
                <View className='flex-row items-center'>
                  <View className='w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse' />
                  <Text className='text-white text-xs'>
                    {' '}
                    {item.viewerCount.toLocaleString()} watching
                  </Text>
                </View>
              ) : (
                <View />
              )}
              {item.hasAudio && (
                <Pressable
                  className=' w-8 h-8 bg-white/20 rounded-full items-center justify-center'
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                  }}
                >
                  {isMuted ? (
                    <VolumeX size={15} color='#fff' />
                  ) : (
                    <Volume2 size={15} color='#fff' />
                  )}
                </Pressable>
              )}
            </View>
            {/* Video Progress Bar and Play/Pause Button */}
            {(item.kind === 'video' || item.kind === 'live') &&
              item.videoUrl && (
                <View className='flex-row items-center mt-2 mb-1 px-4'>
                  {/* Play/Pause Button */}
                  {/* <Pressable onPress={togglePlayPause} className='mr-2'>
                    <View className='w-7 h-7 bg-white/20 rounded-full items-center justify-center'>
                      {isPaused ? (
                        <Play size={14} color='#fff' fill='#fff' />
                      ) : (
                        <Pause size={14} color='#fff' fill='#fff' />
                      )}
                    </View>
                  </Pressable> */}

                  {/* Interactive Progress Bar */}
                  <View
                    className='flex-1 py-2'
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={handleSeekStart}
                    onResponderMove={handleSeekMove}
                    onResponderRelease={handleSeekEnd}
                  >
                    <View
                      ref={progressBarRef}
                      className='h-1 bg-white/20 rounded-full overflow-visible relative'
                      onLayout={handleProgressBarLayout}
                    >
                      <View
                        className='h-full bg-white rounded-full'
                        style={{ width: `${progressPercentage}%` }}
                      />
                      {/* Draggable Thumb */}
                      {isSeeking && (
                        <View
                          className='absolute top-1/2 w-3 h-3 bg-white rounded-full border-2 border-white shadow-lg'
                          style={{
                            left: `${progressPercentage}%`,
                            transform: [{ translateX: -6 }, { translateY: -6 }],
                          }}
                        />
                      )}
                    </View>
                  </View>

                  {/* Time Display */}
                  {/* <Text className='text-white/70 text-xs ml-2' style={{ minWidth: 40 }}>
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                  </Text> */}
                </View>
              )}
          </View>
        </View>
      </View>
    </View>
  );
}
