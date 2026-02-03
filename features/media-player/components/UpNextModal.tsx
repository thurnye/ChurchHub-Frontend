// UpNextModal.tsx

import React, { useMemo, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchMediaItems } from '../redux/slices/media-player.slice';

interface UpNextModalProps {
  queueOpen: boolean;
  setQueueOpen: (open: boolean) => void;
  onSelect: (nextId: string) => void; // ✅ renamed
}

export function UpNextModal({ queueOpen, setQueueOpen, onSelect }: UpNextModalProps) {
  const dispatch = useAppDispatch();
  const { items: sermons } = useAppSelector((state) => state.mediaPlayer);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    dispatch(fetchMediaItems());
  }, [dispatch]);

  const related = useMemo(
    () => sermons.filter((s) => s.id !== id).slice(0, 10),
    [sermons, id],
  );

  const playNext = (nextId: string) => {
    setQueueOpen(false);
    onSelect(nextId); // ✅ triggers player update
  };

  return (
    <View>
      <Modal
        visible={queueOpen}
        transparent
        animationType='slide'
        onRequestClose={() => setQueueOpen(false)}
      >
        <Pressable
          className='flex-1'
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onPress={() => setQueueOpen(false)}
        >
          <Pressable
            onPress={() => {}}
            className='absolute left-0 right-0 bottom-0 rounded-t-3xl p-4'
            style={{ backgroundColor: '#111827' }}
          >
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-white font-semibold text-base'>Up Next</Text>
              <Pressable
                onPress={() => setQueueOpen(false)}
                className='w-10 h-10 items-center justify-center rounded-full'
              >
                <X size={20} color='#d1d5db' />
              </Pressable>
            </View>

            <ScrollView className='max-h-[60vh]' showsVerticalScrollIndicator={false}>
              <View className='gap-3 pb-2'>
                {related.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => playNext(r.id)}
                    className='flex-row gap-3 p-3 rounded-2xl'
                    style={{ backgroundColor: '#1f2937' }}
                  >
                    <Image
                      source={{ uri: r.thumbnail }}
                      className='w-16 h-16 rounded-xl'
                      resizeMode='cover'
                    />
                    <View className='flex-1'>
                      <Text className='text-white font-medium text-sm' numberOfLines={2}>
                        {r.title}
                      </Text>
                      <Text className='text-gray-400 text-xs mt-1'>
                        {r.speaker} • {r.duration}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={{ height: insets.bottom }} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
