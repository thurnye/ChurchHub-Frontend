import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  Modal,
  PanResponder,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Grid3x3,
  Play,
  Radio,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronLeft,
  MoreVertical,
  VolumeX,
  Volume2,
  Settings,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FeedSourceType,
  ProfileData,
  IPost,
  IProfileData,
  IFeedItem,
} from '@/data/mockData';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { FeedCard } from '@/features/home/components/FeedCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GRID_ITEM_SIZE = SCREEN_WIDTH / 3;
const TOP_BAR_HEIGHT = 60;
const FEED_HEIGHT = SCREEN_HEIGHT - TOP_BAR_HEIGHT;

type TabType = 'grid' | 'videos' | 'tagged';

export function ProfileGalleryScreen() {
  const { id, from, sourceType } = useLocalSearchParams<{
    id: string;
    from: string;
    sourceType: FeedSourceType;
  }>();
  const insets = useSafeAreaInsets();

  // Find profile data based on ID
  const profile: IProfileData = ProfileData.find((p) => p.id === id) || ProfileData[0];

  // Filter posts for this profile
  const profilePosts = profile.posts;

  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [isGloballyMuted, setIsGloballyMuted] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const feedListRef = useRef<FlatList>(null);
  const swipeX = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const singleTapTimeoutRef = useRef<{ [key: string]: number }>({});
  const gestureStartTimeRef = useRef(0);
  const longPressTimerRef = useRef<number | null>(null);

  // Track screen focus
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(singleTapTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeTab === 'videos') {
      return profilePosts.filter((p) => p.type === 'video');
    }
    return profilePosts;
  }, [activeTab, profilePosts]);

  // Convert IPost to FeedItem format
  const convertPostToFeedItem = useCallback((post: IPost): IFeedItem => {
    return {
      id: post.id,
      kind: post.type === 'video' ? 'video' : 'image',
      thumbnail: post.thumbnail,
      videoUrl: post.videoUrl,
      postOwner: profile.name,
      title: undefined,
      speaker: post.speaker,
      description: post.description,
      isLive: post.isLive,
      viewerCount: post.viewsCount,
      sourceType: profile.sourceType,
      sourceId: profile.id,
      primaryRoute: {
        pathname: '/profile/[id]',
        params: { id: profile.id, from: from || '/' },
      },
      hasAudio: post.type === 'video',
    };
  }, [profile, from]);

  const feedItems = useMemo(() => {
    return filteredPosts.map(convertPostToFeedItem);
  }, [filteredPosts, convertPostToFeedItem]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isHorizontal =
            Math.abs(gestureState.dx) > 12 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);

          if (isHorizontal) {
            setScrollEnabled(false);
          }

          return isHorizontal;
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          gestureStartTimeRef.current = Date.now();

          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
          }
          longPressTimerRef.current = setTimeout(() => {
            if (selectedPost) {
              handleLongPress(feedItems.find(f => f.id === selectedPost.id)!);
            }
          }, 500) as unknown as number;
        },
        onPanResponderMove: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10) {
            if (longPressTimerRef.current) {
              clearTimeout(longPressTimerRef.current);
              longPressTimerRef.current = null;
            }
          }

          const isHorizontal =
            Math.abs(gestureState.dx) > 12 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);

          if (isHorizontal) {
            setScrollEnabled(false);
            if (gestureState.dx < 0) {
              swipeX.setValue(gestureState.dx);
            }
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }

          const pressDuration = Date.now() - gestureStartTimeRef.current;
          const isTap = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10 && pressDuration < 500;

          if (gestureState.dx < -100) {
            // Swipe left - navigate to profile
            router.push({
              pathname: '/profile/[id]',
              params: {
                id: profile.id,
                from: from || '/',
                sourceType: profile.sourceType,
              },
            });
          } else if (isTap && selectedPost) {
            const item = feedItems.find(f => f.id === selectedPost.id);
            if (item) {
              handleTap(item);
            }
          }

          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setScrollEnabled(true);
        },
        onPanResponderTerminate: () => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setScrollEnabled(true);
        },
      }),
    [selectedPost, profile, from, feedItems],
  );

  const toggleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSave = (itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleMute = () => {
    setIsGloballyMuted((prev) => !prev);
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleTap = (item: IFeedItem) => {
    const DOUBLE_TAP_DELAY = 250;
    const now = Date.now();
    const lastTap = lastTapRef.current[item.id];

    if (singleTapTimeoutRef.current[item.id]) {
      clearTimeout(singleTapTimeoutRef.current[item.id]);
      delete singleTapTimeoutRef.current[item.id];
    }

    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      lastTapRef.current[item.id] = 0;
      toggleLike(item.id);
    } else {
      lastTapRef.current[item.id] = now;
      singleTapTimeoutRef.current[item.id] = setTimeout(() => {
        delete singleTapTimeoutRef.current[item.id];
      }, DOUBLE_TAP_DELAY) as unknown as number;
    }
  };

  const handleLongPress = (item: IFeedItem) => {
    if (singleTapTimeoutRef.current[item.id]) {
      clearTimeout(singleTapTimeoutRef.current[item.id]);
      delete singleTapTimeoutRef.current[item.id];
    }
    setSelectedPost(profilePosts.find(p => p.id === item.id) || null);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderFeedItem = useCallback(
    ({ item, index }: { item: IFeedItem; index: number }) => {
      const isLiked = likedItems.has(item.id);
      const isSaved = savedItems.has(item.id);
      const isMuted = isGloballyMuted;
      const isExpanded = expandedItems.has(item.id);
      const isVisible = index === currentVisibleIndex && isFocused && viewerVisible;

      return (
        <FeedCard
          item={item}
          height={FEED_HEIGHT}
          isLiked={isLiked}
          isSaved={isSaved}
          isMuted={isMuted}
          isExpanded={isExpanded}
          isVisible={isVisible}
          panResponder={panResponder}
          onTap={() => handleTap(item)}
          onLongPress={() => handleLongPress(item)}
          onPressIn={() => setSelectedPost(profilePosts.find(p => p.id === item.id) || null)}
          onToggleLike={() => toggleLike(item.id)}
          onToggleSave={() => toggleSave(item.id)}
          onToggleMute={toggleMute}
          onToggleExpand={() => toggleExpand(item.id)}
        />
      );
    },
    [likedItems, savedItems, isGloballyMuted, expandedItems, panResponder, currentVisibleIndex, isFocused, profilePosts, viewerVisible],
  );

  const handlePostPress = (post: IPost, index: number) => {
    setSelectedPost(post);
    setCurrentIndex(index);
    setCurrentVisibleIndex(index);
    setViewerVisible(true);

    // Scroll to the tapped item
    setTimeout(() => {
      feedListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
    setSelectedPost(null);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderGridItem = ({ item, index }: { item: IPost; index: number }) => {
    return (
      <Pressable
        onPress={() => handlePostPress(item, index)}
        style={{
          width: GRID_ITEM_SIZE,
          height: GRID_ITEM_SIZE,
          padding: 1,
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: '100%', height: '100%' }}
          contentFit='cover'
        />

        {/* Video indicator */}
        {item.type === 'video' && (
          <View className='absolute top-2 right-2'>
            <Play size={20} color='#fff' fill='#fff' />
          </View>
        )}

        {/* Stats overlay */}
        <View className='absolute bottom-0 left-0 right-0 p-2 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-1'>
            <Heart size={14} color='#fff' fill='#fff' />
            <Text className='text-white text-xs font-semibold'>
              {formatCount(item.likesCount)}
            </Text>
          </View>
          {item.viewsCount && (
            <View className='flex-row items-center gap-1'>
              <Play size={14} color='#fff' />
              <Text className='text-white text-xs font-semibold'>
                {formatCount(item.viewsCount)}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const handleDirection = () => {
    router.push({
      pathname: '/church/[id]',
      params: {
        id,
        from: `/profile/${id}`,
      },
    });
  };

  const renderFullScreenViewer = () => {
    if (!viewerVisible) return null;

    return (
      <Modal
        visible={viewerVisible}
        animationType='slide'
        onRequestClose={handleCloseViewer}
      >
        <View className='flex-1 bg-black'>
          <StatusBar barStyle='light-content' />

          {/* Close Button - Top Bar */}
          <View
            className='absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4'
            style={{ paddingTop: insets.top + 12 }}
          >
            <Pressable
              onPress={handleCloseViewer}
              className='w-10 h-10 items-center justify-center bg-black/30 rounded-full'
            >
              <X size={24} color='#fff' />
            </Pressable>

            <View className='flex-row items-center gap-2'>
              <Image
                source={{ uri: profile.avatar }}
                style={{ width: 32, height: 32 }}
                className='rounded-full'
                contentFit='cover'
              />
              <Text className='text-white font-semibold'>
                {profile.username}
              </Text>
            </View>

            <View className='w-10' />
          </View>

          {/* Vertical Swipe Feed */}
          <FlatList
            ref={feedListRef}
            data={feedItems}
            renderItem={renderFeedItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
            scrollEnabled={scrollEnabled}
            showsVerticalScrollIndicator={false}
            snapToInterval={FEED_HEIGHT}
            decelerationRate='fast'
            getItemLayout={(_, index) => ({
              length: FEED_HEIGHT,
              offset: FEED_HEIGHT * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews
            maxToRenderPerBatch={3}
            windowSize={3}
            initialNumToRender={2}
            initialScrollIndex={currentIndex}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                feedListRef.current?.scrollToIndex({ index: info.index, animated: false });
              });
            }}
          />
        </View>
      </Modal>
    );
  };

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <HiddenScreensTopBar
        show={true}
        title={profile.username}
        navigateTo={from}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* Profile Info */}
        <View className='px-4 py-6'>
          {/* Avatar & Stats */}
          <View className='flex-row items-center justify-between mb-4'>
            <Image
              source={{ uri: profile.avatar }}
              style={{ width: 88, height: 88 }}
              className='rounded-full'
              contentFit='cover'
            />

            <View className='flex-1 flex-row justify-around ml-6'>
              <View className='items-center'>
                <Text className='text-xl font-bold text-gray-900'>
                  {formatCount(profile.postsCount)}
                </Text>
                <Text className='text-sm text-gray-600 mt-1'>Posts</Text>
              </View>
              <View className='items-center'>
                <Text className='text-xl font-bold text-gray-900'>
                  {formatCount(profile.membersCount)}
                </Text>
                <Text className='text-sm text-gray-600 mt-1'>Members</Text>
              </View>
              <View className='items-center'>
                <Text className='text-xl font-bold text-gray-900'>
                  {formatCount(profile.memberCount)}
                </Text>
                <Text className='text-sm text-gray-600 mt-1'>Following</Text>
              </View>
            </View>
          </View>

          {/* Name & Bio */}
          <View className='mb-4'>
            <Text className='text-base font-semibold text-gray-900 mb-1'>
              {profile.name}
            </Text>
            <Text className='text-sm text-gray-700 leading-5'>
              {profile.bio}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className='flex-row gap-2'>
            <Pressable className='flex-1 bg-indigo-600 rounded-lg py-2.5'>
              <Text className='text-white text-center font-semibold'>
                Follow
              </Text>
            </Pressable>

            {FeedSourceType.Church === profile.sourceType && (
              <Pressable
                onPress={handleDirection}
                className='flex-1 bg-gray-200 rounded-lg py-2.5'
              >
                <Text className='text-gray-900 text-center font-semibold'>
                  About
                </Text>
              </Pressable>
            )}
            <Pressable className='bg-gray-200 rounded-lg py-2.5 px-4'>
              <MoreVertical size={20} color='#111827' />
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View className='bg-white border-t border-b border-gray-200 flex-row'>
          <Pressable
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === 'grid' ? 'border-gray-900' : 'border-transparent'
            }`}
            onPress={() => setActiveTab('grid')}
          >
            <Grid3x3
              size={24}
              color={activeTab === 'grid' ? '#111827' : '#6b7280'}
            />
          </Pressable>
          <Pressable
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === 'videos' ? 'border-gray-900' : 'border-transparent'
            }`}
            onPress={() => setActiveTab('videos')}
          >
            <Radio
              size={24}
              color={activeTab === 'videos' ? '#111827' : '#6b7280'}
            />
          </Pressable>
          <Pressable
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === 'tagged' ? 'border-gray-900' : 'border-transparent'
            }`}
            onPress={() => setActiveTab('tagged')}
          >
            <Bookmark
              size={24}
              color={activeTab === 'tagged' ? '#111827' : '#6b7280'}
            />
          </Pressable>
        </View>

        {/* Gallery Grid */}
        <FlatList
          data={filteredPosts}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </ScrollView>

      {/* Full Screen Viewer */}
      {renderFullScreenViewer()}
    </View>
  );
}
