import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, BookOpen, Type } from 'lucide-react-native';
import { Card, CardContent, Badge } from '@/shared/components/ui';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../redux/store';
import {
  loadBibles,
  loadBooks,
  setSelectedBibleId,
  setBooksFilter,
} from '../redux/bibleSlice';
import { BibleSearchInput } from '../component/BibleSearchInput';
import { FilterChip } from '../component/FilterChip';
import { BooksPickerSheet } from '../component/BooksPickerSheet';
import { TranslationsPickerSheet } from '../component/TranslationsPickerSheet';
import { EmptyState } from '../component/EmptyState';
import { LoadingSkeleton } from '../component/LoadingSkeleton';
import {
  searchPassage,
  type BibleSearchResult,
} from '../services/bibleService';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';

export default function BibleSearchScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { from } = useLocalSearchParams<{
    from: string;
  }>();
  const { bibles, selectedBibleId, books, booksFilter } = useSelector(
    (state: RootState) => state.bible,
  );

  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<BibleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showBooksPicker, setShowBooksPicker] = useState(false);
  const [showTranslationsPicker, setShowTranslationsPicker] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;
  const selectedBibleIdRef = useRef(selectedBibleId);
  selectedBibleIdRef.current = selectedBibleId;

  // Bootstrap: fetch bibles on mount
  useEffect(() => {
    dispatch(loadBibles());
  }, [dispatch]);

  // Fetch books on mount
  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  const runSearch = useCallback(async (text: string, bibleId: string) => {
    if (!text.trim() || !bibleId) {
      setAllResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchPassage(text.trim(), bibleId);
      setAllResults(data);
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.');
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-run search when translation changes and we already have a query
  useEffect(() => {
    if (queryRef.current.trim() && selectedBibleId) {
      runSearch(queryRef.current, selectedBibleId);
    }
  }, [selectedBibleId, runSearch]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setAllResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(
      () => runSearch(text, selectedBibleIdRef.current),
      500,
    );
  };

  const handleTranslationSelect = (bibleId: string) => {
    dispatch(setSelectedBibleId(bibleId));
    setShowTranslationsPicker(false);
  };

  const handleBookSelect = (bookId: string) => {
    dispatch(setBooksFilter(bookId));
    setShowBooksPicker(false);
  };

  // Derived state
  const displayResults =
    booksFilter === 'ALL'
      ? allResults
      : allResults.filter((r) => r.bookId === booksFilter);

  const selectedBible = bibles.find((b) => b.id === selectedBibleId);
  const selectedAbbr = selectedBible
    ? (selectedBible.abbreviationLocal ?? selectedBible.abbreviation)
    : '';

  const selectedBook =
    booksFilter !== 'ALL' ? books.find((b) => b.id === booksFilter) : null;
  const bookBadge = selectedBook
    ? (selectedBook.nameLocal ?? selectedBook.name)
    : undefined;

  const getBookName = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? (book.nameLocal ?? book.name) : bookId;
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Dark Header */}
      <HiddenScreensTopBar show={true} title='Search' navigateTo={from} />

      <View className='bg-white'>
        {/* Search Input */}
        <View className='px-4 pb-3'>
          <BibleSearchInput value={query} onChangeText={handleChangeText} />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='px-4 pb-3'
          contentContainerStyle={{ gap: 8 }}
        >
          <FilterChip
            icon={BookOpen}
            label='Books'
            badge={bookBadge}
            onPress={() => setShowBooksPicker(true)}
          />
          <FilterChip
            icon={Type}
            label='Translation'
            badge={selectedAbbr}
            onPress={() => setShowTranslationsPicker(true)}
          />
        </ScrollView>
      </View>

      {/* Body */}
      <View className='flex-1'>
        {loading && <LoadingSkeleton lines={5} />}

        {error && (
          <View className='flex-1 items-center justify-center px-6'>
            <Text className='text-sm text-red-500 text-center mb-3'>
              {error}
            </Text>
            <Pressable
              onPress={() => runSearch(query, selectedBibleId)}
              className='bg-indigo-600 px-5 py-2.5 rounded-xl'
            >
              <Text className='text-sm font-semibold text-white'>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && searched && displayResults.length === 0 && (
          <EmptyState
            title='No results found'
            description={`No verses match "${query}". Try a different reference or keyword.`}
          />
        )}

        {!loading && !error && !searched && (
          <EmptyState
            title='Search the Bible'
            description='Type a verse reference (e.g. "John 3:16") or a keyword to search across scripture.'
          />
        )}

        {!loading && !error && displayResults.length > 0 && (
          <FlatList
            data={displayResults}
            keyExtractor={(item, index) =>
              `${item.bookId}-${item.chapter}-${item.verse}-${index}`
            }
            contentContainerStyle={{ padding: 16, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/bible/reader',
                    params: {
                      translationId: item.translationId,
                      bookId: item.bookId,
                      chapter: String(item.chapter),
                      verse: String(item.verse),
                    },
                  })
                }
              >
                <Card>
                  <CardContent>
                    <View className='flex-row items-start justify-between gap-2 mb-1'>
                      <Text className='font-semibold text-sm text-gray-900'>
                        {item.bookName ||
                          `${getBookName(item.bookId)} ${item.chapter}:${item.verse}`}
                      </Text>
                      <Badge variant='secondary'>
                        {selectedAbbr || item.translationId.toUpperCase()}
                      </Badge>
                    </View>
                    <Text
                      className='text-xs text-gray-500 leading-relaxed'
                      numberOfLines={3}
                    >
                      {item.text}
                    </Text>
                  </CardContent>
                </Card>
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Bottom Sheets */}
      <BooksPickerSheet
        visible={showBooksPicker}
        books={books}
        currentFilter={booksFilter}
        onSelect={handleBookSelect}
        onClose={() => setShowBooksPicker(false)}
      />

      <TranslationsPickerSheet
        visible={showTranslationsPicker}
        currentBibleId={selectedBibleId}
        onSelect={handleTranslationSelect}
        onClose={() => setShowTranslationsPicker(false)}
      />
    </View>
  );
}
