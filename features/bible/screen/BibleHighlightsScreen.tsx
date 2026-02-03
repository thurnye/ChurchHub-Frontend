import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Card, CardContent } from '@/shared/components/ui';
import { EmptyState } from '../component/EmptyState';
import { bibleHighlights } from '@/data/mockData';
import { getBookName } from '../services/bibleService';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

const COLOR_FILTERS = [
  { id: 'all', label: 'All' },
  { id: '#fbbf24', label: 'Gold' },
  { id: '#86efac', label: 'Green' },
  { id: '#93c5fd', label: 'Blue' },
  { id: '#f9a8d4', label: 'Pink' },
  { id: '#c4b5fd', label: 'Purple' },
];

export default function BibleHighlightsScreen() {
  const { from } = useLocalSearchParams<{
    from: string;
  }>();
  const [activeColor, setActiveColor] = useState('all');

  const filtered =
    activeColor === 'all'
      ? bibleHighlights
      : bibleHighlights.filter((h) => h.color === activeColor);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Highlights' navigateTo={from || '/bible'} />
      
      <View className='bg-white border-b border-gray-100'>
        {/* Color filter chips */}
        <View className='px-4 pb-3 flex-row gap-2 flex-wrap'>
          {COLOR_FILTERS.map((f) => {
            const isActive = activeColor === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setActiveColor(f.id)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {f.id !== 'all' && (
                  <View
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: f.id }}
                  />
                )}
                <Text
                  className={`text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600'}`}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title='No highlights yet'
          description='Open the Bible reader, tap a verse, and choose a highlight colour to save it here.'
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/bible/reader',
                  params: {
                    translationId: item.ref.translationId,
                    bookId: item.ref.bookId,
                    chapter: String(item.ref.chapter),
                    verse: String(item.ref.verse),
                    from:'/bible/highlights'
                  },
                })
              }
            >
              <Card>
                <CardContent>
                  <View className='flex-row items-start gap-2'>
                    <View
                      className='w-3 h-3 rounded-full mt-1 flex-shrink-0'
                      style={{ backgroundColor: item.color }}
                    />
                    <View className='flex-1'>
                      <Text className='text-xs font-semibold text-gray-500'>
                        {getBookName(item.ref.bookId)} {item.ref.chapter}:
                        {item.ref.verse}
                      </Text>
                      <Text className='text-sm text-gray-700 leading-relaxed mt-0.5'>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
