import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  PanResponder,
  Animated,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  type IFeedItem,
  Stories,
  FeedSourceType,
} from '@/data/mockData';
import {
  StoriesRow,
  FeedCard,
  StoryViewerModal,
  QuickActionsModal,
} from '../components';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchHomeItems, refreshHomeItems, loadMoreHomeItems, clearCache } from '../redux/slices/home.slice';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const STORIES_HEIGHT = 120;

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items: FeedItems, status, loadingMore, hasNext } = useAppSelector((state) => state.home);
  const insets = useSafeAreaInsets();
  const FEED_HEIGHT = SCREEN_HEIGHT; // Full screen height

  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const [selectedFeedItem, setSelectedFeedItem] = useState<IFeedItem | null>(
    null,
  );
  const [isGloballyMuted, setIsGloballyMuted] = useState(false); // Global mute state - unmuted by default
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch home items on mount - clear cache to ensure fresh data
  useEffect(() => {
    dispatch(clearCache());
    dispatch(fetchHomeItems());
  }, [dispatch]);

  // Debug: Log items when they change
  useEffect(() => {
    const videoItems = FeedItems.filter(item => item.videoUrl);
    console.log('[HomeScreen] Total items in state:', FeedItems.length, 'Video items:', videoItems.length);
    if (videoItems.length > 0) {
      console.log('[HomeScreen] First video item from state:', videoItems[0].id, videoItems[0].kind, videoItems[0].videoUrl);
    }
  }, [FeedItems]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(refreshHomeItems()).unwrap();
    } catch (error) {
      console.log('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Handle infinite scroll - load more items
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNext) {
      dispatch(loadMoreHomeItems());
    }
  }, [dispatch, loadingMore, hasNext]);

  // Track screen focus
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );


  const flatListRef = useRef<FlatList>(null);
  const swipeX = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const singleTapTimeoutRef = useRef<{ [key: string]: number }>({});
  const gestureStartTimeRef = useRef(0);
  const longPressTimerRef = useRef<number | null>(null);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only capture if there's significant movement
          return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          gestureStartTimeRef.current = Date.now();

          // Start long press timer
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
          }
          longPressTimerRef.current = setTimeout(() => {
            if (selectedFeedItem) {
              handleLongPress(selectedFeedItem);
            }
          }, 500) as unknown as number;
        },
        onPanResponderMove: (_, gestureState) => {
          // Clear long press if moved too much
          if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10) {
            if (longPressTimerRef.current) {
              clearTimeout(longPressTimerRef.current);
              longPressTimerRef.current = null;
            }
          }

          // Handle horizontal swipe
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
          // Clear long press timer
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }

          const pressDuration = Date.now() - gestureStartTimeRef.current;
          const isTap = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10 && pressDuration < 500;

          if (gestureState.dx < -100) {
            // Swipe left detected - navigate to profile
            if (selectedFeedItem) {
              handleSwipeLeft(selectedFeedItem);
            }
          } else if (isTap && selectedFeedItem) {
            // Handle tap
            handleTap(selectedFeedItem);
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
    [selectedFeedItem],
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

  const handleSwipeLeft = (item: IFeedItem) => {
    router.push({
      pathname: `/profile/[id]`,
      params: { 
        id:item.sourceId,
        from: '/',
        sourceType: item.sourceType
       },
    });
  };

  const handleLongPress = (item: IFeedItem) => {
    // Clear any pending single tap
    if (singleTapTimeoutRef.current[item.id]) {
      clearTimeout(singleTapTimeoutRef.current[item.id]);
      delete singleTapTimeoutRef.current[item.id];
    }
    setSelectedFeedItem(item);
    setQuickActionsVisible(true);
  };

  const handleTap = (item: IFeedItem) => {
    const DOUBLE_TAP_DELAY = 250;
    const now = Date.now();
    const lastTap = lastTapRef.current[item.id];

    // Clear any existing timeout for this item
    if (singleTapTimeoutRef.current[item.id]) {
      clearTimeout(singleTapTimeoutRef.current[item.id]);
      delete singleTapTimeoutRef.current[item.id];
    }

    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      lastTapRef.current[item.id] = 0; // Reset
      toggleLike(item.id);
    } else {
      // Potential single tap - wait to confirm
      lastTapRef.current[item.id] = now;
      singleTapTimeoutRef.current[item.id] = setTimeout(() => {
        // Single tap confirmed
        if(item.sourceType === FeedSourceType.Event){
          router.push(item.primaryRoute as any);
          delete singleTapTimeoutRef.current[item.id];
        }
      }, DOUBLE_TAP_DELAY) as unknown as number;
    }
  };

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
    setIsGloballyMuted((prev) => !prev); // Toggle global mute for all items
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

  const renderFeedItem = useCallback(
    ({ item, index }: { item: IFeedItem; index: number }) => {
      // Debug: Log each item being rendered
      if (item.kind === 'video' || item.videoUrl) {
        console.log('[renderFeedItem] Video item:', index, item.id, 'kind:', item.kind, 'videoUrl:', item.videoUrl);
      }

      const isLiked = likedItems.has(item.id);
      const isSaved = savedItems.has(item.id);
      const isMuted = isGloballyMuted; // Use global mute state for all items
      const isExpanded = expandedItems.has(item.id);
      const isVisible = index === currentVisibleIndex && isFocused; // Check if this item is currently visible AND screen is focused

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
          onPressIn={() => setSelectedFeedItem(item)}
          onToggleLike={() => toggleLike(item.id)}
          onToggleSave={() => toggleSave(item.id)}
          onToggleMute={toggleMute} // No need to pass item.id since it's global
          onToggleExpand={() => toggleExpand(item.id)}
        />
      );
    },
    [likedItems, savedItems, isGloballyMuted, expandedItems, panResponder, currentVisibleIndex, isFocused],
  );

  const handleStoryPress = (index: number) => {
    setCurrentStoryIndex(index);
    setStoryViewerVisible(true);
  };

  const handleStoryClose = () => {
    setStoryViewerVisible(false);
  };

  const handleStoryPrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      return;
      // setStoryViewerVisible(false);
    }
  };

  const handleStoryNext = () => {
    if (currentStoryIndex < Stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      return;
      // setStoryViewerVisible(false);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is visible
  }).current;

  // Show loading state
  if (status === 'loading') {
    return (
      <View className='flex-1 bg-black items-center justify-center'>
        <StatusBar barStyle='light-content' />
        <ActivityIndicator size='large' color='#ffffff' />
      </View>
    );
  }

  return (
    <View className='flex-1 bg-black'>
      <StatusBar barStyle='light-content' />

      {/* Vertical Swipe Feed - Full Screen */}
      <FlatList
        ref={flatListRef}
        data={FeedItems}
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className='h-20 items-center justify-center'>
              <ActivityIndicator size='small' color='#ffffff' />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
            colors={['#ffffff']}
            progressBackgroundColor="#000000"
          />
        }
      />

      {/* Transparent Stories Row Overlay */}
      <View className='absolute top-0 left-0 right-0' style={{ zIndex: 10 }}>
        <StoriesRow
          stories={Stories}
          height={STORIES_HEIGHT}
          topInset={insets.top}
          onStoryPress={handleStoryPress}
        />
      </View>

      {/* Story Viewer Modal */}
      <StoryViewerModal
        visible={storyViewerVisible}
        story={Stories[currentStoryIndex] || null}
        progress={0.6}
        onClose={handleStoryClose}
        onPrevious={handleStoryPrevious}
        onNext={handleStoryNext}
      />

      {/* Quick Actions Modal */}
      <QuickActionsModal
        visible={quickActionsVisible}
        item={selectedFeedItem}
        isSaved={selectedFeedItem ? savedItems.has(selectedFeedItem.id) : false}
        onClose={() => setQuickActionsVisible(false)}
        onToggleSave={() => {
          if (selectedFeedItem) {
            toggleSave(selectedFeedItem.id);
          }
        }}
      />
    </View>
  );
}