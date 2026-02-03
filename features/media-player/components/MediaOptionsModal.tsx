import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Share2, Bookmark, Clock, Flag, Church, X } from 'lucide-react-native';

import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MediaOptionsModalProps {
  actionsOpen: boolean;
  setActionsOpen: (actionsOpen: boolean) => void;
}

export function MediaOptionsModal({
  actionsOpen,
  setActionsOpen,
}: MediaOptionsModalProps) {
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  // action handlers (wire these later)
  const onShare = () => {
    setActionsOpen(false);
    console.log(id);
    // TODO: Share.share({ message: sermon.title, url: sermon.shareUrl })
  };

  const onToggleBookmark = () => {
    setActionsOpen(false);
    // TODO: save/unsave sermon.id in your store/api
  };

  const onSleepTimer = () => {
    setActionsOpen(false);
    // TODO: open another modal for 5/10/15/30 min
  };

  const onReport = () => {
    setActionsOpen(false);
    // TODO: navigate to report screen or open report modal
  };

  const onViewChurch = () => {
    setActionsOpen(false);
    // TODO: router.push({ pathname: '/(tabs)/churches/[id]', params: { id: sermon.churchId } })
  };

  return (
    <View>
      <Modal
        visible={actionsOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setActionsOpen(false)}
      >
        <Pressable
          className='flex-1'
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onPress={() => setActionsOpen(false)}
        >
          <Pressable
            onPress={() => {}}
            className='absolute left-0 right-0 bottom-0 rounded-t-3xl p-4'
            style={{ backgroundColor: '#111827' }}
          >
            {/* Header */}
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-white font-semibold text-base'>
                Options
              </Text>
              <Pressable
                onPress={() => setActionsOpen(false)}
                className='w-10 h-10 items-center justify-center rounded-full'
              >
                <X size={20} color='#d1d5db' />
              </Pressable>
            </View>

            <View className='gap-2'>
              <Pressable
                onPress={onShare}
                className='flex-row items-center gap-3 p-3 rounded-2xl'
                style={{ backgroundColor: '#1f2937' }}
              >
                <Share2 size={18} color='#fff' />
                <Text className='text-white font-medium'>Share</Text>
              </Pressable>

              <Pressable
                onPress={onToggleBookmark}
                className='flex-row items-center gap-3 p-3 rounded-2xl'
                style={{ backgroundColor: '#1f2937' }}
              >
                <Bookmark size={18} color='#fff' />
                <Text className='text-white font-medium'>Save / Bookmark</Text>
              </Pressable>

              <Pressable
                onPress={onSleepTimer}
                className='flex-row items-center gap-3 p-3 rounded-2xl'
                style={{ backgroundColor: '#1f2937' }}
              >
                <Clock size={18} color='#fff' />
                <Text className='text-white font-medium'>Sleep Timer</Text>
              </Pressable>

              <Pressable
                onPress={onViewChurch}
                className='flex-row items-center gap-3 p-3 rounded-2xl'
                style={{ backgroundColor: '#1f2937' }}
              >
                <Church size={18} color='#fff' />
                <Text className='text-white font-medium'>View Church</Text>
              </Pressable>

              <Pressable
                onPress={onReport}
                className='flex-row items-center gap-3 p-3 rounded-2xl'
                style={{ backgroundColor: 'rgba(239,68,68,0.18)' }}
              >
                <Flag size={18} color='#fecaca' />
                <Text className='text-red-200 font-medium'>Report</Text>
              </Pressable>
            </View>

            <View style={{ height: insets.bottom }} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
