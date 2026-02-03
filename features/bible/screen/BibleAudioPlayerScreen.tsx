import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react-native';
import { Card, CardContent } from '@/shared/components/ui';
import { bibleAudioMap } from '@/data/mockData';
import { getBookName } from '../services/bibleService';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function BibleAudioPlayerScreen() {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1.0);

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const currentEntry = currentIndex !== null ? bibleAudioMap[currentIndex] : null;
  const hasAudio = currentEntry?.audioUrl ? true : false;

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white border-b border-gray-100' style={{ paddingTop: insets.top }}>
        <View className='flex-row items-center px-4 h-14'>
          <Pressable onPress={() => router.back()} className='w-10 h-10 items-center justify-center'>
            <ChevronLeft size={24} color='#374151' />
          </Pressable>
          <Text className='font-semibold text-lg text-gray-900'>Audio Bible</Text>
        </View>
      </View>

      {/* Player card */}
      <View className='px-4 pt-4'>
        <Card>
          <CardContent>
            {/* Track info */}
            <View className='items-center mb-4'>
              <View className='w-14 h-14 bg-indigo-100 rounded-full items-center justify-center mb-3'>
                <Volume2 size={24} color='#4f46e5' />
              </View>
              {currentEntry ? (
                <>
                  <Text className='font-semibold text-base text-gray-900'>
                    {getBookName(currentEntry.bookId)} {currentEntry.chapter}
                  </Text>
                  <Text className='text-xs text-gray-500 mt-0.5'>{formatDuration(currentEntry.durationSeconds)}</Text>
                </>
              ) : (
                <Text className='text-sm text-gray-500'>Select a chapter below</Text>
              )}
            </View>

            {/* Audio unavailable notice */}
            {currentEntry && !hasAudio && (
              <View className='bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4'>
                <Text className='text-xs text-amber-700 text-center'>
                  Audio is not yet available for this chapter.
                </Text>
              </View>
            )}

            {/* Controls */}
            <View className='flex-row items-center justify-center gap-6'>
              <Pressable
                onPress={() => {
                  if (currentIndex !== null && currentIndex > 0) setCurrentIndex(currentIndex - 1);
                }}
                disabled={currentIndex === null || currentIndex === 0}
                className={currentIndex === null || currentIndex === 0 ? 'opacity-30' : ''}
              >
                <SkipBack size={24} color='#374151' />
              </Pressable>

              <Pressable
                onPress={() => hasAudio && setIsPlaying((p) => !p)}
                disabled={!hasAudio}
                className={`w-14 h-14 rounded-full items-center justify-center ${hasAudio ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                {isPlaying ? (
                  <Pause size={24} color={hasAudio ? '#ffffff' : '#9ca3af'} />
                ) : (
                  <Play size={24} color={hasAudio ? '#ffffff' : '#9ca3af'} style={{ marginLeft: 2 }} />
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  if (currentIndex !== null && currentIndex < bibleAudioMap.length - 1) setCurrentIndex(currentIndex + 1);
                }}
                disabled={currentIndex === null || currentIndex >= bibleAudioMap.length - 1}
                className={currentIndex === null || currentIndex >= bibleAudioMap.length - 1 ? 'opacity-30' : ''}
              >
                <SkipForward size={24} color='#374151' />
              </Pressable>
            </View>

            {/* Speed control */}
            <Pressable onPress={cycleSpeed} className='mt-4 self-center'>
              <Text className='text-xs font-medium text-indigo-600'>{speed}x speed</Text>
            </Pressable>
          </CardContent>
        </Card>
      </View>

      {/* Available chapters list */}
      <View className='px-4 pt-4'>
        <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
          Available Chapters
        </Text>
      </View>
      <FlatList
        data={bibleAudioMap}
        keyExtractor={(item, idx) => `${item.bookId}-${item.chapter}-${idx}`}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: insets.bottom + 16 }}
        renderItem={({ item, index }) => {
          const isActive = currentIndex === index;
          return (
            <Pressable
              onPress={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`flex-row items-center justify-between p-3 rounded-xl border ${
                isActive ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'
              }`}
            >
              <View>
                <Text className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>
                  {getBookName(item.bookId)} {item.chapter}
                </Text>
                <Text className='text-xs text-gray-400'>{formatDuration(item.durationSeconds)}</Text>
              </View>
              <View className={`w-8 h-8 rounded-lg items-center justify-center ${isActive ? 'bg-indigo-600' : 'bg-gray-100'}`}>
                <Play size={14} color={isActive ? '#ffffff' : '#6b7280'} style={{ marginLeft: 1 }} />
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
