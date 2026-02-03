import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Card, CardContent } from '@/shared/components/ui';
import { BibleSearchBar } from '../component/BibleSearchBar';
import { EmptyState } from '../component/EmptyState';
import { bibleNotes } from '@/data/mockData';
import { getBookName } from '../services/bibleService';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

export default function BibleNotesScreen() {
  const { from } = useLocalSearchParams<{
      from: string;
    }>();
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? bibleNotes.filter(
        (n) =>
          n.text.toLowerCase().includes(filter.toLowerCase()) ||
          getBookName(n.ref.bookId).toLowerCase().includes(filter.toLowerCase()),
      )
    : bibleNotes;

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='My Notes' navigateTo={from || '/bible'} />
      

      {filtered.length === 0 ? (
        <EmptyState
          title='No notes yet'
          description='Open the Bible reader, tap a verse, and tap "Note" to add your first note.'
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
                    from:'/bible/notes'
                  },
                })
              }
            >
              <Card>
                <CardContent>
                  <Text className='text-xs font-semibold text-indigo-600 mb-1'>
                    {getBookName(item.ref.bookId)} {item.ref.chapter}:{item.ref.verse}
                  </Text>
                  <Text className='text-sm text-gray-700 leading-relaxed'>{item.text}</Text>
                  <Text className='text-xs text-gray-400 mt-2'>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
