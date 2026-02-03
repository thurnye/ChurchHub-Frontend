import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Bookmark } from 'lucide-react-native';
import { Card, CardContent } from '@/shared/components/ui';
import { EmptyState } from '../component/EmptyState';
import { bibleBookmarks } from '@/data/mockData';
import { getBookName } from '../services/bibleService';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

export default function BibleBookmarksScreen() {
  const { from } = useLocalSearchParams<{
    from: string;
  }>();

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Bookmarks' navigateTo={from || '/bible'} />

      {bibleBookmarks.length === 0 ? (
        <EmptyState
          title='No bookmarks yet'
          description='Open the Bible reader, tap a verse, and tap "Bookmark" to save your place.'
        />
      ) : (
        <FlatList
          data={bibleBookmarks}
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
                    from:'/bible/bookmarks'
                  },
                })
              }
            >
              <Card>
                <CardContent>
                  <View className='flex-row items-center gap-3'>
                    <View className='w-9 h-9 bg-indigo-50 rounded-lg items-center justify-center flex-shrink-0'>
                      <Bookmark size={18} color='#4f46e5' fill='#4f46e5' />
                    </View>
                    <View className='flex-1'>
                      <Text className='font-medium text-sm text-gray-900'>
                        {item.label}
                      </Text>
                      <Text className='text-xs text-gray-500 mt-0.5'>
                        {getBookName(item.ref.bookId)} {item.ref.chapter}:
                        {item.ref.verse}
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
